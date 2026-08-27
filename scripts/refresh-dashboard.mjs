#!/usr/bin/env node
/**
 * Rebuilds dash/data.enc.json from the live systems.
 *
 * Run by .github/workflows/dashboard-refresh.yml on a schedule. The output is
 * encrypted with the same password (and the same salt) that already gates
 * /dash/, so the file can sit in a public repo without exposing lead names,
 * phone numbers or revenue.
 *
 * Usage:
 *   node scripts/refresh-dashboard.mjs            # fetch, encrypt, write if changed
 *   node scripts/refresh-dashboard.mjs --dry-run  # print the plaintext, write nothing
 *   node scripts/refresh-dashboard.mjs --force    # write even if nothing changed
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchBrevo, fetchCalcom, fetchStripe } from "./lib/sources.mjs";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LGPCrypto = require(join(ROOT, "dash/assets/lgp-crypto.js"));

const OUT_FILE = join(ROOT, "dash/data.enc.json");

/**
 * Must stay identical to the salt baked into the existing /dash/ pages and to
 * SALT in dash/index.html. Changing it invalidates the current password.
 */
const SALT = "c01b7c6c55b689e1ac19fb22b1bf8b9c";

/** Rewrite an unchanged file this often, so "last checked" proves liveness. */
const HEARTBEAT_HOURS = 6;

const DAY_MS = 24 * 60 * 60 * 1000;

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const FORCE = args.has("--force");

/* ------------------------------------------------------------ model build -- */

function countSince(items, field, days, now) {
  const cutoff = now - days * DAY_MS;
  return items.filter((item) => {
    const t = new Date(item[field] || 0).getTime();
    return Number.isFinite(t) && t >= cutoff;
  }).length;
}

/**
 * One reverse-chronological stream across all three systems, so the dashboard
 * can answer "what happened today" without cross-referencing three panels.
 */
function buildActivity({ leads, bookings, payments }) {
  const events = [];

  for (const lead of leads) {
    events.push({
      at: lead.createdAt,
      kind: "lead",
      title: lead.business || lead.name || lead.email || "New lead",
      detail: [lead.city, lead.source].filter(Boolean).join(" · "),
    });
  }
  for (const booking of bookings) {
    events.push({
      at: booking.start,
      kind: booking.status === "cancelled" ? "booking-cancelled" : "booking",
      title: booking.name || booking.title,
      detail: booking.status === "cancelled" ? "Cancelled" : booking.title,
    });
  }
  for (const payment of payments) {
    events.push({
      at: payment.at,
      kind: payment.refunded ? "refund" : "payment",
      title: payment.email || payment.description,
      detail: formatMoney(payment.amountCents, payment.currency),
    });
  }

  return events
    .filter((e) => e.at && Number.isFinite(new Date(e.at).getTime()))
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 40);
}

function formatMoney(cents, currency) {
  if (!Number.isFinite(cents)) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "usd").toUpperCase(),
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${Math.round(cents / 100)}`;
  }
}

function buildModel(sources, now) {
  const byId = Object.fromEntries(sources.map((s) => [s.id, s]));

  const leads = byId.brevo?.data?.leads ?? [];
  const bookings = byId.calcom?.data?.bookings ?? [];
  const upcoming = byId.calcom?.data?.upcoming ?? [];
  const subscriptions = byId.stripe?.data?.subscriptions ?? [];
  const payments = byId.stripe?.data?.payments ?? [];

  const nextWeek = now + 7 * DAY_MS;
  const mrrCents = byId.stripe?.data?.mrrCents ?? 0;
  const currency = byId.stripe?.data?.currency ?? "usd";

  return {
    kpis: {
      leads7d: { value: countSince(leads, "createdAt", 7, now), live: Boolean(byId.brevo?.ok) },
      leads30d: { value: countSince(leads, "createdAt", 30, now), live: Boolean(byId.brevo?.ok) },
      leadsTotal: { value: byId.brevo?.data?.total ?? 0, live: Boolean(byId.brevo?.ok) },
      bookingsUpcoming: { value: upcoming.length, live: Boolean(byId.calcom?.ok) },
      bookings7d: {
        value: upcoming.filter((b) => new Date(b.start).getTime() <= nextWeek).length,
        live: Boolean(byId.calcom?.ok),
      },
      activeClients: {
        value: subscriptions.filter((s) => s.status === "active").length,
        live: Boolean(byId.stripe?.ok),
      },
      mrr: { value: mrrCents, currency, live: Boolean(byId.stripe?.ok) },
    },
    leads: leads.slice(0, 50),
    bookings: {
      upcoming: upcoming.slice(0, 25),
      recent: bookings
        .filter((b) => b.start && new Date(b.start).getTime() < now)
        .slice(-15)
        .reverse(),
    },
    revenue: {
      mrrCents,
      currency,
      subscriptions,
      payments,
      truncated: Boolean(byId.stripe?.data?.truncated),
    },
    activity: buildActivity({ leads, bookings, payments }),
    sources: sources.map(({ data, ...meta }) => meta),
  };
}

/* ---------------------------------------------------------------- writing -- */

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUT_FILE, "utf8"));
  } catch {
    return null;
  }
}

function heartbeatDue(existing, now) {
  if (!existing?.generatedAt) return true;
  const age = now - new Date(existing.generatedAt).getTime();
  return !Number.isFinite(age) || age >= HEARTBEAT_HOURS * 60 * 60 * 1000;
}

async function main() {
  const password = process.env.DASH_PASSWORD;
  if (!password && !DRY_RUN) {
    console.error(
      "DASH_PASSWORD is not set.\n" +
        "Add it as a repository secret (Settings -> Secrets and variables -> Actions)\n" +
        "using the same password that already unlocks /dash/."
    );
    process.exit(1);
  }

  const now = Date.now();
  const sources = await Promise.all([fetchBrevo(process.env), fetchCalcom(process.env), fetchStripe(process.env)]);

  for (const s of sources) {
    const status = s.ok ? "ok" : s.configured ? "FAILED" : "not configured";
    console.log(`  ${s.id.padEnd(7)} ${status.padEnd(16)} ${s.error ?? s.detail}`);
  }

  const model = buildModel(sources, now);

  // Fingerprint the payload without the timestamp, so an unchanged refresh does
  // not produce a diff and spam the repo with commits every quarter hour.
  const fingerprint = await LGPCrypto.sha256Hex(JSON.stringify(model));

  if (DRY_RUN) {
    console.log(JSON.stringify({ fingerprint, ...model }, null, 2));
    return;
  }

  const existing = await readExisting();
  if (!FORCE && existing?.fingerprint === fingerprint && !heartbeatDue(existing, now)) {
    console.log(`No change since ${existing.generatedAt} — leaving ${OUT_FILE} untouched.`);
    return;
  }

  const generatedAt = new Date(now).toISOString();
  const key = await LGPCrypto.deriveKey(password, SALT);
  const payload = await LGPCrypto.encrypt(JSON.stringify({ generatedAt, ...model }), key);

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(
    OUT_FILE,
    // salt, generatedAt and fingerprint stay in the clear on purpose: the page
    // needs them before it can decrypt, and none of them reveal any data.
    JSON.stringify({ v: 1, alg: "aes-256-cbc+hmac-sha256", salt: SALT, generatedAt, fingerprint, payload }, null, 0) +
      "\n"
  );

  console.log(`Wrote ${OUT_FILE} (${payload.length} hex chars, fingerprint ${fingerprint.slice(0, 12)}).`);
}

main().catch((err) => {
  console.error("Refresh failed:", err);
  process.exit(1);
});
