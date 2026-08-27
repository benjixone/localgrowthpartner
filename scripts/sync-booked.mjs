#!/usr/bin/env node
/**
 * Writes booking state from Cal.com back into Brevo.
 *
 * Without this, a lead who booked and a lead who ghosted are identical records
 * in Brevo — same list, same attributes — so a "you still haven't booked"
 * sequence goes to people who already have a call on the calendar.
 *
 * The page-side write in thanks/index.html tags the contact the instant they
 * book, which covers the common path. This job is the backstop for everything
 * that never touches that page: booking from a different device, booking days
 * later off a link in a follow-up email, and cancellations (which have no
 * page-side moment at all).
 *
 * House rules, same as lib/sources.mjs:
 *   - Never throw. A Brevo hiccup must not fail the workflow or block the
 *     dashboard commit that runs alongside it.
 *   - Only write when a value actually changes, so a quarter-hourly run does
 *     not burn API quota re-stamping contacts that are already correct.
 *
 * Usage:
 *   node scripts/sync-booked.mjs            # reconcile Cal.com -> Brevo
 *   node scripts/sync-booked.mjs --dry-run  # report what would change, write nothing
 */

import { fetchCalcom } from "./lib/sources.mjs";

const TIMEOUT_MS = 15000;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * How far back a booking still says something about a contact's email state.
 * Someone who booked a year ago should not be kept out of a fresh campaign,
 * and bounding the window also keeps us clear of the API's 100-record ceiling.
 */
const LOOKBACK_DAYS = 90;

/** Cal.com statuses that mean the call is not happening. */
const DEAD_STATUSES = new Set(["cancelled", "canceled", "rejected"]);

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

/* ----------------------------------------------------------------- brevo -- */

