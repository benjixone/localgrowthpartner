# Lead email flow

How a lead moves from the form to a booked call, and which email they get at
each point. Written to be built in Brevo in about an hour.

## The problem this fixes

Until now, booking state never reached Brevo. A lead who booked and a lead who
ghosted were byte-for-byte identical contacts — same list, same attributes —
so nothing downstream could tell them apart. Any chase sequence went to
everyone, including people with a call already on the calendar.

## The data model

Four attributes carry booking state. Everything below branches on them.

| Attribute        | Type | Values                              | Meaning |
|------------------|------|-------------------------------------|---------|
| `BOOKED`         | text | `yes` / `no`                        | The one field every sequence branches on |
| `BOOKING_STATUS` | text | `upcoming` / `completed` / `cancelled` | Where they are relative to the call |
| `BOOKED_AT`      | date | `YYYY-MM-DD`                        | Call date — drives the day-before reminder |
| `BOOKING_START`  | text | ISO timestamp                       | Full date+time, for merge tags in the email |

They are created automatically on the first sync run, so there is nothing to
set up by hand in Brevo's attribute screen.

### What writes them

**1. The page, the instant they book** — `thanks/index.html`, in the Cal.com
`bookingSuccessful` callback. Fires within a second of booking, so a lead can
never receive a chase email in the gap. If they book under a different email
than they typed into the form, *both* addresses are tagged — the sequence runs
on the form address, so that one has to be stopped too.

**2. The sync job, every 15 minutes** — `scripts/sync-booked.mjs`, on the
existing dashboard-refresh workflow. Reads Cal.com as the source of truth and
reconciles Brevo to match. This is the backstop for everything the page cannot
see:

- booking from a different device, or after clearing cookies
- booking days later from a link in a follow-up email
- **cancellations** — no page-side moment exists at all, so only the sync
  catches these. A cancelled lead flips back to `BOOKED = no` and re-enters
  the chase, which is what you want.
- booking straight from the Cal.com link without ever filling the form — the
  contact is created in Brevo rather than staying invisible

The job derives state from Cal.com fresh each run, so it is idempotent and
self-healing: if a write fails, the next run fixes it. It only writes when a
value actually changed.

Optional: set a `BREVO_LIST_ID` repo secret to drop never-seen-before bookers
into a specific list. Without it they are still created and tagged, just
unlisted.

---

## Automation A — didn't book (the chase)

**Entry:** contact added to your leads list.
**Structure:** before *every* send, a condition step on `BOOKED = no`. If it
reads `yes`, exit the automation.

> **This is the part people get wrong.** Checking `BOOKED` only at entry means
> someone who books on day 2 still receives emails 3, 4 and 5. The condition
> has to sit in front of each individual send.

### 1 — 20 minutes after the form

**Subject:** your scan is running
**Preview:** takes us a few hours, here's what happens next

