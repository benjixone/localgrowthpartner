# The dashboard

`/dash/` shows live leads, booked calls and revenue. It refreshes itself — you
should never have to rebuild or re-upload it.

## How it works

```
GitHub Actions (every 15 min)
  └─ scripts/refresh-dashboard.mjs
       ├─ Brevo    → leads
       ├─ Cal.com  → booked calls
       ├─ Stripe   → subscriptions + payments
       ├─ encrypts everything with DASH_PASSWORD
       └─ commits dash/data.enc.json (only when something actually changed)

Browser at /dash/
  └─ asks for the password once, then polls data.enc.json every 60s
     and re-renders in place — no reload, no re-deploy
```

The data file is encrypted with the **same password and salt** that already
gated the old dashboard, so your existing password keeps working and the scan
reports in `dash/r/` are untouched. Because it is encrypted, it is safe to sit
in a public repo: lead names, phone numbers and revenue are unreadable without
the password.

## Turning it on

Add these under **Settings → Secrets and variables → Actions**:

| Secret | Required | Where to get it |
| --- | --- | --- |
| `DASH_PASSWORD` | yes | The password that opens `/dash/` |
| `BREVO_API_KEY` | leads + email stats | Brevo → SMTP & API → API keys |
| `CALCOM_API_KEY` | booked calls | Cal.com → Settings → Developer → API keys |
| `STRIPE_API_KEY` | revenue | Stripe → Developers → API keys (a restricted key with **read** on subscriptions and charges is enough) |
| `META_ACCESS_TOKEN` | ad spend | Meta → Business Settings → System users → Generate token (`ads_read`) |
| `META_AD_ACCOUNT_ID` | ad spend | The `act_…` id of the ad account, from Ads Manager |

Then open **Actions → Dashboard refresh → Run workflow** once. The dashboard
picks the data up within a minute.

Only `DASH_PASSWORD` is mandatory. Any feed whose key is missing shows as
"not connected" in the **Data feeds** panel rather than silently reading zero —
so the dashboard never shows a number it cannot back up.

## Reading the status light

The dot next to the title, and the timestamp beside it, tell you whether to
trust what you are looking at:

- **green** — refreshed recently, data is current
- **amber** — no successful refresh in 45 minutes, or no data file yet; the
  refresher may be stalled, so check the Actions tab
- **red** — the page cannot reach the data file at all

## Expected lag

Worst case is roughly 15–20 minutes: up to 15 for the next scheduled run, about
a minute for GitHub Pages to publish the commit, and up to 60 seconds for the
open page to poll. Hit **Refresh** in the corner to skip the last step, or run
the workflow manually to skip the first.

Scheduled runs only happen on the repository's **default branch** — that is a
GitHub rule, not a setting here. On a feature branch, use *Run workflow*.

## Working on it locally

```bash
# See exactly what would be published, without writing or encrypting anything
node scripts/refresh-dashboard.mjs --dry-run

# Write the encrypted file even if nothing changed
DASH_PASSWORD='…' BREVO_API_KEY='…' node scripts/refresh-dashboard.mjs --force

# Serve it — WebCrypto needs https or localhost, so opening the file
# directly with file:// will not work
npx http-server . -p 8899 -c-1   # then visit http://127.0.0.1:8899/dash/
```

## Files

| Path | What it is |
| --- | --- |
| `dash/index.html` | The dashboard. Renders from `data.enc.json`; holds no data itself. |
| `dash/data.enc.json` | Encrypted live data. Written by the workflow — never edit by hand. |
| `dash/assets/lgp-crypto.js` | Encryption shared by the page and the refresher, so the two cannot drift apart. |
| `dash/cockpit.enc.json` | Encrypted call cockpit: payment links, working links, call script. See below. |
| `dash/legacy-snapshot.html` | The previous hand-baked dashboard, kept for reference. Frozen; nothing updates it. |
| `dash/r/*.html` | Per-client scan reports. Deliberately static — unchanged by any of this. |
| `scripts/refresh-dashboard.mjs` | Fetches, normalises, encrypts, writes. |
| `scripts/lib/sources.mjs` | One adapter per system. Each fails soft. |

## Editing the call cockpit

The cockpit (payment links, onboarding/agreement/pricing/Cal links, and the
CUPPP call script) is proprietary, so its plaintext is **not** in this repo —
only the encrypted `dash/cockpit.enc.json`. It is not on a schedule; it changes
when you decide it does.

To edit it, decrypt the current one, change it, and re-encrypt:

```bash
# Keep the plaintext outside the repo — it must never be committed.
DASH_PASSWORD='…' node scripts/encrypt-cockpit.mjs ~/lgp-cockpit.json
git add dash/cockpit.enc.json && git commit -m "cockpit update"
```

The source is `{ links: [{label, url, kind}], callScript: "markdown" }`, where
`kind: "pay"` renders a link as an orange payment button. Only `http(s)` URLs
are rendered; anything else is dropped by the page.

The cockpit loads independently of the API feeds, so it is there even when
nothing else is connected — it is what you open during a call.

## A note on the password

`data.enc.json` and `cockpit.enc.json` sit in a **public** repository. Their
encryption is the only thing standing between a passer-by and your leads' names,
emails and phone numbers, so the password is doing real work: anyone can clone
the repo and attack it offline, at whatever speed their hardware allows.

600k PBKDF2 rounds makes each guess expensive, but that only matters if the
password is not guessable. A single dictionary word — in any language — falls to
a wordlist regardless of the iteration count. Use a long random passphrase from
a password manager, and if the current one is a single word, change it: set the
new value as `DASH_PASSWORD`, re-run the workflow, and re-encrypt the cockpit.

The scan reports in `dash/r/` are encrypted with the original password and are
independent of `DASH_PASSWORD`; rotating one does not affect the other.

## Adding another source

Write a function in `scripts/lib/sources.mjs` returning
`{ id, label, configured, ok, detail, error, data }` — never throwing — then
fold its numbers into `buildModel()` in `scripts/refresh-dashboard.mjs`. It
shows up in the **Data feeds** panel automatically.
