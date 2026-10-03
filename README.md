# Finovex website + CRM

Static frontend (public/) + Express backend (server.js) with a lightweight CRM.

## Quick start
    npm install
    cp .env.example .env      # set ADMIN_TOKEN now, SMTP later
    npm run dev                # http://localhost:3000 · CRM at /admin

## Email routing (automatic)
- HEDG enquiries → finance@hedg.business
- SORT.it enquiries → company@we-sort-it.in
- Everything else → company@finovexalgorithm.com (also used in the footer)

Until SMTP env vars are set, emails are logged to the server console and every
enquiry/autoreply is recorded in the CRM email log. Configure later in .env:
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, SITE_URL.

## Pages
- `/` home · `/products` (scroll showcase) · `/hedg` (incl. pricing) · `/sortit`
  · `/services` · `/faq` · `/contact` · `/privacy` · `/terms`
- `/pricing` permanently redirects to `/hedg#pricing`

## CRM
- /admin — token login (ADMIN_TOKEN from .env)
- **Leads**: status pipeline (new/contacted/qualified/won/lost), internal notes,
  per-lead email log, search + filters, CSV export
- **Contacts**: everyone who gave an email (pop-up, waitlists, contact form,
  notify requests), their interests (HEDG / SORT.it / services), visits and
  pages viewed, and their automated emails. Unsubscribe/resubscribe, CSV export.
- **Automations**: email sequences (Welcome, HEDG interest, SORT.it interest),
  each can be paused; the email queue with per-email cancel.
- Waitlist signups, "notify me" requests, stats
- Data lives in data/crm.db (SQLite). Backup = copy the file.

### Cookies, visitors and automated emails (crm.js)
- A cookie banner asks for consent. "Accept all" sets a first-party visitor
  cookie (`fx_vid`, 1 year) so page views build up a visitor's interests;
  "Essential only" sets nothing beyond the choice itself.
- When someone gives their email, the contact is linked to their visitor
  cookie and inherits the products they browsed.
- Only explicit opt-ins (pop-up, waitlist, contact-form checkbox) get
  marketing emails. Enquiries alone get the transactional acknowledgement.
- Sequences (edit copy and timing in `SEQUENCES` in crm.js):
  - Welcome: immediately on subscribe / waitlist
  - HEDG interest: day 1 "How HEDG runs your finance office", day 4 "HEDG plans"
  - SORT.it interest: day 3 "What SORT.it will do for your money"
  - A subscriber who later browses /hedg or /sortit is enrolled in that sequence
- The scheduler checks the queue every minute. Without SMTP, emails wait in
  the queue (and expire after 14 days); add SMTP to .env and they send.
- Every email has a one-click unsubscribe link (`/u/<token>`) and
  List-Unsubscribe headers. Set SITE_URL in .env to your live domain so links
  in emails point to it.

## SEO / performance
- Unique titles, descriptions, canonicals, OG/Twitter tags per page; JSON-LD
  (Organization, SoftwareApplication, FAQPage); robots.txt + sitemap.xml
- `npm run build` minifies HTML/CSS/JS into dist/ — deploy that folder
- Add a 1200×630 og.png in public/ before launch; update the domain in
  sitemap.xml/robots.txt/canonicals if it differs; submit the sitemap in
  Google Search Console

## Editing
- Pricing amounts: hedg.html, #pricing section (data-m / data-a attributes),
  and the "HEDG plans" email in crm.js
- FAQs: faq.html (questions + the FAQPage JSON-LD in its head)
- Social links: footer blocks in each page (currently #)