> Hi {{contact.FIRSTNAME | default: "there"}},
>
> We got your details for {{contact.BUSINESS}} and your scan is running now.
>
> What we're pulling: what ChatGPT and Google actually say about you when
> someone in {{contact.CITY}} asks for a business like yours, and which
> competitors come back ahead of you.
>
> The scan is yours either way. The 15 minutes is where it's worth something,
> because we walk you through what we found and what we'd fix first.
>
> [Book your 15 minutes →](https://cal.com/goldenclients/scan)
>
> — Ben

### 2 — day 1

**Subject:** what ChatGPT says about {{contact.BUSINESS}}
**Preview:** the short version, before we walk you through it

> Your scan is back.
>
> The pattern we see almost every time: the business isn't invisible, it's
> just not the one getting named. Someone asks ChatGPT for the best option in
> {{contact.CITY}} and three names come back. Being the fourth is the same as
> not being there.
>
> There's usually a specific reason yours isn't in that list, and it's usually
> fixable. We'd rather show you on a screen than write it out — it takes two
> minutes to see and a page to describe.
>
> [Pick a time →](https://cal.com/goldenclients/scan)
>
> — Ben

### 3 — day 3

**Subject:** what the 15 minutes actually is
**Preview:** no deck, no pitch, screen share

> Straight about what happens on the call, since "book a call" can mean
> anything:
>
> - We share a screen and show you your scan. What ChatGPT and Google say
>   about you, who's ahead, and why.
> - We tell you what we'd fix first, in what order.
> - You keep the report whether or not we work together.
> - If you're not a fit, we say so on the call. It happens and it's fine.
>
> Fifteen minutes, and it's the same fifteen whether you hire us or not.
>
> [Grab a slot →](https://cal.com/goldenclients/scan)
>
> — Ben

### 4 — day 6

**Subject:** {{contact.CITY}}
**Preview:** on how we take on businesses

> Quick note on how we work: we take one business per category per city. It's
> the only way the work makes sense — we can't push two competitors up the
> same list.
>
> {{contact.CITY}} is open right now for your category. If someone nearby
> starts first, we're not able to take you on.
>
> Not a countdown, just how it works.
>
> [Book while it's open →](https://cal.com/goldenclients/scan)
>
> — Ben

> ⚠️ **Only send this if it is literally true.** If you are not actually
> holding a city, cut this email. A scarcity claim you can't back is worse
> than no email.

### 5 — day 10 (breakup)

**Subject:** closing your file
**Preview:** last one from me

> I'll stop emailing after this.
>
> Your scan for {{contact.BUSINESS}} is done and it's yours. If you want it
> without a call, reply "send it" and I'll send it over.
>
> If the timing's just wrong, reply and tell me when — I'll close the file and
> come back then instead.
>
> — Ben
>
> [Or book the 15 minutes →](https://cal.com/goldenclients/scan)

Breakup emails reliably pull the most replies in a chase. Keep it last and
keep it short.

---

## Automation B — booked

**Entry:** attribute `BOOKED` changes to `yes`.
**Guard:** condition on `BOOKING_STATUS = upcoming`.

### 1 — immediately

**Subject:** you're booked — {{contact.BOOKED_AT}}
**Preview:** what to have ready

> You're on for {{contact.BOOKED_AT}}.
>
> Cal.com sent the calendar invite separately — the Google Meet link is inside
> it. Add it to your calendar now and you won't have to hunt for it.
>
> To get the most out of the 15 minutes, have handy:
>
> - the login for your Google Business Profile, if you have it
> - the one competitor who annoys you most
>
> Neither is required. It just means we spend the time on your answers instead
> of on setup.
>
> — Ben
>
> Need to move it? The reschedule link is in the invite.

This is the only email from *your* brand that a booked lead currently gets —
everything else is Cal.com's. It's worth sending.

### 2 — day before the call

Build this as a **date-based automation** on `BOOKED_AT`, set to fire 1 day
before, guarded on `BOOKING_STATUS = upcoming`.

> ⚠️ **The `BOOKING_STATUS` guard is not optional here.** When a booking is
> cancelled the sync sets `BOOKED = no`, but it leaves the old `BOOKED_AT`
> date in place — Brevo has no reliable way to blank a date attribute, and a
> failed clear would cost us the `BOOKED = no` write that matters more. So the
> stale date still sits on the contact, and without the status guard this
> automation will cheerfully send "tomorrow, 15 minutes" to someone who
> cancelled. That is the same bug we just fixed, in a new place.

**Subject:** tomorrow, 15 minutes
**Preview:** Google Meet link is in your calendar invite

> Quick reminder — we're on tomorrow.
>
> The Meet link is in the calendar invite from Cal.com. If you can't find it,
> reply here and I'll resend.
>
> If tomorrow stopped working, use the reschedule link in the invite rather
> than no-showing. Takes ten seconds and I'll pick a better time.
>
> — Ben

### 3 — cancelled

The sync flips a cancelled booking to `BOOKED = no` and
`BOOKING_STATUS = cancelled` within 15 minutes, which drops them back into
Automation A. That's usually the right behaviour — they're a live lead who
hasn't talked to you yet.

If you'd rather they get something softer than the standard chase, add a
condition at the top of Automation A on `BOOKING_STATUS = cancelled` and route
those to a single email instead:

**Subject:** want to pick a new time?
> Saw the call came off the calendar — no problem. If it was just timing,
> here's the link to grab a better slot. If you'd rather I just send the scan
> over, reply and say so.

### 4 — no-show

Cal.com doesn't report no-shows through the API, so this can't be automated
from here. Once a call has passed, `BOOKING_STATUS` reads `completed`, which
tells you they *had* a booking, not whether they turned up. Handle no-shows by
hand from the Cal.com dashboard for now — at current volume that's a minute a
week.

---

## Two things to check in Brevo

Neither is visible from the code, so these need eyes on the dashboard.

**1. Double opt-in on the signup form.** The site posts to a Brevo-hosted form
endpoint (`index.html`, `SIB_URL`). If that form has double opt-in enabled,
contacts land *unconfirmed* and receive no automation email at all. If leads
are arriving but nothing sends, this is the first place to look.

**2. The `/thanks/` redirect belongs to Brevo, not to us.** Brevo's form
configuration is what sends people to `/thanks/` after submitting — there is
no redirect in our own code. If that setting is ever changed or cleared, leads
land on a Brevo page, never see the calendar, and booking silently drops to
zero with nothing in the repo to explain it. Worth knowing it's load-bearing.

---

## Checking it works

    node scripts/sync-booked.mjs --dry-run

Prints what it would change and writes nothing. With no API keys set it exits
cleanly and does nothing, so it's safe to run anywhere.

After the first real run, open any contact in Brevo who has booked and confirm
`BOOKED` reads `yes`. That contact should now be excluded from Automation A by
the condition steps.
