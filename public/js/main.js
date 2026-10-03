/* Finovex front-end: icons, nav, reveals, hero desk, chaos→clarity scene, walkthroughs, drag-scroll, forms, tracking */
(function () {
'use strict';

/* ---------- icons (inline SVG set) ---------- */
const ICONS = {
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  chevron:'<path d="m6 9 6 6 6-6"/>',
  ar:'<path d="M5 12h14M12 5l7 7-7 7"/>',
  aur:'<path d="M7 17 17 7M8 7h9v9"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkc:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin:'<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  trend:'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  brief:'<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  gavel:'<path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
  landmark:'<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  pie:'<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  umbrella:'<path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 1v1"/>',
  calc:'<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M8 13h8M8 17h5"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  wallet:'<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
  bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  play:'<polygon points="6 3 20 12 6 21 6 3"/>',
  pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  coffee:'<path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M17 10h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M7 3v3M10 3v3"/>',
  utensils:'<path d="M6 3v6a1.5 1.5 0 0 0 3 0V3M7.5 3v18M9 3v6"/><path d="M17.5 3c-1.8.5-3 2.8-3 5.2 0 2 .9 3.3 2 3.8V21"/>',
  fuel:'<path d="M4 21V6"/><rect x="4" y="6" width="8" height="12"/><path d="M12 10h3l2 2v6a1.5 1.5 0 0 1-3 0v-4h-2"/>',
  car:'<path d="m4 16 1.5-5a2 2 0 0 1 1.9-1.4h9.2a2 2 0 0 1 1.9 1.4L20 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/>',
  ticket:'<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 6 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-6Z"/><path d="M10 7v10" stroke-dasharray="2 2"/>',
  building:'<rect x="4" y="3" width="10" height="18"/><rect x="14" y="9" width="6" height="12"/><path d="M7 7h.01M11 7h.01M7 11h.01M11 11h.01M7 15h.01M11 15h.01"/>',
  bag:'<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  pencil:'<path d="m4 20 1-4L15 6l3 3L8 19Z"/><path d="m13 8 3 3"/>',
  wifi:'<path d="M3 9a13 13 0 0 1 18 0"/><path d="M6.5 12.5a8 8 0 0 1 11 0"/><path d="M10 16a3 3 0 0 1 4 0"/><path d="M12 19h.01"/>',
  note:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  spark:'<path d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18l-1.9-5.6L4.5 10.5l5.6-1.9Z"/><path d="M19 3v4M17 5h4"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  li:'<path fill="currentColor" stroke="none" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect fill="currentColor" stroke="none" width="4" height="12" x="2" y="9"/><circle fill="currentColor" stroke="none" cx="4" cy="4" r="2"/>',
  ig:'<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  xs:'<path fill="currentColor" stroke="none" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/>'
};
function hydrateIcons() {
  document.querySelectorAll('[data-ic]').forEach(el => {
    const inner = ICONS[el.dataset.ic];
    if (!inner) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', el.className);
    svg.innerHTML = inner;
    el.replaceWith(svg);
  });
}

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* motion follows the OS reduced-motion setting */
const motionOn = () => !reduced;
const inr = n => '₹' + n.toLocaleString('en-IN');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
hydrateIcons();
document.body.classList.add('loaded');

let toastT;
function toast(msg) {
  const t = $('#toast'); if (!t) return;
  $('#toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 3400);
}
async function postJSON(url, data) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return { status: r.status, ...(await r.json().catch(() => ({}))) };
}

/* ---------- nav ---------- */
const nav = $('#nav');
if (nav) {
  const state = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', state, { passive: true }); state();
}
 $$('.nav-item > a').forEach(a => a.addEventListener('click', e => {
  const item = a.parentElement;
  if (item.querySelector('.dd') && !matchMedia('(hover:hover)').matches && !item.classList.contains('open')) {
    e.preventDefault();
    $$('.nav-item.open').forEach(o => o !== item && o.classList.remove('open'));
    item.classList.add('open');
  } else item.classList.remove('open');
}));
document.addEventListener('click', e => { if (!e.target.closest('.nav-item')) $$('.nav-item.open').forEach(o => o.classList.remove('open')); });

const burger = $('#navBurger');
if (burger) burger.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  burger.setAttribute('aria-expanded', open);
});
 $$('#mPanel a').forEach(a => a.addEventListener('click', () => {
  document.body.classList.remove('nav-open');
  burger && burger.setAttribute('aria-expanded', 'false');
}));
 $$('.m-acc').forEach(btn => btn.addEventListener('click', () => {
  const open = btn.parentElement.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}));

