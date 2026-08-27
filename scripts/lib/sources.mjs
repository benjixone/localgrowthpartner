/**
 * Live data sources for the LGP dashboard.
 *
 * House rules for everything in here:
 *   - Never throw. A source that is down, rate-limited or not yet configured
 *     reports itself as such and the dashboard keeps rendering every other
 *     panel. One dead API must not blank the cockpit.
 *   - Never invent numbers. If we could not read it, the panel says so rather
 *     than showing a stale or zeroed figure that looks real.
 *   - Return shape is always { id, label, configured, ok, detail, error, data }.
 */

const TIMEOUT_MS = 15000;

/** Shorthand for the "no key in the environment" result. */
function notConfigured(id, label, envVar) {
  return {
    id,
    label,
    configured: false,
    ok: false,
    detail: `Not connected — set ${envVar}`,
    error: null,
    data: null,
  };
}

function failed(id, label, error) {
  return {
    id,
    label,
    configured: true,
    ok: false,
    detail: "Connected, but this refresh failed",
    error: String(error && error.message ? error.message : error).slice(0, 300),
    data: null,
  };
}

async function getJSON(url, options = {}) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ""}`);
  }
  return res.json();
}

/* ------------------------------------------------------------------ Brevo -- */

/**
 * Leads. The site's forms POST into Brevo with the attributes wired up in
 * index.html / scan/index.html: BUSINESS, CITY, PHONE_TXT, LEADSOURCE.
 */
export async function fetchBrevo(env) {
  const key = env.BREVO_API_KEY;
  if (!key) return notConfigured("brevo", "Brevo — leads", "BREVO_API_KEY");

  try {
    const url = "https://api.brevo.com/v3/contacts?limit=100&offset=0&sort=desc";
    const json = await getJSON(url, { headers: { "api-key": key, accept: "application/json" } });

    const contacts = Array.isArray(json.contacts) ? json.contacts : [];
    const leads = contacts.map((c) => {
      const a = c.attributes || {};
      return {
        id: String(c.id),
        email: c.email || "",
        business: a.BUSINESS || a.COMPANY || "",
        city: a.CITY || "",
        phone: a.PHONE_TXT || a.SMS || "",
        source: a.LEADSOURCE || "",
        name: [a.FIRSTNAME, a.LASTNAME].filter(Boolean).join(" "),
        createdAt: c.createdAt || null,
        blocklisted: Boolean(c.emailBlacklisted),
      };
    });

    // Brevo returns newest-first already, but ordering is not contractual.
    leads.sort((x, y) => new Date(y.createdAt || 0) - new Date(x.createdAt || 0));

    return {
      id: "brevo",
      label: "Brevo — leads",
      configured: true,
      ok: true,
      detail: `${json.count ?? leads.length} contacts`,
      error: null,
      data: { leads, total: json.count ?? leads.length },
    };
  } catch (err) {
    return failed("brevo", "Brevo — leads", err);
  }
}

/* ---------------------------------------------------------------- Cal.com -- */

/**
 * Bookings. Tries the v2 API and falls back to v1, because Cal.com keys issued
 * at different times work against different versions and we would rather fall
 * back than show an empty bookings panel.
 */
export async function fetchCalcom(env) {
  const key = env.CALCOM_API_KEY;
  if (!key) return notConfigured("calcom", "Cal.com — bookings", "CALCOM_API_KEY");

  const normalise = (b) => {
    const attendees = Array.isArray(b.attendees) ? b.attendees : [];
    const primary = attendees[0] || {};
    return {
      id: String(b.id ?? b.uid ?? ""),
      title: b.title || "Booking",
      start: b.startTime || b.start || null,
      end: b.endTime || b.end || null,
      status: String(b.status || "").toLowerCase(),
      name: primary.name || "",
      email: primary.email || "",
      // Cal.com omits this on some plans; only surface it when it is real.
      meetingUrl: b.meetingUrl || b.location || "",
    };
  };

  const attempts = [
    {
      version: "v2",
      url: "https://api.cal.com/v2/bookings?take=100",
      headers: { Authorization: `Bearer ${key}`, "cal-api-version": "2024-08-13" },
      pick: (j) => (Array.isArray(j.data) ? j.data : []),
    },
    {
      version: "v1",
      url: `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(key)}`,
      headers: { accept: "application/json" },
      pick: (j) => (Array.isArray(j.bookings) ? j.bookings : []),
    },
  ];

  let lastError = null;
  for (const attempt of attempts) {
    try {
      const json = await getJSON(attempt.url, { headers: attempt.headers });
      const bookings = attempt.pick(json).map(normalise);
      bookings.sort((x, y) => new Date(x.start || 0) - new Date(y.start || 0));

      const now = Date.now();
      const upcoming = bookings.filter(
        (b) => b.start && new Date(b.start).getTime() >= now && b.status !== "cancelled"
      );

      return {
        id: "calcom",
        label: "Cal.com — bookings",
        configured: true,
        ok: true,
        detail: `${upcoming.length} upcoming (API ${attempt.version})`,
        error: null,
        data: { bookings, upcoming },
      };
    } catch (err) {
      lastError = err;
    }
  }
  return failed("calcom", "Cal.com — bookings", lastError);
}

/* ----------------------------------------------------------------- Stripe -- */

/** Normalise any Stripe billing interval to cents per month. */
function toMonthlyCents(unitAmount, quantity, recurring) {
  if (!unitAmount || !recurring) return 0;
  const gross = unitAmount * (quantity || 1);
  const count = recurring.interval_count || 1;
  switch (recurring.interval) {
    case "month":
      return gross / count;
    case "year":
      return gross / (12 * count);
    case "week":
      return (gross * 52) / (12 * count);
    case "day":
      return (gross * 365) / (12 * count);
    default:
      return 0;
  }
}

/**
 * Recurring revenue and recent payments. The pricing toggle on the homepage
 * bills monthly / quarterly / yearly, so MRR has to be normalised rather than
 * summed — otherwise an annual plan reads as a huge one-month spike.
 */
export async function fetchStripe(env) {
  const key = env.STRIPE_API_KEY;
  if (!key) return notConfigured("stripe", "Stripe — revenue", "STRIPE_API_KEY");

  const headers = { Authorization: `Bearer ${key}` };

  try {
    const [active, trialing, charges] = await Promise.all([
      getJSON("https://api.stripe.com/v1/subscriptions?status=active&limit=100", { headers }),
      getJSON("https://api.stripe.com/v1/subscriptions?status=trialing&limit=100", { headers }),
      getJSON("https://api.stripe.com/v1/charges?limit=25", { headers }),
    ]);

    const subs = [...(active.data || []), ...(trialing.data || [])];
    let mrrCents = 0;
    let currency = "usd";

    const subscriptions = subs.map((s) => {
      const items = (s.items && s.items.data) || [];
      let subMonthly = 0;
      for (const item of items) {
        const price = item.price || {};
        if (price.currency) currency = price.currency;
        subMonthly += toMonthlyCents(price.unit_amount, item.quantity, price.recurring);
      }
      mrrCents += subMonthly;
      return {
        id: s.id,
        status: s.status,
        customer: typeof s.customer === "string" ? s.customer : s.customer?.id || "",
        monthlyCents: Math.round(subMonthly),
        currency,
        startedAt: s.start_date ? new Date(s.start_date * 1000).toISOString() : null,
        renewsAt: s.current_period_end ? new Date(s.current_period_end * 1000).toISOString() : null,
        cancelAtPeriodEnd: Boolean(s.cancel_at_period_end),
      };
    });

    const payments = (charges.data || [])
      .filter((c) => c.status === "succeeded")
      .map((c) => ({
        id: c.id,
        amountCents: c.amount,
        currency: c.currency,
        description: c.description || c.calculated_statement_descriptor || "Payment",
        email: c.billing_details?.email || c.receipt_email || "",
        at: c.created ? new Date(c.created * 1000).toISOString() : null,
        refunded: Boolean(c.refunded),
      }));

    return {
      id: "stripe",
      label: "Stripe — revenue",
      configured: true,
      ok: true,
      detail: `${subscriptions.length} active/trialing`,
      error: null,
      data: {
        subscriptions,
        payments,
        mrrCents: Math.round(mrrCents),
        currency,
        // A truncated page would understate MRR, so flag it instead of lying.
        truncated: Boolean(active.has_more || trialing.has_more),
      },
    };
  } catch (err) {
    return failed("stripe", "Stripe — revenue", err);
  }
}

export const ALL_SOURCES = [fetchBrevo, fetchCalcom, fetchStripe];