async function brevo(path, { method = "GET", key, body } = {}) {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method,
    headers: {
      "api-key": key,
      accept: "application/json",
      ...(body ? { "content-type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // 204 (updated) and 201 (created) have no body worth parsing.
  if (res.status === 204 || res.status === 201) return null;

  const text = await res.text().catch(() => "");
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* Brevo occasionally returns a bare string on error; keep the text. */
  }

  if (!res.ok) {
    const err = new Error(`${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}

/**
 * Brevo rejects a write to an attribute the account has never declared, so the
 * very first run has to create them. Re-creating an existing attribute answers
 * 400; that is the success case on every run after the first.
 */
async function ensureAttributes(key) {
  const wanted = [
    ["BOOKED", "text"], // "yes" / "no" — the one field every sequence branches on
    ["BOOKING_STATUS", "text"], // upcoming | completed | cancelled
    ["BOOKED_AT", "date"], // call date, so Brevo can fire day-before reminders
    ["BOOKING_START", "text"], // full ISO timestamp, for merge tags in the email
  ];

  for (const [name, type] of wanted) {
    try {
      await brevo(`/contacts/attributes/normal/${encodeURIComponent(name)}`, {
        method: "POST",
        key,
        body: { type },
      });
      console.log(`  created attribute ${name} (${type})`);
    } catch (err) {
      if (err.status === 400) continue; // already exists
      console.log(`  could not ensure attribute ${name}: ${err.message}`);
    }
  }
}

/* ------------------------------------------------------------ derivation -- */

/**
 * Reduce every booking for one email down to the state their email should be
 * in. Exported so the logic can be tested without touching a live API.
 *
 * Precedence: an upcoming call wins over a past one, and any live booking wins
 * over a cancellation — so someone who cancels and rebooks reads as booked,
 * and someone who cancels their only call falls back into the chase.
 */
export function deriveBookingState(bookings, now = Date.now()) {
  const live = bookings.filter((b) => !DEAD_STATUSES.has(String(b.status || "").toLowerCase()));

  if (live.length === 0) {
    return { BOOKED: "no", BOOKING_STATUS: "cancelled" };
  }

  const withTime = live
    .map((b) => ({ ...b, t: new Date(b.start || 0).getTime() }))
    .filter((b) => Number.isFinite(b.t) && b.t > 0);

  if (withTime.length === 0) {
    // Booked, but Cal.com gave us no usable start time. Still not a chase target.
    return { BOOKED: "yes", BOOKING_STATUS: "upcoming" };
  }

  const upcoming = withTime.filter((b) => b.t >= now).sort((a, b) => a.t - b.t);
  const past = withTime.filter((b) => b.t < now).sort((a, b) => b.t - a.t);
  const chosen = upcoming[0] || past[0];
  const iso = new Date(chosen.t).toISOString();

  return {
    BOOKED: "yes",
    BOOKING_STATUS: upcoming.length > 0 ? "upcoming" : "completed",
    BOOKED_AT: iso.slice(0, 10), // Brevo date attributes want YYYY-MM-DD
    BOOKING_START: iso,
  };
}

/** True when Brevo already holds exactly this state, so the write is a no-op. */
function alreadyCorrect(current = {}, desired) {
  return Object.entries(desired).every(([k, v]) => String(current[k] ?? "") === String(v));
}

/* -------------------------------------------------------------------- run -- */

async function main() {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.log("BREVO_API_KEY is not set — skipping the booked-state sync.");
    return;
  }

  const cal = await fetchCalcom(process.env);
  if (!cal.ok) {
    console.log(`Cal.com unavailable (${cal.error ?? cal.detail}) — nothing to sync.`);
    return;
  }

  const cutoff = Date.now() - LOOKBACK_DAYS * DAY_MS;
  const recent = (cal.data.bookings ?? []).filter((b) => {
    if (!b.email) return false; // nothing to key on
    const t = new Date(b.start || 0).getTime();
    return !Number.isFinite(t) || t === 0 || t >= cutoff;
  });

  /* One contact can hold several bookings (rebooked, cancelled then rebooked). */
  const byEmail = new Map();
  for (const b of recent) {
    const email = b.email.trim().toLowerCase();
    if (!byEmail.has(email)) byEmail.set(email, []);
    byEmail.get(email).push(b);
  }

  if (byEmail.size === 0) {
    console.log("No bookings in the window — nothing to sync.");
    return;
  }

  if (!DRY_RUN) await ensureAttributes(key);

  const now = Date.now();
  let changed = 0;
  let unchanged = 0;
  let created = 0;
  let failed = 0;

  for (const [email, bookings] of byEmail) {
    const desired = deriveBookingState(bookings, now);

    try {
      let current = null;
      try {
        const contact = await brevo(`/contacts/${encodeURIComponent(email)}`, { key });
        current = contact?.attributes ?? {};
      } catch (err) {
        if (err.status !== 404) throw err;
        // Booked without ever filling the form — Brevo has never seen them.
      }

      if (current && alreadyCorrect(current, desired)) {
        unchanged += 1;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  would set ${email} -> ${JSON.stringify(desired)}${current ? "" : " (new contact)"}`);
        if (current === null) created += 1;
        changed += 1;
        continue;
      }

      const listId = Number(process.env.BREVO_LIST_ID);
      await brevo("/contacts", {
        method: "POST",
        key,
        body: {
          email,
          attributes: desired,
          updateEnabled: true, // create or update in one call
          ...(current === null && Number.isFinite(listId) && listId > 0
            ? { listIds: [listId] }
            : {}),
        },
      });

      if (current === null) created += 1;
      changed += 1;
      console.log(`  ${email} -> ${desired.BOOKED}/${desired.BOOKING_STATUS}${current === null ? " (created)" : ""}`);
    } catch (err) {
      failed += 1;
      console.log(`  ${email} FAILED: ${err.message}`);
    }
  }

  console.log(
    `Booked-state sync: ${changed} updated (${created} new), ${unchanged} already correct, ${failed} failed.`
  );
}

/* Only run when invoked directly, so tests can import deriveBookingState. */
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    // Never fail the workflow: the dashboard commit runs in the same job.
    console.log(`Booked-state sync could not run: ${err && err.message ? err.message : err}`);
  });
}