/* ---------- reveal on scroll ---------- */
$$('.rv[data-d]').forEach(el => el.style.setProperty('--d', el.dataset.d + 's'));
if ('IntersectionObserver' in window && motionOn()) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  }), { threshold: .1, rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => io.observe(el));
} else $$('.rv').forEach(el => el.classList.add('show'));

const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- hero: animated finance desk ---------- */
try {
const rev = $('#revNum');
if (rev) {
  if (reduced) {
    rev.textContent = inr(1840000);
    $$('#compList li').forEach(li => li.classList.add('done'));
    const l = $('#deskLine'); l && l.classList.add('static');
  } else {
    let start = null;
    const from = 1240000, to = 1840000, dur = 4200, hold = 3600;
    const tick = ts => {
      if (start === null) start = ts;
      const t = ts - start;
      if (t < dur) { const k = 1 - Math.pow(1 - t / dur, 3); rev.textContent = inr(Math.round(from + (to - from) * k)); requestAnimationFrame(tick); }
      else if (t < dur + hold) { rev.textContent = inr(to); requestAnimationFrame(tick); }
      else { start = null; requestAnimationFrame(tick); }
    };
    requestAnimationFrame(tick);
    const items = $$('#compList li'); let i = 0;
    setInterval(() => {
      if (i < items.length) items[i++].classList.add('done');
      else setTimeout(() => { items.forEach(li => li.classList.remove('done')); i = 0; }, 2400);
    }, 1400);
    const toastEl = $('#deskToast'), t1 = $('#toastT1'), t2 = $('#toastT2');
    if (toastEl) {
      const msgs = [['Invoice #204 paid', '₹84,000 settled'], ['GST payment scheduled', 'auto debit on the 20th'], ['Board pack ready', 'Q3 numbers, reviewed']];
      let ti = 0;
      const cycle = () => {
        const m = msgs[ti++ % msgs.length];
        t1.textContent = m[0]; t2.textContent = m[1];
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 3800);
      };
      cycle(); setInterval(cycle, 8600);
    }
  }
}
} catch (e) { console.error('[hero]', e); }

/* ---------- scroll loop: one rAF tick shared by every scroll-driven section ---------- */
const frames = [];
const onFrame = fn => frames.push(fn);
const inView = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
const prog = el => { const r = el.getBoundingClientRect(), total = el.offsetHeight - innerHeight; return total <= 0 ? 0 : clamp(-r.top / total, 0, 1); };
let lastT = performance.now();
(function loop(now) {
  const dt = Math.min((now - lastT) / 1000, .05); lastT = now;
  for (const fn of frames) { try { fn(dt); } catch (e) { console.error(e); } }
  requestAnimationFrame(loop);
})(lastT);

