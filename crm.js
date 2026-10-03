/* Finovex CRM automation — cookie-identified visitors, contacts & interests, automated email sequences, unsubscribe */
const crypto = require('crypto');

const DAY = 24 * 60 * 60 * 1000;
const VID_RE = /^[a-f0-9-]{16,40}$/i;
const INTERESTS = ['hedg', 'sortit', 'services'];

module.exports = function setupCRM({ app, db, sendMail, mailerReady, str, isEmail, esc, requireAdmin, writeLimiter, siteUrl, MAILS }) {
  /* ---------- schema ---------- */
  db.exec(`
  CREATE TABLE IF NOT EXISTS visitors(
    id TEXT PRIMARY KEY, contact_id INTEGER, visits INTEGER DEFAULT 1, pages INTEGER DEFAULT 0,
    interests TEXT DEFAULT '{}', first_path TEXT DEFAULT '', referrer TEXT DEFAULT '', utm TEXT DEFAULT '{}',
    first_seen TEXT DEFAULT (datetime('now')), last_seen TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS contacts(
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT DEFAULT '',
    visitor_id TEXT DEFAULT '', interests TEXT DEFAULT '', source TEXT DEFAULT '',
    marketing INTEGER DEFAULT 0, status TEXT DEFAULT 'subscribed', unsub_token TEXT NOT NULL,
    consent_at TEXT, created_at TEXT DEFAULT (datetime('now')), last_seen TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS email_queue(
    id INTEGER PRIMARY KEY AUTOINCREMENT, contact_id INTEGER NOT NULL, sequence TEXT NOT NULL, step INTEGER NOT NULL,
    subject TEXT DEFAULT '', send_at TEXT NOT NULL, status TEXT DEFAULT 'pending', sent_at TEXT, error TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')), UNIQUE(contact_id, sequence, step)
  );
  CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT);
  CREATE INDEX IF NOT EXISTS q_due ON email_queue(status, send_at);
  `);
  try { db.exec("ALTER TABLE pageviews ADD COLUMN visitor_id TEXT DEFAULT ''"); } catch (e) { /* already there */ }

  const iso = d => new Date(d).toISOString().replace('T', ' ').slice(0, 19);
  const now = () => iso(Date.now());

  /* ---------- cookies & interests ---------- */
  function cookies(req) {
    const out = {};
    (req.get('cookie') || '').split(';').forEach(p => {
      const i = p.indexOf('=');
      if (i > 0) { try { out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); } catch (e) {} }
    });
    return out;
  }
  /* the visitor cookie only counts when the visitor accepted all cookies */
  function visitorId(req) {
    const c = cookies(req);
    return c.fx_consent === 'all' && VID_RE.test(c.fx_vid || '') ? c.fx_vid : null;
  }
  function interestFromPath(p) {
    if (/^\/hedg/.test(p)) return 'hedg';
    if (/^\/sortit/.test(p)) return 'sortit';
    if (/^\/services/.test(p)) return 'services';
    return null;
  }
  function interestFromText(t) {
    const s = String(t || '').toLowerCase();
    if (s.includes('hedg')) return 'hedg';
    if (s.includes('sort')) return 'sortit';
    return s ? 'services' : null;
  }
  const parseList = s => String(s || '').split(',').filter(x => INTERESTS.includes(x));
  const topInterests = vis => {
    try { return Object.entries(JSON.parse(vis.interests || '{}')).filter(([k, n]) => INTERESTS.includes(k) && n > 0).map(([k]) => k); }
    catch (e) { return []; }
  };

  /* ---------- sequences ---------- */
  const btn = (href, label) => `<p style="margin:26px 0"><a href="${href}" style="background:#5ED69A;color:#08110c;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;display:inline-block">${label}</a></p>`;
  const hi = c => `<p>Hi ${esc(c.name ? c.name.split(' ')[0] : 'there')},</p>`;
  const SEQUENCES = {
    welcome: {
      label: 'Welcome', trigger: 'Someone subscribes or joins a waitlist',
      steps: [{
        delay: 0,
        subject: () => 'Welcome to Finovex',
        body: c => {
          const ints = parseList(c.interests);
          return `${hi(c)}<p>Thanks for joining Finovex. We build the operating system for money, from Jaipur, for India's builders.</p>
          ${ints.includes('hedg') ? '<p><b>HEDG</b> runs the finance office for growing businesses: books, GST, tax, MIS and a Virtual CFO. You are on the list, and we will email you when your invite is ready.</p>' : ''}
          ${ints.includes('sortit') ? '<p><b>SORT.it</b> is launching soon. It sorts your personal money every day, and you will be among the first to know when it is live.</p>' : ''}
          <p>We only write when we have something worth reading. No spam.</p>${btn(siteUrl + '/', 'Visit Finovex')}`;
        }
      }]
    },
    hedg: {
      label: 'HEDG interest', trigger: 'Subscribed to HEDG, joined the HEDG waitlist, or a subscriber browsed the HEDG page',
      steps: [
        {
          delay: 1 * DAY,
          subject: () => 'How HEDG runs your finance office',
          body: c => `${hi(c)}<p>Most growing businesses juggle four to six vendors for finance. HEDG replaces them with one team:</p>
          <ul><li><b>Accounting &amp; MIS</b>, kept current, with a monthly P&amp;L, balance sheet and cash flow pack</li>
          <li><b>Cashflow you can see coming</b>, with a 13 week rolling forecast</li>
          <li><b>Tax &amp; compliance</b>: GST, TDS, ITR and ROC, filed on schedule</li>
          <li><b>A Virtual CFO</b> for lenders, investors and the board</li></ul>
          <p>It starts on email, WhatsApp and Excel from day one. No new software needed.</p>${btn(siteUrl + '/hedg', 'See how HEDG works')}`
        },
        {
          delay: 4 * DAY,
          subject: () => 'HEDG plans, and how the 30 day pilot works',
          body: c => `${hi(c)}<p>A quick look at HEDG pricing, since it is usually the next question:</p>
          <ul><li><b>Essential</b>, ₹22,500 a month: books, GST and TDS filings, monthly MIS</li>
          <li><b>Growth</b>, ₹45,000 a month: everything in Essential plus Virtual CFO, cashflow forecasting and fundraising prep. Starts with a 30 day pilot.</li>
          <li><b>Custom</b> for groups and multi entity structures</li></ul>
          <p>Prices exclude GST, and you can switch plans any month. Reply to this email or send an enquiry and we will size it for you.</p>${btn(siteUrl + '/hedg#pricing', 'Compare HEDG plans')}`
        }
      ]
    },
    sortit: {
      label: 'SORT.it interest', trigger: 'Subscribed to SORT.it, joined the SORT.it waitlist, or a subscriber browsed the SORT.it page',
      steps: [{
        delay: 3 * DAY,
        subject: () => 'What SORT.it will do for your money',
        body: c => `${hi(c)}<p>While SORT.it gets ready for launch, here is what it will do for you:</p>
        <ul><li><b>Track</b>: every transaction captured and categorised automatically</li>
        <li><b>Plan</b>: budgets that nudge you before the month ends</li>
        <li><b>Save &amp; grow</b>: net worth, goals and a financial health score</li></ul>
        <p>You are on the list. We will send one email the moment it is live.</p>${btn(siteUrl + '/sortit', 'Take a look at SORT.it')}`
      }]
    }
  };
  const enabled = key => (db.prepare('SELECT value FROM settings WHERE key = ?').get('seq:' + key) || { value: '1' }).value === '1';

  function enroll(contact, key) {
    const seq = SEQUENCES[key];
    if (!seq || !enabled(key) || !contact.marketing || contact.status !== 'subscribed') return 0;
    const ins = db.prepare('INSERT OR IGNORE INTO email_queue(contact_id,sequence,step,subject,send_at) VALUES(?,?,?,?,?)');
    let n = 0;
    seq.steps.forEach((s, i) => { n += ins.run(contact.id, key, i, s.subject(contact), iso(Date.now() + s.delay)).changes; });
    return n;
  }

  /* ---------- contacts ---------- */
  const getContact = email => db.prepare('SELECT * FROM contacts WHERE email = ?').get(email);
  /** create/update a contact; marketing=true means explicit opt-in to updates (subscribe, waitlist, contact-form checkbox) */
  function upsertContact({ email, name = '', interests = [], source = '', vid = null, marketing = false }) {
    email = String(email).trim().toLowerCase();
    let c = getContact(email);
    const vis = vid ? db.prepare('SELECT * FROM visitors WHERE id = ?').get(vid) : null;
    const add = [...new Set([...interests, ...(vis ? topInterests(vis) : [])].filter(x => INTERESTS.includes(x)))];
    if (!c) {
      db.prepare(`INSERT INTO contacts(email,name,visitor_id,interests,source,marketing,unsub_token,consent_at)
        VALUES(?,?,?,?,?,?,?,?)`).run(email, name, vid || '', add.join(','), source, marketing ? 1 : 0,
        crypto.randomBytes(18).toString('hex'), marketing ? now() : null);
      c = getContact(email);
      if (marketing) { enroll(c, 'welcome'); add.forEach(k => enroll(c, k)); }
    } else {
      /* an explicit new opt-in reactivates someone who unsubscribed earlier */
      if (marketing && c.status === 'unsubscribed') {
        db.prepare("UPDATE contacts SET status = 'subscribed', marketing = 0 WHERE id = ?").run(c.id);
        c = getContact(email);
      }
      const merged = [...new Set([...parseList(c.interests), ...add])];
      const fresh = merged.filter(k => !parseList(c.interests).includes(k));
      const optIn = marketing && !c.marketing && c.status === 'subscribed';
      db.prepare(`UPDATE contacts SET name = COALESCE(NULLIF(?, ''), name), visitor_id = COALESCE(NULLIF(?, ''), visitor_id),
        interests = ?, marketing = MAX(marketing, ?), consent_at = COALESCE(consent_at, ?), last_seen = datetime('now') WHERE id = ?`)
        .run(name, vid || '', merged.join(','), marketing ? 1 : 0, marketing ? now() : null, c.id);
      c = getContact(email);
      if (optIn) enroll(c, 'welcome');
      (optIn ? merged : fresh).forEach(k => enroll(c, k));
    }
    if (vid) db.prepare('UPDATE visitors SET contact_id = ? WHERE id = ?').run(c.id, vid);
    return c;
  }

  /* ---------- tracking (called from /api/track) ---------- */
  function trackView(req, path, referrer, utm) {
    const vid = visitorId(req);
    if (!vid) return null;
    const interest = interestFromPath(path);
    let v = db.prepare('SELECT * FROM visitors WHERE id = ?').get(vid);
    if (!v) {
      db.prepare('INSERT INTO visitors(id,first_path,referrer,utm,pages) VALUES(?,?,?,?,0)')
        .run(vid, path, referrer, JSON.stringify(utm && typeof utm === 'object' ? utm : {}));
      v = db.prepare('SELECT * FROM visitors WHERE id = ?').get(vid);
    }
    const ints = (() => { try { return JSON.parse(v.interests || '{}'); } catch (e) { return {}; } })();
    if (interest) ints[interest] = (ints[interest] || 0) + 1;
    /* a gap of 30+ minutes since the last hit counts as a new visit */
    const newVisit = Date.now() - new Date(v.last_seen.replace(' ', 'T') + 'Z').getTime() > 30 * 60 * 1000;
    db.prepare(`UPDATE visitors SET pages = pages + 1, visits = visits + ?, interests = ?, last_seen = datetime('now') WHERE id = ?`)
      .run(newVisit ? 1 : 0, JSON.stringify(ints), vid);
    /* behaviour trigger: a known subscriber browsing a product they had not shown interest in */
    if (v.contact_id && interest && interest !== 'services') {
      const c = db.prepare('SELECT * FROM contacts WHERE id = ?').get(v.contact_id);
      if (c) {
        db.prepare("UPDATE contacts SET last_seen = datetime('now') WHERE id = ?").run(c.id);
        if (!parseList(c.interests).includes(interest)) {
          db.prepare('UPDATE contacts SET interests = ? WHERE id = ?').run([...parseList(c.interests), interest].join(','), c.id);
          enroll({ ...c, interests: c.interests + ',' + interest }, interest);
        }
      }
    }
    return vid;
  }

  /* ---------- scheduler ---------- */
  const layout = (c, body) => `<div style="background:#0F1412;padding:28px 12px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#161D1A;border:1px solid #26302B;border-radius:18px;padding:30px;color:#EDEEE9;font-size:15px;line-height:1.65">
      <p style="font-weight:700;font-size:18px;margin:0 0 18px">finovex</p>${body}
      <p style="color:#9CA5A0;margin-top:26px">Finovex Algorithm Pvt. Ltd. · HEDG · SORT.it<br>Jaipur, India · ${MAILS.finovex}</p>
    </div>
    <p style="max-width:560px;margin:14px auto 0;color:#6F7873;font-size:12px;text-align:center">You are receiving this because you signed up at Finovex.
      <a href="${siteUrl}/u/${c.unsub_token}" style="color:#9CA5A0">Unsubscribe</a></p></div>`;

  let running = false;
  async function processQueue() {
    if (running) return;
    running = true;
    try {
      /* without SMTP nothing is sent; emails wait, and expire if they could not go out within 14 days */
      db.prepare("UPDATE email_queue SET status = 'expired' WHERE status = 'pending' AND send_at < ?").run(iso(Date.now() - 14 * DAY));
      if (!mailerReady()) return;
      const due = db.prepare("SELECT * FROM email_queue WHERE status = 'pending' AND send_at <= ? ORDER BY send_at LIMIT 25").all(now());
      for (const q of due) {
        const c = db.prepare('SELECT * FROM contacts WHERE id = ?').get(q.contact_id);
        const step = SEQUENCES[q.sequence] && SEQUENCES[q.sequence].steps[q.step];
        if (!c || c.status !== 'subscribed' || !c.marketing || !step || !enabled(q.sequence)) {
          db.prepare("UPDATE email_queue SET status = 'cancelled' WHERE id = ?").run(q.id);
          continue;
        }
        const subject = step.subject(c);
        const ok = await sendMail(c.email, subject, layout(c, step.body(c)), {
          headers: { 'List-Unsubscribe': `<${siteUrl}/u/${c.unsub_token}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
        });
        db.prepare("UPDATE email_queue SET status = ?, subject = ?, sent_at = datetime('now'), error = ? WHERE id = ?")
          .run(ok ? 'sent' : 'failed', subject, ok ? '' : 'SMTP send failed', q.id);
      }
    } catch (e) { console.error('[crm:queue]', e); }
    finally { running = false; }
  }
  setTimeout(processQueue, 5000);
  setInterval(processQueue, 60 * 1000).unref();

  /* ---------- public routes ---------- */
  app.post('/api/subscribe', writeLimiter, (req, res) => {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true });
    const email = str(b.email, 160);
    if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    const interests = (Array.isArray(b.interests) ? b.interests : []).filter(x => INTERESTS.includes(x));
    const c = upsertContact({ email, name: str(b.name, 120), interests, source: str(b.source, 80) || 'subscribe', vid: visitorId(req), marketing: true });
    res.json({ ok: true, id: c.id });
  });

  function unsubscribe(token) {
    const c = db.prepare('SELECT * FROM contacts WHERE unsub_token = ?').get(String(token || ''));
    if (!c) return null;
    db.prepare("UPDATE contacts SET status = 'unsubscribed' WHERE id = ?").run(c.id);
    db.prepare("UPDATE email_queue SET status = 'cancelled' WHERE contact_id = ? AND status = 'pending'").run(c.id);
    return c;
  }
  const unsubPage = (title, msg) => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} · Finovex</title>
    <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0F1412;color:#EDEEE9;font:16px/1.6 system-ui,sans-serif;padding:20px}div{max-width:440px;background:#161D1A;border:1px solid rgba(237,238,233,.1);border-radius:20px;padding:34px;text-align:center}a{color:#5ED69A}</style></head>
    <body><div><h1 style="font-size:22px;margin:0 0 10px">${title}</h1><p style="color:#9CA5A0">${msg}</p><p><a href="/">Back to Finovex</a></p></div></body></html>`;
  app.get('/u/:token', (req, res) => {
    const c = unsubscribe(req.params.token);
    res.status(c ? 200 : 404).send(c
      ? unsubPage('You are unsubscribed', `We will not send any more updates to ${esc(c.email)}. Changed your mind? Subscribe again anytime from our website.`)
      : unsubPage('Link not found', 'This unsubscribe link is invalid or has already been used.'));
  });
  app.post('/u/:token', (req, res) => { unsubscribe(req.params.token); res.status(200).send('ok'); }); // RFC 8058 one-click

  /* ---------- admin routes ---------- */
  app.get('/api/admin/contacts', requireAdmin, (req, res) => {
    const { q = '', interest = '', status = '' } = req.query;
    let sql = `SELECT c.*, v.visits, v.pages, (SELECT COUNT(*) FROM email_queue e WHERE e.contact_id = c.id AND e.status = 'sent') sent,
      (SELECT COUNT(*) FROM email_queue e WHERE e.contact_id = c.id AND e.status = 'pending') pending
      FROM contacts c LEFT JOIN visitors v ON v.id = c.visitor_id WHERE 1=1`;
    const a = [];
    if (q) { sql += ' AND (c.email LIKE ? OR c.name LIKE ?)'; a.push(`%${q}%`, `%${q}%`); }
    if (interest) { sql += " AND (',' || c.interests || ',') LIKE ?"; a.push(`%,${interest},%`); }
    if (status) { sql += ' AND c.status = ?'; a.push(status); }
    res.json({ ok: true, rows: db.prepare(sql + ' ORDER BY c.id DESC LIMIT 500').all(...a) });
  });
  app.get('/api/admin/contacts/:id', requireAdmin, (req, res) => {
    const c = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    if (!c) return res.status(404).json({ ok: false });
    const v = c.visitor_id ? db.prepare('SELECT * FROM visitors WHERE id = ?').get(c.visitor_id) : null;
    res.json({
      ok: true, contact: c, visitor: v,
      views: c.visitor_id ? db.prepare('SELECT path, created_at FROM pageviews WHERE visitor_id = ? ORDER BY id DESC LIMIT 40').all(c.visitor_id) : [],
      queue: db.prepare('SELECT * FROM email_queue WHERE contact_id = ? ORDER BY send_at').all(c.id),
      leads: db.prepare('SELECT id, category, status, created_at FROM leads WHERE email = ? COLLATE NOCASE ORDER BY id DESC').all(c.email)
    });
  });
  app.patch('/api/admin/contacts/:id', requireAdmin, (req, res) => {
    const c = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    if (!c) return res.status(404).json({ ok: false });
    if (req.body && req.body.status === 'unsubscribed') unsubscribe(c.unsub_token);
    if (req.body && req.body.status === 'subscribed') db.prepare("UPDATE contacts SET status = 'subscribed' WHERE id = ?").run(c.id);
    res.json({ ok: true });
  });
  app.get('/api/admin/automations', requireAdmin, (req, res) => {
    const count = (k, s) => db.prepare('SELECT COUNT(*) n FROM email_queue WHERE sequence = ? AND status = ?').get(k, s).n;
    res.json({
      ok: true, smtp: mailerReady(),
      sequences: Object.entries(SEQUENCES).map(([key, s]) => ({
        key, label: s.label, trigger: s.trigger, enabled: enabled(key),
        steps: s.steps.map(st => ({ delayDays: st.delay / DAY, subject: st.subject({ name: '' }) })),
        pending: count(key, 'pending'), sent: count(key, 'sent'), failed: count(key, 'failed')
      })),
      queue: db.prepare(`SELECT q.*, c.email FROM email_queue q JOIN contacts c ON c.id = q.contact_id
        ORDER BY CASE q.status WHEN 'pending' THEN 0 ELSE 1 END, q.send_at DESC LIMIT 200`).all()
    });
  });
  app.patch('/api/admin/automations/:key', requireAdmin, (req, res) => {
    if (!SEQUENCES[req.params.key]) return res.status(404).json({ ok: false });
    db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
      .run('seq:' + req.params.key, req.body && req.body.enabled ? '1' : '0');
    res.json({ ok: true });
  });
  app.post('/api/admin/queue/:id/cancel', requireAdmin, (req, res) => {
    db.prepare("UPDATE email_queue SET status = 'cancelled' WHERE id = ? AND status = 'pending'").run(req.params.id);
    res.json({ ok: true });
  });
  app.get('/api/admin/contacts.csv', requireAdmin, (req, res) => {
    const rows = db.prepare('SELECT id,email,name,interests,source,marketing,status,created_at,last_seen FROM contacts ORDER BY id DESC').all();
    const csv = ['id,email,name,interests,source,marketing,status,created_at,last_seen']
      .concat(rows.map(r => Object.values(r).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="finovex-contacts.csv"');
    res.send(csv);
  });

  return { upsertContact, trackView, visitorId, interestFromText, processQueue };
};
