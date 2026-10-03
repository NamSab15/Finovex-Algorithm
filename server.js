/* Finovex site + CRM backend — leads, waitlists, email routing, tracking, admin API */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');
const nodemailer = require('nodemailer');

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const FROM = process.env.MAIL_FROM || 'Finovex <no-reply@finovexalgorithm.com>';
const PUB = path.join(__dirname, 'public');
const SITE_URL = (process.env.SITE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

const MAILS = {
  finovex: 'company@finovexalgorithm.com',
  hedg: 'finance@hedg.business',
  sortit: 'company@we-sort-it.in'
};

/* ---------- database ---------- */
const DATA = path.join(__dirname, 'data');
fs.mkdirSync(DATA, { recursive: true });
const db = new Database(path.join(DATA, 'crm.db'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS leads(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, company TEXT DEFAULT '', email TEXT NOT NULL, phone TEXT DEFAULT '',
  category TEXT NOT NULL, message TEXT DEFAULT '',
  status TEXT DEFAULT 'new', notes TEXT DEFAULT '',
  source TEXT DEFAULT '', utm TEXT DEFAULT '{}', referrer TEXT DEFAULT '',
  user_agent TEXT DEFAULT '', ip TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS waitlist(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL, product TEXT NOT NULL, source TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(email, product)
);
CREATE TABLE IF NOT EXISTS notify(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL, feature TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS pageviews(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT, referrer TEXT, user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS emails(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER, to_addr TEXT, subject TEXT, direction TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

/* ---------- mail ---------- */
let transporter = null;
function mailer() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}
const mailerReady = () => !!mailer();
async function sendMail(to, subject, html, extra = {}) {
  const t = mailer();
  if (!t) { console.log(`[mail:queued] to=${to} | ${subject}`); return false; }
  try { await t.sendMail({ from: FROM, to, subject, html, ...extra }); return true; }
  catch (e) { console.error('[mail:error]', e.message); return false; }
}
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- helpers ---------- */
const isEmail = v => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const str = (v, n = 300) => typeof v === 'string' ? v.trim().slice(0, n) : '';
const logEmail = (lead_id, to, subject, direction) =>
  db.prepare('INSERT INTO emails(lead_id,to_addr,subject,direction) VALUES(?,?,?,?)').run(lead_id, to, subject, direction);
function routeFor(category) {
  const c = (category || '').toLowerCase();
  if (c.includes('hedg')) return MAILS.hedg;
  if (c.includes('sort')) return MAILS.sortit;
  return MAILS.finovex;
}

/* ---------- middleware ---------- */
app.use(express.json({ limit: '64kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.static(PUB, {
  extensions: ['html'],
  setHeaders(res, p) {
    // html/css/js revalidate on every load (cheap 304 via ETag) so a deploy never pairs new HTML with stale scripts
    if (/\.(html|css|js)$/.test(p)) res.setHeader('Cache-Control', 'no-cache');
    else res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

const writeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false, message: { ok: false, error: 'Too many requests. Please try again in a few minutes.' } });
const trackLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });

/* ---------- CRM automation (contacts, cookies, email sequences) ---------- */
const crm = require('./crm')({ app, db, sendMail, mailerReady, str, isEmail, esc, requireAdmin, writeLimiter, siteUrl: SITE_URL, MAILS });

/* ---------- public API ---------- */
app.get('/pricing', (req, res) => res.redirect(301, '/hedg#pricing'));
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/enquiry', writeLimiter, async (req, res) => {
  try {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // honeypot: silently accept
    const name = str(b.name, 120), company = str(b.company, 160), email = str(b.email, 160),
          phone = str(b.phone, 40), category = str(b.category, 80), message = str(b.message, 4000);
    if (!name || !isEmail(email) || !category || message.length < 5)
      return res.status(400).json({ ok: false, error: 'Please fill in your name, a valid email, a category and a short message.' });
    const info = db.prepare(`INSERT INTO leads(name,company,email,phone,category,message,source,utm,referrer,user_agent,ip)
      VALUES(?,?,?,?,?,?,?,?,?,?,?)`).run(name, company, email, phone, category, message, str(b.source, 60),
      JSON.stringify(b.utm && typeof b.utm === 'object' ? b.utm : {}), str(b.referrer, 300),
      req.get('user-agent') || '', req.ip);
    const id = info.lastInsertRowid;
    crm.upsertContact({ email, name, interests: [crm.interestFromText(category)].filter(Boolean), source: 'enquiry', vid: crm.visitorId(req), marketing: b.updates === true || b.updates === 'on' });
    const to = routeFor(category);
    await sendMail(to, `New enquiry [${category}] ${name}${company ? ' (' + company + ')' : ''}`,
      `<h3>New enquiry #${id}</h3><p><b>${esc(name)}</b>${company ? ' · ' + esc(company) : ''}<br>${esc(email)} ${esc(phone)}</p>
       <p><b>Category:</b> ${esc(category)}</p><p>${esc(message).replace(/\n/g, '<br>')}</p>
       <p style="color:#888">Source: ${esc(str(b.source, 60)) || 'website'} · ${new Date().toLocaleString('en-IN')}</p>`);
    logEmail(id, to, 'New enquiry notification', 'out');
    await sendMail(email, 'We received your enquiry | Finovex',
      `<p>Hi ${esc(name)},</p><p>Thank you for reaching out to Finovex. We have received your enquiry and will respond within 24 to 48 hours.</p>
       <p><b>Your enquiry:</b> ${esc(category)}</p><hr><p>Finovex Algorithm Pvt. Ltd.<br>HEDG · SORT.it<br>${MAILS.finovex}</p>`);
    logEmail(id, email, 'Auto acknowledgement', 'out');
    res.json({ ok: true, id });
  } catch (e) { console.error(e); res.status(500).json({ ok: false, error: 'Something went wrong. Please email us directly.' }); }
});

app.post('/api/waitlist', writeLimiter, (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true });
  const email = str(b.email, 160), product = str(b.product, 20);
  if (!isEmail(email) || !['hedg', 'sortit'].includes(product))
    return res.status(400).json({ ok: false, error: 'Enter a valid email and pick a product.' });
  const r = db.prepare('INSERT OR IGNORE INTO waitlist(email,product,source) VALUES(?,?,?)').run(email, product, str(b.source, 60));
  crm.upsertContact({ email, interests: [product], source: 'waitlist:' + product, vid: crm.visitorId(req), marketing: true });
  res.json({ ok: true, duplicate: r.changes === 0 });
});

app.post('/api/notify', writeLimiter, (req, res) => {
  const b = req.body || {};
  const email = str(b.email, 160), feature = str(b.feature, 80);
  if (!isEmail(email) || !feature) return res.status(400).json({ ok: false, error: 'Enter a valid email.' });
  db.prepare('INSERT INTO notify(email,feature) VALUES(?,?)').run(email, feature);
  crm.upsertContact({ email, interests: ['services'], source: 'notify:' + feature, vid: crm.visitorId(req) });
  res.json({ ok: true });
});

app.post('/api/track', trackLimiter, (req, res) => {
  const b = req.body || {};
  if (b && b.path) {
    const p = str(b.path, 200), ref = str(b.referrer, 300);
    const vid = crm.trackView(req, p, ref, b.utm);
    db.prepare('INSERT INTO pageviews(path,referrer,user_agent,visitor_id) VALUES(?,?,?,?)').run(p, ref, req.get('user-agent') || '', vid || '');
  }
  res.status(204).end();
});

/* ---------- admin API ---------- */
function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) return res.status(503).json({ ok: false, error: 'Admin not configured. Set ADMIN_TOKEN in .env' });
  if ((req.get('x-admin-token') || req.query.token) !== ADMIN_TOKEN) return res.status(401).json({ ok: false, error: 'Invalid token' });
  next();
}
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const one = s => db.prepare(`SELECT COUNT(*) c FROM ${s}`).get().c;
  res.json({ ok: true, stats: {
    leads: one('leads'), waitlist: one('waitlist'), notify: one('notify'), pageviews: one('pageviews'),
    contacts: one('contacts'), visitors: one('visitors'),
    subscribers: db.prepare("SELECT COUNT(*) c FROM contacts WHERE marketing = 1 AND status = 'subscribed'").get().c,
    emailsSent: db.prepare("SELECT COUNT(*) c FROM email_queue WHERE status = 'sent'").get().c,
    emailsPending: db.prepare("SELECT COUNT(*) c FROM email_queue WHERE status = 'pending'").get().c,
    byStatus: db.prepare('SELECT status, COUNT(*) c FROM leads GROUP BY status').all(),
    byProduct: db.prepare('SELECT product, COUNT(*) c FROM waitlist GROUP BY product').all(),
    last7: db.prepare("SELECT date(created_at) d, COUNT(*) c FROM leads WHERE created_at >= datetime('now','-6 days') GROUP BY d").all()
  }});
});
app.get('/api/admin/leads', requireAdmin, (req, res) => {
  const { status = '', q = '' } = req.query;
  let sql = 'SELECT * FROM leads WHERE 1=1'; const args = [];
  if (status) { sql += ' AND status = ?'; args.push(status); }
  if (q) { sql += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)'; args.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  sql += ' ORDER BY id DESC LIMIT 200';
  res.json({ ok: true, leads: db.prepare(sql).all(...args) });
});
app.get('/api/admin/leads/:id', requireAdmin, (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ ok: false });
  res.json({ ok: true, lead, emails: db.prepare('SELECT * FROM emails WHERE lead_id = ? ORDER BY id DESC').all(req.params.id) });
});
app.patch('/api/admin/leads/:id', requireAdmin, (req, res) => {
  const { status, notes } = req.body || {};
  if (status) db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(String(status).slice(0, 20), req.params.id);
  if (typeof notes === 'string') db.prepare('UPDATE leads SET notes = ? WHERE id = ?').run(notes.slice(0, 4000), req.params.id);
  res.json({ ok: true });
});
app.get('/api/admin/waitlist', requireAdmin, (req, res) =>
  res.json({ ok: true, rows: db.prepare('SELECT * FROM waitlist ORDER BY id DESC LIMIT 500').all() }));
app.get('/api/admin/notify', requireAdmin, (req, res) =>
  res.json({ ok: true, rows: db.prepare('SELECT * FROM notify ORDER BY id DESC LIMIT 500').all() }));
app.get('/api/admin/export.csv', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT id,name,company,email,phone,category,status,created_at FROM leads ORDER BY id DESC').all();
  const csv = ['id,name,company,email,phone,category,status,created_at']
    .concat(rows.map(r => [r.id, r.name, r.company, r.email, r.phone, r.category, r.status, r.created_at]
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="finovex-leads.csv"');
  res.send(csv);
});

app.use((req, res) => res.status(404).sendFile(path.join(PUB, '404.html')));
app.listen(PORT, () => console.log(`Finovex running → http://localhost:${PORT} · CRM admin → /admin`));