const bar = document.createElement('div');
bar.id = 'pageProgress';
document.body.prepend(bar);
onFrame(() => {
  const dh = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${dh > 0 ? clamp(scrollY / dh, 0, 1) : 0})`;
});

/* ---------- chaos → clarity scroll scene ---------- */
try {
const sceneWrap = $('#sceneWrap');
if (sceneWrap) {
  const stage = $('#sceneStage'), sceneEl = $('#sceneEl'), word = $('#riseWord'), cap = $('#sceneCap');
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const CATS = [['food', 'Food & Dining'], ['travel', 'Travel & Fuel'], ['office', 'Office & Admin'], ['income', 'Income']];
  const CHIPS = [
    ['Swiggy', '₹412', 'utensils'], ['Zomato', '₹365', 'utensils'], ['Blue Tokai', '₹420', 'coffee'], ['Starbucks', '₹280', 'coffee'],
    ['Indian Oil', '₹2,000', 'fuel'], ['Ola Cabs', '₹342', 'car'], ['Uber', '₹528', 'car'], ['IRCTC', '₹1,240', 'ticket'],
    ['Office rent', '₹45,000', 'building'], ['Amazon IN', '₹3,499', 'bag'], ['Stationery Mart', '₹1,120', 'pencil'], ['Airtel Broadband', '₹999', 'wifi'],
    ['INV #1147', '+₹1,20,000', 'brief'], ['INV #1148', '+₹85,000', 'brief'], ['UPI received', '+₹12,500', 'note'], ['Razorpay payout', '+₹36,000', 'note']
  ];
  const SUBSET = [0, 1, 4, 5, 8, 9, 12, 13];
  stage.innerHTML = CHIPS.map((c, i) => {
    const cat = CATS[Math.floor(i / 4)];
    return `<div class="chip cat-${cat[0]}"><div class="chip-top"><span class="chip-ic"><i data-ic="${c[2]}" class="ic-sm"></i></span><span class="chip-name">${c[0]}</span><span class="chip-amt">${c[1]}</span></div><span class="chip-badge"><span class="d"></span><span class="b-un">Uncategorised</span><span class="b-cat">${cat[1]}</span></span></div>`;
  }).join('') + CATS.map(([c, l]) => `<div class="col-head cat-${c}"><span class="d"></span>${l}</div>`).join('');
  hydrateIcons();

  /* the word travels from WORD_FROM (bottom) to WORD_TO (top) as a fraction of the scene height */
  const WORD_FROM = .9, TRAVEL = .82;
  let WORD_TO = .16;
  const chipEls = $$('.chip', stage), headEls = $$('.col-head', stage);
  let active = [];
  const layout = () => {
    const w = stage.clientWidth, h = stage.clientHeight, mobile = w < 620;
    sceneEl.classList.toggle('cols2', mobile);
    const idx = mobile ? SUBSET : CHIPS.map((_, i) => i);
    const prev = new Map(active.map(c => [c.el, c]));
    active = idx.map(i => prev.get(chipEls[i]) || { el: chipEls[i] });
    chipEls.forEach(el => el.style.display = 'none');
    const cols = mobile ? 2 : 4, rows = active.length / cols, colW = w / cols;
    const rowH = Math.min((h * .82) / rows, 92);
    const sceneH = sceneEl.clientHeight, stageMid = stage.offsetTop + h / 2;
    /* CLARITY comes to rest just under the fixed nav, whatever the screen height */
    const navH = ($('#nav') || { offsetHeight: 70 }).offsetHeight;
    WORD_TO = Math.max(.12, (navH + word.offsetHeight / 2 + 16) / sceneH);
    active.forEach((c, k) => {
      c.el.style.display = 'flex';
      const col = Math.floor(k / rows), row = k % rows;
      c.ex = (col + .5) * colW - w / 2;
      c.ey = (row + .5) * rowH - (rows * rowH) / 2;
      /* scatter stays inside the stage so no card hangs off a narrow screen */
      const chipW = Math.max(140, colW - 16), maxX = Math.max(0, Math.min(w * .42, w / 2 - chipW / 2 - 6));
      if (c.sx === undefined) {
        c.ux = Math.random() * 2 - 1; c.sy = (Math.random() * 2 - 1) * h * .42;
        c.sr = (Math.random() * 2 - 1) * (mobile ? 9 : 16);
      } else c.sy = clamp(c.sy, -h * .42, h * .42);
      c.sx = c.ux * maxX;
      /* a card starts sorting the moment the rising word reaches its height */
      const frac = (stageMid + c.sy) / sceneH;
      c.start = clamp((WORD_FROM - frac) / (WORD_FROM - WORD_TO), 0, .78);
      c.el.style.width = Math.max(140, colW - 16) + 'px';
    });
    if (!mobile) headEls.forEach((el, k) => {
      el.style.transform = `translate(-50%,-50%) translate(${(k + .5) * colW - w / 2}px,${-(rows * rowH) / 2 - 30}px)`;
    });
  };
  const update = p => {
    const t = clamp(p / TRAVEL, 0, 1);
    const wy = lerp(WORD_FROM, WORD_TO, easeIO(t));
    const clarity = clamp((t - .78) / .2, 0, 1);
    word.style.top = (wy * 100) + '%';
    word.style.transform = `translate(-50%,-50%) rotate(${(1 - t) * -4}deg) scale(${1 + clarity * .06})`;
    word.style.setProperty('--clarity', clarity.toFixed(3));
    sceneEl.classList.toggle('clear', clarity >= 1);
    cap.style.opacity = String(1 - clamp(p * 6, 0, 1));
    const headsOn = clarity > .5 && !sceneEl.classList.contains('cols2');
    headEls.forEach(el => el.classList.toggle('on', headsOn));
    for (const c of active) {
      const cp = clamp((t - c.start) / .22, 0, 1);
      const e = easeIO(cp);
      c.el.style.transform = `translate(-50%,-50%) translate(${lerp(c.sx, c.ex, e)}px,${lerp(c.sy, c.ey, e)}px) rotate(${lerp(c.sr, 0, e)}deg) scale(${1 + Math.sin(cp * Math.PI) * .1})`;
      c.el.classList.toggle('sorted', cp > .82);
    }
  };
  onFrame(() => { if (inView(sceneWrap)) update(motionOn() ? prog(sceneWrap) : 1); });
  layout();
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(layout, 160); });
  document.fonts && document.fonts.ready.then(layout);
}
} catch (e) { console.error('[chaos → clarity scroll scene]', e); }

/* ---------- manifesto word reveal ---------- */
try {
const mani = $('#maniWrap');
if (mani) {
  const textEl = $('#maniText');
  (function splitWords(el) {
    [...el.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/\s+/).filter(Boolean).forEach(w => { const s = document.createElement('span'); s.className = 'mw'; s.textContent = w; frag.append(s, ' '); });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) splitWords(n);
    });
  })(textEl);
  const words = $$('.mw', textEl);
  const mframe = () => {
    const r = mani.getBoundingClientRect();
    const p = clamp(-r.top / (mani.offsetHeight - innerHeight), 0, 1);
    const n = Math.floor(p * words.length * 1.18);
    words.forEach((w, i) => w.classList.toggle('lit', i < n));
    mani.querySelector('.mani-sticky').classList.toggle('done', p > .95);
  };
  if (reduced) words.forEach(w => w.classList.add('lit'));
  else {
    let tk = false;
    addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; mframe(); }); } }, { passive: true });
    mframe();
  }
}
} catch (e) { console.error('[manifesto word reveal]', e); }

/* ---------- count-up numbers ---------- */
function countUp(el, target, pre = '', suf = '', dur = 1400) {
  const write = v => el.textContent = pre + Math.round(v).toLocaleString('en-IN') + suf;
  if (!motionOn()) return write(target);
  const t0 = performance.now();
  const step = now => {
    const k = clamp((now - t0) / dur, 0, 1);
    write(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counters = $$('.count[data-target]');
if (counters.length && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    countUp(e.target, +e.target.dataset.target, '', '', 1900);
    cio.unobserve(e.target);
  }), { threshold: .5 });
  counters.forEach(el => cio.observe(el));
}

/* ---------- sticky feature walkthroughs (HEDG, SORT.it) ---------- */
try {
$$('.feat-wrap').forEach(fw => {
  const texts = $$('.feat-text', fw), panels = $$('.panel', fw), dots = $$('.feat-dots button', fw), n = texts.length;
  let idx = -1;
  const play = pn => {
    pn.classList.remove('play');
    void pn.offsetWidth;
    $$('path.draw', pn).forEach(path => {
      const L = path.getTotalLength() * 3;  /* oversized dash: stroke is non-scaling, so screen length can exceed L */
      path.style.transition = 'none';
      path.style.strokeDasharray = `${L} ${L}`;
      path.style.strokeDashoffset = L;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1) .15s';
        path.style.strokeDashoffset = 0;
      }));
    });
    $$('[data-count]', pn).forEach(el => countUp(el, +el.dataset.count, el.dataset.prefix || '', el.dataset.suffix || ''));
    pn.classList.add('play');
  };
  const set = i => {
    if (i === idx) return;
    idx = i;
    texts.forEach((t, k) => t.classList.toggle('active', k === i));
    panels.forEach((p, k) => p.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    play(panels[i]);
  };
  const go = i => {
    const top = fw.getBoundingClientRect().top + scrollY;
    const seg = (fw.offsetHeight - innerHeight) / n;
    scrollTo({ top: top + (i + .45) * seg, behavior: motionOn() ? 'smooth' : 'auto' });
  };
  $('.fctl-prev', fw).addEventListener('click', () => go(Math.max(0, idx - 1)));
  $('.fctl-next', fw).addEventListener('click', () => go(Math.min(n - 1, idx + 1)));
  dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
  set(0);
  onFrame(() => { if (inView(fw)) set(clamp(Math.floor(prog(fw) * n), 0, n - 1)); });
});
} catch (e) { console.error('[sticky feature walkthroughs (HEDG, SORT.it)]', e); }

/* ---------- horizontal drag-scroll rows ---------- */
try {
$$('.h-scroll').forEach(el => {
  /* mouse drag only: touch already scrolls natively, and capturing it would hijack vertical swipes */
  let down = false, moved = false, sx = 0, ss = 0;
  el.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; sx = e.clientX; ss = el.scrollLeft;
  });
  el.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (!moved && Math.abs(dx) > 5) { moved = true; el.classList.add('dragging'); el.setPointerCapture(e.pointerId); }
    if (moved) el.scrollLeft = ss - dx;
  });
  const end = () => { down = false; el.classList.remove('dragging'); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.addEventListener(t, end));
  el.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  el.addEventListener('dragstart', e => e.preventDefault());

  const barEl = el.previousElementSibling;
  if (!barEl || !barEl.classList.contains('hs-bar')) return;
  const prev = $('.hs-prev', barEl), next = $('.hs-next', barEl);
  const step = () => Math.max(280, el.clientWidth * .8);
  prev.addEventListener('click', () => el.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => el.scrollBy({ left: step(), behavior: 'smooth' }));
  const upd = () => {
    prev.disabled = el.scrollLeft < 4;
    next.disabled = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
  };
  el.addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
  upd();
});
} catch (e) { console.error('[horizontal drag-scroll rows]', e); }

/* ---------- feature marquees: duplicate the track so the loop is seamless ---------- */
try {
$$('.marquee-track').forEach(t => {
  [...t.children].forEach(ch => { const c = ch.cloneNode(true); c.setAttribute('aria-hidden', 'true'); t.appendChild(c); });
});
} catch (e) { console.error('[feature marquees]', e); }

/* ---------- product cards: dim siblings + gentle tilt ---------- */
try {
$$('.products-grid').forEach(grid => {
  const cards = $$('.product-card', grid);
  grid.addEventListener('pointerover', e => {
    const c = e.target.closest('.product-card');
    cards.forEach(x => x.classList.toggle('dim', !!c && x !== c));
  });
  grid.addEventListener('pointerleave', () => cards.forEach(x => x.classList.remove('dim')));
  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || !motionOn()) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--rx', (((e.clientY - r.top) / r.height - .5) * -4).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 4).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });
});
} catch (e) { console.error('[product cards]', e); }

/* ---------- magnetic buttons ---------- */
try {
  $$('.hero-ctas .btn-primary, .cta-card button[type=submit], .nav-cta, .mag').forEach(b => {
    b.classList.add('mag');
    b.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || !motionOn()) return;
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .16}px,${(e.clientY - r.top - r.height / 2) * .2}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
} catch (e) { console.error('[magnetic]', e); }

/* ---------- waitlist forms ---------- */
try {
function bindWaitlist(form, getProduct) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.querySelector('input[type=email]');
    if (!email.value || !EMAIL_RE.test(email.value)) { email.focus(); toast('Please enter a valid email address.'); return; }
    const span = form.querySelector('button span');
    const old = span ? span.textContent : '';
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; if (span) span.textContent = 'Joining…';
    try {
      const res = await postJSON('/api/waitlist', { email: email.value, product: getProduct(), source: location.pathname });
      if (res.ok) { form.closest('.wait-wrap').classList.add('sent'); cookie.set('fx_sub', '1', 365); }
      else { toast(res.error || 'Something went wrong. Please try again.'); btn.disabled = false; if (span) span.textContent = old; }
    } catch { toast('Could not reach the server. Please try again in a moment.'); btn.disabled = false; if (span) span.textContent = old; }
  });
}
 $$('form[data-wait]').forEach(f => bindWaitlist(f, () => f.dataset.wait));
const homeWait = $('#homeWait');
if (homeWait) {
  let prod = 'hedg';
  $$('.wait-seg button', homeWait).forEach(b => b.addEventListener('click', () => {
    $$('.wait-seg button', homeWait).forEach(x => x.classList.remove('active'));
    b.classList.add('active'); prod = b.dataset.p;
  }));
  bindWaitlist($('#waitForm'), () => prod);
}
} catch (e) { console.error('[waitlist forms]', e); }

/* ---------- notify modal ---------- */
try {
const modal = $('#notifyModal');
if (modal) {
  const close = () => modal.classList.remove('open');
  $$('[data-notify]').forEach(b => b.addEventListener('click', () => {
    modal.dataset.feature = b.dataset.notify;
    $('#notifyTitle').textContent = b.dataset.notify;
    modal.classList.add('open');
    setTimeout(() => $('#notifyEmail') && $('#notifyEmail').focus(), 100);
  }));
  $$('#notifyModal [data-close]').forEach(el => el.addEventListener('click', close));
  $('#notifyForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('#notifyEmail').value;
    if (!EMAIL_RE.test(email)) { toast('Please enter a valid email address.'); return; }
    try {
      const res = await postJSON('/api/notify', { email, feature: modal.dataset.feature });
      if (res.ok) { close(); toast('Noted. We will email you when it is live.'); $('#notifyForm').reset(); }
      else toast(res.error || 'Something went wrong.');
    } catch { toast('Could not reach the server. Please try later.'); }
  });
}
} catch (e) { console.error('[notify modal]', e); }

/* ---------- contact form ---------- */
try {
const ef = $('#enquiryForm');
if (ef) {
  const map = { loans: 'Loans & Credit', advisory: 'Advisory', vcfo: 'Virtual CFO', cs: 'Company Secretary', legal: 'Legal Counsel', ib: 'Investment Banker / VC Support', valuation: 'Valuation Expert', ria: 'RIA', insurance: 'Insurance Advisor', payroll: 'Payroll / HR Compliance', hedg: 'HEDG', sortit: 'SORT.it', startups: 'Startup Registration', licenses: 'Registration & Licenses', trademarks: 'Trademarks & IP', gst: 'GST', incometax: 'Income Tax', mca: 'MCA & Compliance' };
  const s = new URLSearchParams(location.search).get('service');
  if (s && map[s]) $('#f-cat').value = map[s];
  ef.addEventListener('submit', async e => {
    e.preventDefault();
    const err = $('#formErr'); err.hidden = true;
    const d = Object.fromEntries(new FormData(ef));
    if (d.website) return; /* honeypot */
    if (!d.name || !d.email || !d.category || !d.message || d.message.length < 5) {
      err.textContent = 'Please fill in your name, email, category and a short message.'; err.hidden = false; return;
    }
    if (!EMAIL_RE.test(d.email)) { err.textContent = 'That email address does not look right.'; err.hidden = false; $('#f-email').focus(); return; }
    const btn = $('#sendBtn'), span = $('#sendBtn span');
    btn.disabled = true; span.textContent = 'Sending…';
    try {
      const res = await postJSON('/api/enquiry', { ...d, source: 'contact', utm: JSON.parse(sessionStorage.getItem('fx_utm') || '{}'), referrer: document.referrer });
      if (res.ok) { ef.hidden = true; $('#formDone').hidden = false; $('#formDone').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      else { err.textContent = res.error || 'Something went wrong. Please try again.'; err.hidden = false; btn.disabled = false; span.textContent = 'Send enquiry'; }
    } catch {
      err.textContent = 'Could not reach the server. Please email us directly at company@finovexalgorithm.com.';
      err.hidden = false; btn.disabled = false; span.textContent = 'Send enquiry';
    }
  });
}
} catch (e) { console.error('[contact form]', e); }

/* ---------- pricing toggle ---------- */
try {
const bill = $('#billSwitch');
if (bill) bill.addEventListener('change', () => {
  const annual = bill.checked;
  $$('.amt[data-m]').forEach(a => a.textContent = (annual ? a.dataset.a : a.dataset.m).toLocaleString('en-IN'));
  $$('.per[data-p]').forEach(p => p.textContent = annual ? '/mo billed yearly' : '/month');
});
} catch (e) { console.error('[pricing toggle]', e); }

/* ---------- products: horizontal scroll showcase ---------- */
try {
  const railWrap = $('#railWrap');
  if (railWrap) {
    const track = $('#railTrack'), fill = $('#railFill'), tabs = $$('.rail-tab'), panels = $$('.rail-panel', track);
    const maxX = () => Math.max(0, track.scrollWidth - innerWidth);
    let cur = -1;
    onFrame(() => {
      if (!inView(railWrap)) return;
      const p = prog(railWrap);
      track.style.transform = `translate3d(${-maxX() * p}px,0,0)`;
      fill.style.width = (p * 100) + '%';
      const i = p < .5 ? 0 : 1;
      if (i !== cur) { cur = i; tabs.forEach((t, k) => t.classList.toggle('active', k === i)); panels.forEach((x, k) => x.classList.toggle('active', k === i)); }
    });
    tabs.forEach((t, k) => t.addEventListener('click', () => {
      const top = railWrap.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + (railWrap.offsetHeight - innerHeight) * (k ? 1 : 0), behavior: motionOn() ? 'smooth' : 'auto' });
    }));
  }
} catch (e) { console.error('[rail]', e); }

/* ---------- FAQ: search + topic nav ---------- */
try {
  const search = $('#faqSearch');
  if (search) {
    const groups = $$('.faq-group'), links = $$('.faq-nav a');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let any = false;
      groups.forEach(g => {
        let shown = 0;
        $$('details', g).forEach(d => {
          const hit = !q || d.textContent.toLowerCase().includes(q);
          d.hidden = !hit; if (hit) shown++;
          if (q && hit) d.open = true;
        });
        g.hidden = !shown; if (shown) any = true;
      });
      $('#faqEmpty').hidden = any;
    });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }), { rootMargin: '-30% 0px -60% 0px' });
      groups.forEach(g => io.observe(g));
    }
    const hash = location.hash.slice(1);
    if (hash) { const d = $(`#${CSS.escape(hash)} details`); if (d) d.open = true; }
  }
} catch (e) { console.error('[faq]', e); }

/* ---------- cookies: consent banner + visitor id ---------- */
const cookie = {
  get: n => { const m = document.cookie.match('(?:^|; )' + n + '=([^;]*)'); return m ? decodeURIComponent(m[1]) : null; },
  set: (n, v, days) => { document.cookie = `${n}=${encodeURIComponent(v)}; Max-Age=${Math.round(days * 86400)}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; }
};
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)));
function ensureVisitor() {
  if (cookie.get('fx_consent') !== 'all') return null;
  let v = cookie.get('fx_vid');
  if (!v) { v = uuid(); }
  cookie.set('fx_vid', v, 365);     /* refresh the expiry on every visit */
  return v;
}
function trackPage() {
  try {
    const q = new URLSearchParams(location.search), utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => { const v = q.get(k); if (v) utm[k] = v; });
    if (Object.keys(utm).length) sessionStorage.setItem('fx_utm', JSON.stringify(utm));
    ensureVisitor();
    fetch('/api/track', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ path: location.pathname, referrer: document.referrer, utm: JSON.parse(sessionStorage.getItem('fx_utm') || '{}') })
    }).catch(() => {});
  } catch (e) {}
}
const isAdmin = location.pathname.startsWith('/admin');
if (!isAdmin) {
  trackPage();
  if (!cookie.get('fx_consent')) {
    const bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie preferences');
    bar.innerHTML = `<p><b>Cookies, briefly.</b> We use essential cookies to run the site. With your OK, we also remember your visit so the updates we send match what you are interested in. <a href="/privacy">Privacy Policy</a></p>
      <div class="cookie-btns"><button class="btn btn-ghost btn-sm" data-c="essential">Essential only</button><button class="btn btn-primary btn-sm" data-c="all">Accept all</button></div>`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => bar.classList.add('show'));
    $$('[data-c]', bar).forEach(b => b.addEventListener('click', () => {
      cookie.set('fx_consent', b.dataset.c, 180);
      bar.classList.remove('show');
      setTimeout(() => bar.remove(), 400);
      if (b.dataset.c === 'all') trackPage();
      scheduleCapture();
    }));
  }
}

/* ---------- email capture slide-in ---------- */
function scheduleCapture() {
  if (isAdmin || cookie.get('fx_sub') || cookie.get('fx_cap') || !cookie.get('fx_consent')) return;
  if (/^\/(contact|privacy|terms)/.test(location.pathname)) return;
  let shown = false;
  const show = () => {
    if (shown) return; shown = true;
    removeEventListener('scroll', onScroll);
    const page = location.pathname.startsWith('/sortit') ? 'sortit' : location.pathname.startsWith('/hedg') ? 'hedg' : '';
    const box = document.createElement('div');
    box.className = 'capture' + (page === 'sortit' ? ' theme-amber' : '');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Get Finovex updates');
    box.innerHTML = `<button class="capture-x" aria-label="Close"><i data-ic="x" class="ic-sm"></i></button>
      <div class="capture-body">
        <p class="kicker">Stay in the loop</p>
        <h3>${page === 'sortit' ? 'Be first when SORT.it launches.' : page === 'hedg' ? 'Get HEDG news and early invites.' : 'Money news, minus the noise.'}</h3>
        <p class="capture-sub">Launch news, early invites and the occasional finance tip. A few emails, never spam.</p>
        <form class="capture-form" novalidate>
          <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="capture-ints">
            <label><input type="checkbox" value="hedg"${page !== 'sortit' ? ' checked' : ''}><span>HEDG · business</span></label>
            <label><input type="checkbox" value="sortit"${page !== 'hedg' ? ' checked' : ''}><span>SORT.it · personal</span></label>
          </div>
          <div class="capture-row"><input type="email" placeholder="you@email.com" aria-label="Email address" required><button class="btn btn-primary btn-sm" type="submit"><span>Subscribe</span></button></div>
          <p class="capture-fine">Unsubscribe anytime, one click. See our <a href="/privacy">Privacy Policy</a>.</p>
        </form>
      </div>
      <div class="capture-done" hidden><i data-ic="checkc" class="ic"></i><p><b>You are in.</b> Check your inbox for a welcome note.</p></div>`;
    document.body.appendChild(box);
    hydrateIcons();
    requestAnimationFrame(() => box.classList.add('show'));
    const close = days => { cookie.set('fx_cap', '1', days); box.classList.remove('show'); setTimeout(() => box.remove(), 450); };
    $('.capture-x', box).addEventListener('click', () => close(14));
    $('.capture-form', box).addEventListener('submit', async e => {
      e.preventDefault();
      const form = e.currentTarget, email = $('input[type=email]', form), btn = $('button[type=submit]', form);
      if (!EMAIL_RE.test(email.value.trim())) { email.focus(); toast('Please enter a valid email address.'); return; }
      btn.disabled = true;
      try {
        const res = await postJSON('/api/subscribe', {
          email: email.value.trim(), website: form.website.value, source: 'popup:' + location.pathname,
          interests: $$('.capture-ints input:checked', form).map(i => i.value)
        });
        if (res.ok) {
          cookie.set('fx_sub', '1', 365);
          $('.capture-body', box).hidden = true; $('.capture-done', box).hidden = false;
          setTimeout(() => close(365), 3200);
        } else { toast(res.error || 'Something went wrong. Please try again.'); btn.disabled = false; }
      } catch { toast('Could not reach the server. Please try again in a moment.'); btn.disabled = false; }
    });
  };
  const onScroll = () => { const dh = document.documentElement.scrollHeight - innerHeight; if (dh > 0 && scrollY / dh > .5) show(); };
  addEventListener('scroll', onScroll, { passive: true });
  setTimeout(show, 25000);
}
scheduleCapture();

})();