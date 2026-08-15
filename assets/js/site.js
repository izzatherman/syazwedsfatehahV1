/* ══════════════════════════════════════════════════════════════
   Fatehah & Syazril — site behaviour
   1 Helpers · 2 Content · 3 Cover · 4 Music · 5 Countdown
   6 Motion · 7 Petals · 8 Calendar · 9 RSVP
   ══════════════════════════════════════════════════════════════ */
(() => {
'use strict';

const C = window.CONFIG;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── 1. HELPERS ─────────────────────────────────────────── */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const waLink = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

let toastTimer;
function toast(message){
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ─── 2. CONTENT FROM CONFIG ─────────────────────────────── */
function renderContent(){
  const e = C.event;

  // invitation
  $$('[data-parents]').forEach(el => {
    el.innerHTML = C.parents[el.dataset.parents].map(esc).join('<br>');
  });
  $('#coupleFull').innerHTML = `${esc(C.bride)}<br>&amp;<br>${esc(C.groom)}`;

  // details
  $('#dDate').textContent  = e.dateLabel;
  $('#dTime').textContent  = e.timeLabel;
  $('#dVenue').textContent = `${e.venue}\n${e.address}`;
  $('#wazeBtn').href = e.waze;
  $('#mapsBtn').href = e.maps;

  // timeline
  $('#timeline').innerHTML = C.timeline.map((t, i) => `
    <div class="timeline-item rv" style="--i:${i}">
      <svg class="timeline-icon" aria-hidden="true"><use href="#i-${t.icon}"></use></svg>
      <time>${esc(t.time)}</time>
      <p>${esc(t.text)}</p>
    </div>`).join('');

  // rsvp
  $('#rsvpLead').textContent = `Kindly respond before ${C.rsvp.deadline}.`;
  $('#fPax').innerHTML = Array.from({length: C.rsvp.maxPax}, (_, i) =>
    `<option value="${i + 1}">${i + 1}</option>`).join('');

  // registry
  $('#registryCopy').textContent = C.registry.intro;
  const actions = [];
  if (C.registry.qrImage)  actions.push(`<a class="registry-action" href="${esc(C.registry.qrImage)}" target="_blank" rel="noopener">QR Code<small>DuitNow</small></a>`);
  if (C.registry.wishlist) actions.push(`<a class="registry-action" href="${esc(C.registry.wishlist)}" target="_blank" rel="noopener">Wishlist<small>Open list</small></a>`);
  $('#registryActions').innerHTML = actions.join('');

  const b = C.registry.bank;
  if (b && b.no){
    $('#acct').innerHTML = `${esc(b.name)}<b id="acctNo">${esc(b.no)}</b>${esc(b.holder)}
      <div class="pill-row"><button class="pill ghost" id="copyAcct" type="button">Copy account number</button></div>`;
    $('#copyAcct').addEventListener('click', async () => {
      const plain = b.no.replace(/\s/g, '');
      try { await navigator.clipboard.writeText(plain); toast('Account number copied'); }
      catch { toast(plain); }
    });
  }

  // contacts
  $('#contacts').innerHTML = C.contacts.map(p => `
    <div class="contact-person">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.role)}</p>
      <div class="contact-buttons">
        <a class="contact-button" href="tel:+${esc(p.phone)}" aria-label="Call ${esc(p.name)}">
          <svg aria-hidden="true"><use href="#i-phone"></use></svg></a>
        <a class="contact-button wa" href="${waLink(p.phone, 'Assalamualaikum, saya nak bertanya pasal majlis Fatehah & Syazril.')}"
           target="_blank" rel="noopener" aria-label="WhatsApp ${esc(p.name)}">
          <svg aria-hidden="true"><use href="#i-whatsapp"></use></svg></a>
      </div>
    </div>`).join('');

  // footer
  $('#footerNames').textContent = `${C.short.bride} & ${C.short.groom}`;
  $('#footerMeta').textContent  = `${e.dateLabel} · ${e.venue}, Port Dickson`;

  // personalised greeting:  ?to=Encik%20Ali
  const guest = new URLSearchParams(location.search).get('to');
  if (guest) $('#guestLine').textContent = `Kepada ${guest.replace(/[<>]/g, '').slice(0, 60)}`;
}


/* ─── LACE HEARTS ────────────────────────────────────────── */
const HEART_D = 'M100,178 C40,132 8,100 8,64 A44,44 0 0 1 100,40 A44,44 0 0 1 192,64 C192,100 160,132 100,178 Z';

function heartFrame(photo, cls, i){
  return `
    <figure class="heart-frame ${cls}" style="margin:0">
      <svg viewBox="-12 -12 224 212" aria-hidden="true">
        <defs><mask id="lace${i}">
          <path d="${HEART_D}" fill="#fff"/>
          <g class="scallop-mask" fill="#fff"></g>
          <g class="holes" fill="#000"></g>
        </mask></defs>
        <g mask="url(#lace${i})">
          <g class="scallop" fill="#FFFDF9"></g>
          <path class="body" d="${HEART_D}" fill="#FFFDF9"/>
        </g>
      </svg>
      <div class="polaroid" style="--tilt:${photo.tilt}deg">
        <img src="${esc(photo.src)}" alt="${esc(photo.alt || '')}" data-slot="${i + 1}" loading="lazy" decoding="async">
      </div>
    </figure>`;
}

function buildHearts(){
  const host = $('#hearts');
  if (!host || !C.photos || !C.photos.length){ if (host) host.closest('section').hidden = true; return; }

  const kids = C.photos.slice(0, 2).map((photo, i) => heartFrame(photo, 'kid', i)).join('');
  const couple = C.couplePhoto && C.couplePhoto.src ? heartFrame(C.couplePhoto, 'couple', 2) : '';
  host.innerHTML = kids + couple;

  // graceful placeholder until a photo file exists
  $$('#hearts img').forEach(img => img.addEventListener('error', () => {
    const box = document.createElement('div');
    box.className = 'ph';
    box.textContent = `ADD PHOTO ${img.dataset.slot}`;
    img.replaceWith(box);
  }));

  // punch the lace holes along each heart outline
  $$('#hearts svg').forEach(svg => {
    const holes = svg.querySelector('.holes');
    const outline = svg.querySelector('mask path');
    const len = outline.getTotalLength();

    const ring = (inset, r, step) => {
      let out = '';
      for (let d = 0; d < len; d += step){
        const pt = outline.getPointAtLength(d);
        const x = 100 + (pt.x - 105) * inset + 5;
        const y = 100 + (pt.y - 100) * inset;
        out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`;
      }
      return out;
    };

    const scallops = ring(1.03, 6, 12);
    svg.querySelector('.scallop').innerHTML = scallops;
    svg.querySelector('.scallop-mask').innerHTML = scallops;
    holes.innerHTML = ring(.90, 2.5, 8.5) + ring(.79, 1.6, 9.5);
  });

  if (couple) startStoryLoop(host);
}

/* two childhood hearts drift together and become the couple — on a gentle loop */
function startStoryLoop(host){
  const caption = $('#storyCaption');
  const story = C.story || {};
  const say = text => {
    if (!caption) return;
    caption.classList.remove('show');
    setTimeout(() => { caption.textContent = text; caption.classList.add('show'); }, 320);
  };

  // reduced motion: skip the animation, show the couple and both captions' meaning
  if (reduceMotion){
    host.classList.add('merged');
    say(story.now || '');
    return;
  }

  let merged = false, timer = null, running = false;

  const step = () => {
    merged = !merged;
    host.classList.toggle('merged', merged);
    say(merged ? (story.now || '') : (story.then || ''));
    timer = setTimeout(step, merged ? (story.holdCouple || 4600) : (story.holdKids || 3400));
  };

  const play = () => {
    if (running) return;
    running = true;
    say(merged ? (story.now || '') : (story.then || ''));
    timer = setTimeout(step, merged ? (story.holdCouple || 4600) : (story.holdKids || 3400));
  };
  const pause = () => { running = false; clearTimeout(timer); };

  // only animate while the section is on screen, and never in a background tab
  new IntersectionObserver(([entry]) => entry.isIntersecting ? play() : pause(),
    {threshold: .2}).observe(host.closest('section'));
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
}

/* ─── 3. COVER / ENVELOPE ────────────────────────────────── */
let opened = false;
function openInvitation(){
  if (opened) return;
  opened = true;
  startMusic();                                  // must run inside the tap gesture (iOS)
  document.body.classList.add('unsealing');
  setTimeout(() => {
    document.body.classList.add('opened');
    // the page is already at the top — that IS the photo page. Don't scroll past it.
    scrollTo({top: 0, behavior: 'auto'});
  }, reduceMotion ? 0 : 1250);
}

/* ─── 4. MUSIC ───────────────────────────────────────────── */
const audio = $('#music'), musicBtn = $('#musicToggle');
function startMusic(){
  if (!C.music || !C.music.src) return;
  audio.src = C.music.src;
  musicBtn.classList.add('on');
  audio.volume = 0;
  audio.play().then(fadeIn).catch(() => musicBtn.classList.add('paused'));
}
function fadeIn(){
  const max = C.music.volume, step = max / 40;
  const id = setInterval(() => {
    audio.volume = Math.min(max, audio.volume + step);
    if (audio.volume >= max - .001) clearInterval(id);
  }, 60);
}
musicBtn.addEventListener('click', () => {
  if (audio.paused){ audio.play(); musicBtn.classList.remove('paused'); }
  else { audio.pause(); musicBtn.classList.add('paused'); }
});
document.addEventListener('visibilitychange', () => {
  if (!opened || audio.paused && !audio.dataset.auto) return;
  if (document.hidden && !audio.paused){ audio.pause(); audio.dataset.auto = '1'; }
  else if (!document.hidden && audio.dataset.auto){ audio.dataset.auto = ''; audio.play().catch(() => {}); }
});

/* ─── 5. COUNTDOWN ───────────────────────────────────────── */
function initCountdown(){
  const target = new Date(C.event.start).getTime();
  const units  = [['Days', 864e5], ['Hours', 36e5], ['Minutes', 6e4], ['Seconds', 1e3]];
  const host   = $('#countdown');

  host.innerHTML = units.map(([label], i) =>
    `${i ? '<span class="colon">:</span>' : ''}
     <div class="count-unit"><strong data-u="${label}">00</strong><span>${label}</span></div>`).join('');

  const cells = {};
  $$('[data-u]', host).forEach(el => cells[el.dataset.u] = el);

  const tick = () => {
    let diff = Math.max(0, target - Date.now());
    units.forEach(([label, ms]) => {
      const value = String(Math.floor(diff / ms)).padStart(2, '0');
      diff %= ms;
      const cell = cells[label];
      if (cell.textContent === value) return;
      cell.textContent = value;
      if (reduceMotion) return;
      cell.classList.remove('flip'); void cell.offsetWidth; cell.classList.add('flip');
    });
  };
  tick();
  setInterval(tick, 1000);
}

/* ─── 6. MOTION: reveals, nav state, parallax ────────────── */
function initMotion(){
  // reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, {rootMargin: '0px 0px -10% 0px', threshold: .12});
  $$('.rv').forEach(el => io.observe(el));

  // active nav link
  const links    = $$('.site-nav a:not(.site-brand)');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, {rootMargin: '-45% 0px -50% 0px'});
  sections.forEach(s => spy.observe(s));

  // parallax on the floral layers (transform only — smooth on iOS)
  if (!C.motion.parallax || reduceMotion) return;
  const layers = $$('main .bg');
  let ticking = false;
  const update = () => {
    ticking = false;
    layers.forEach(layer => {
      const box = layer.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const progress = (box.top + box.height / 2 - innerHeight / 2) / innerHeight;
      layer.style.setProperty('--py', `${(-progress * 26).toFixed(1)}px`);
      layer.style.translate = `0 ${(-progress * 26).toFixed(1)}px`;
    });
  };
  addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(update); ticking = true;
  }, {passive: true});
  update();
}

/* ─── 7. PETALS (cover only) ─────────────────────────────── */
function initPetals(){
  if (!C.motion.petals || reduceMotion) return;
  const canvas = $('#petals'), ctx = canvas.getContext('2d');
  const cover  = $('#cover');
  let petals = [], frame = null;

  const size = () => { canvas.width = cover.offsetWidth; canvas.height = cover.offsetHeight; };
  const seed = () => {
    const count = innerWidth < 700 ? 10 : 16;
    petals = Array.from({length: count}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 4 + Math.random() * 6,
      speed: .25 + Math.random() * .5,
      angle: Math.random() * Math.PI,
      spin: .004 + Math.random() * .01,
      alpha: .12 + Math.random() * .2
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.y += p.speed; p.angle += p.spin; p.x += Math.sin(p.angle) * .5;
      if (p.y > canvas.height + 20){ p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.globalAlpha = p.alpha; ctx.fillStyle = '#F6E6C8';
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    frame = requestAnimationFrame(draw);
  };

  size(); seed(); draw();
  addEventListener('resize', () => { size(); seed(); }, {passive: true});
  // stop drawing once the cover is gone
  const stop = () => { if (frame){ cancelAnimationFrame(frame); frame = null; } };
  $('#openInvite').addEventListener('click', () => setTimeout(stop, 1400));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!frame && !opened) frame = requestAnimationFrame(draw);
  });
}

/* ─── 8. SAVE THE DATE (.ics) ────────────────────────────── */
function initCalendar(){
  $('#icsBtn').addEventListener('click', () => {
    const stamp = d => new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//syazwedsfatehah//EN', 'BEGIN:VEVENT',
      `SUMMARY:Wedding of ${C.short.bride} & ${C.short.groom}`,
      `DTSTART:${stamp(C.event.start)}`,
      `DTEND:${stamp(C.event.end)}`,
      `LOCATION:${(C.event.venue + ', ' + C.event.address.replace(/\n/g, ' ')).replace(/,/g, '\\,')}`,
      'DESCRIPTION:With love\\, Fatehah & Syazril',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([ics], {type: 'text/calendar'}));
    link.download = 'fatehah-syazril.ics';
    link.click();
    URL.revokeObjectURL(link.href);
    toast('Added to your calendar');
  });
}

/* ─── 9. RSVP ────────────────────────────────────────────── */
function initRsvp(){
  const form   = $('#rsvpForm');
  const status = $('#rsvpStatus');
  const submit = $('#rsvpSubmit');
  let attending = 'yes';

  // yes / no toggle
  $$('.seg button').forEach(btn => btn.addEventListener('click', () => {
    attending = btn.dataset.att;
    $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    $('#paxField').hidden = attending === 'no';
  }));

  const setError = (name, message) => {
    const slot  = $(`[data-err="${name}"]`);
    if (!slot) return;
    slot.textContent = message || '';
    slot.closest('.field').classList.toggle('invalid', Boolean(message));
  };

  const validate = data => {
    let ok = true;
    if (data.name.length < 2){ setError('name', 'Please enter your name'); ok = false; }
    else setError('name', '');

    const digits = data.phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 13){ setError('phone', 'Please enter a valid phone number'); ok = false; }
    else setError('phone', '');

    return ok;
  };

  const whatsappFallback = data => {
    const text = data.attending === 'yes'
      ? `Assalamualaikum. Saya *${data.name}* akan hadir ke majlis perkahwinan Fatehah & Syazril pada 12 Disember 2026. Bilangan: *${data.pax}* orang. (${data.phone})`
      : `Assalamualaikum. Saya *${data.name}*. Mohon maaf, tidak dapat hadir ke majlis Fatehah & Syazril. (${data.phone})`;
    return waLink(C.rsvp.whatsapp, text);
  };

  const showDone = data => {
    form.hidden = true;
    status.innerHTML = `
      <span class="rsvp-done">
        <span class="tick">&#10003;</span>
        <b>Terima kasih, ${esc(data.name.split(' ')[0])}!</b>
        <span>${data.attending === 'yes'
          ? `We’ve saved your RSVP for ${esc(data.pax)} guest${data.pax > 1 ? 's' : ''}. See you on 12 December.`
          : 'Thank you for letting us know — you’ll be missed.'}</span>
      </span>`;
    localStorage.setItem('rsvp-sent', JSON.stringify({name: data.name, at: Date.now()}));
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.company.value) return;                   // honeypot — silently ignore bots

    const data = {
      name:      form.name.value.trim(),
      phone:     form.phone.value.trim(),
      attending,
      pax:       attending === 'yes' ? form.pax.value : '0',
      side:      form.side.value,
      wish:      form.wish.value.trim(),
      guestTag:  new URLSearchParams(location.search).get('to') || ''
    };
    if (!validate(data)) return;

    // no endpoint configured yet → WhatsApp
    if (!C.rsvp.endpoint){
      open(whatsappFallback(data), '_blank', 'noopener');
      showDone(data);
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.textContent = '';

    try {
      const response = await fetch(C.rsvp.endpoint, {
        method: 'POST',
        body: new URLSearchParams(data)               // simple request → no CORS preflight
      });
      const result = await response.json().catch(() => ({ok: true}));
      if (result.ok === false) throw new Error(result.error || 'rejected');
      showDone(data);
    } catch {
      submit.disabled = false;
      submit.textContent = 'Send RSVP';
      status.innerHTML = `Couldn’t reach the server. <a href="${whatsappFallback(data)}" target="_blank" rel="noopener"><b>Send via WhatsApp instead →</b></a>`;
    }
  });

  // already replied on this device
  const previous = localStorage.getItem('rsvp-sent');
  if (previous){
    try {
      const { name } = JSON.parse(previous);
      status.innerHTML = `You’ve already replied as <b>${esc(name)}</b>. <button type="button" id="rsvpAgain" style="text-decoration:underline">Send another RSVP</button>`;
      form.hidden = true;
      $('#rsvpAgain').addEventListener('click', () => {
        form.hidden = false; status.textContent = ''; localStorage.removeItem('rsvp-sent');
      });
    } catch { localStorage.removeItem('rsvp-sent'); }
  }
}


/* ─── WISHES SLIDER ──────────────────────────────────────── */
async function initWishes(){
  const section = $('#wishes');
  if (!section || !C.rsvp.endpoint) return;

  let wishes = [];
  try {
    const res  = await fetch(`${C.rsvp.endpoint}?wishes=1&t=${Date.now()}`);
    const data = await res.json();
    wishes = (data.wishes || []).filter(w => w.wish && w.wish.trim());
  } catch { return; }
  if (!wishes.length) return;

  const track = $('#wishTrack'), dots = $('#wishDots');
  section.hidden = false;

  track.innerHTML = wishes.map(w => `
    <figure class="wish-card">
      <span class="mark" aria-hidden="true">&ldquo;</span>
      <p>${esc(w.wish)}</p>
      <cite>— ${esc(w.name)}</cite>
    </figure>`).join('');

  dots.innerHTML = wishes.map((_, i) =>
    `<button type="button" aria-label="Wish ${i + 1}" aria-current="${i === 0}"></button>`).join('');

  const cards = $$('.wish-card', track);
  const bullets = $$('button', dots);
  let index = 0, timer = null;

  const goTo = (i, smooth = true) => {
    index = (i + cards.length) % cards.length;
    const card = cards[index];
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: smooth && !reduceMotion ? 'smooth' : 'auto'
    });
    bullets.forEach((b, n) => b.setAttribute('aria-current', String(n === index)));
  };

  const play  = () => { if (cards.length > 1 && !reduceMotion) timer = setInterval(() => goTo(index + 1), 5500); };
  const pause = () => { clearInterval(timer); timer = null; };
  const nudge = () => { pause(); setTimeout(play, 9000); };

  $('#wishNext').addEventListener('click', () => { goTo(index + 1); nudge(); });
  $('#wishPrev').addEventListener('click', () => { goTo(index - 1); nudge(); });
  bullets.forEach((b, i) => b.addEventListener('click', () => { goTo(i); nudge(); }));
  track.addEventListener('pointerdown', pause);
  track.addEventListener('scroll', () => {
    // keep the dots in sync when the guest swipes
    const mid = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    cards.forEach((c, i) => {
      if (Math.abs(c.offsetLeft + c.clientWidth / 2 - mid) <
          Math.abs(cards[nearest].offsetLeft + cards[nearest].clientWidth / 2 - mid)) nearest = i;
    });
    index = nearest;
    bullets.forEach((b, n) => b.setAttribute('aria-current', String(n === index)));
  }, {passive: true});

  // only auto-advance while the section is on screen
  new IntersectionObserver(([entry]) => entry.isIntersecting ? play() : pause(),
    {threshold: .25}).observe(section);

  $$('.rv', section).forEach(el => el.classList.add('in'));
}


/* ─── WISHLIST ───────────────────────────────────────────── */
function initWishlist(){
  const section = $('#wishlist');
  const list = ((C.wishlist && C.wishlist.items) || []).filter(i => i.name && i.name.trim());
  if (!section || !list.length) return;

  section.hidden = false;
  $('#wlIntro').textContent = C.wishlist.intro || '';

  const grid = $('#wlGrid');
  let reserved = {};                       // { itemId: count }

  const render = () => {
    grid.innerHTML = list.map(item => {
      const taken = reserved[item.id] || 0;
      const qty   = Math.max(1, item.qty || 1);
      const full  = taken >= qty;
      const left  = qty - taken;

      const thumb = item.image
        ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" decoding="async">`
        : `<span class="ph">${esc((item.name || '?').trim().charAt(0))}</span>`;

      return `
        <article class="wl-card${full ? ' taken' : ''}" data-id="${esc(item.id)}">
          <div class="wl-thumb">
            ${full ? '<span class="wl-badge">Reserved</span>' : ''}
            ${thumb}
          </div>
          <div class="wl-body">
            <h3>${esc(item.name)}</h3>
            ${item.note ? `<p class="note">${esc(item.note)}</p>` : '<p class="note"></p>'}
            ${item.price ? `<span class="price">${esc(item.price)}</span>` : ''}
            ${qty > 1 ? `<span class="wl-count">${taken} of ${qty} reserved</span>` : ''}
            <div class="wl-actions">
              ${item.url ? `<a class="pill ghost" href="${esc(item.url)}" target="_blank" rel="noopener">View item</a>` : ''}
              ${full
                ? '<span class="pill ghost" aria-disabled="true" style="opacity:.55;pointer-events:none">Already reserved</span>'
                : `<button class="pill" type="button" data-reserve="${esc(item.id)}">I'm getting this</button>`}
            </div>
          </div>
        </article>`;
    }).join('');
  };

  render();

  /* ── live counts from the sheet ── */
  const refresh = async () => {
    if (!C.rsvp.endpoint) return;
    try {
      const res  = await fetch(`${C.rsvp.endpoint}?wishlist=1&t=${Date.now()}`);
      const data = await res.json();
      if (data.ok && data.reserved){ reserved = data.reserved; render(); }
    } catch { /* offline — the cards still render, just without status */ }
  };
  refresh();

  /* ── reserve dialog ── */
  const modal = $('#wlModal'), form = $('#wlForm'), submit = $('#wlSubmit');
  let current = null;

  const openModal = item => {
    current = item;
    $('#wlModalItem').textContent = item.name;
    $('[data-err="wlname"]').textContent = '';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#wlName').focus(), 60);
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    current = null;
  };

  grid.addEventListener('click', event => {
    const btn = event.target.closest('[data-reserve]');
    if (!btn) return;
    const item = list.find(i => i.id === btn.dataset.reserve);
    if (item) openModal(item);
  });
  modal.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!current) return;
    const name = $('#wlName').value.trim();
    if (name.length < 2){ $('[data-err="wlname"]').textContent = 'Please enter your name'; return; }

    submit.disabled = true;
    submit.textContent = 'Saving…';

    // optimistic — the guest sees it taken straight away
    reserved[current.id] = (reserved[current.id] || 0) + 1;
    const itemName = current.name, itemId = current.id;

    try {
      if (C.rsvp.endpoint){
        await fetch(C.rsvp.endpoint, {
          method: 'POST',
          body: new URLSearchParams({
            type: 'wishlist',
            itemId,
            itemName,
            name,
            phone: $('#wlPhone').value.trim()
          })
        });
      }
      toast('Thank you — marked as reserved');
    } catch {
      toast('Saved on this device — please tell the couple too');
    }

    render();
    closeModal();
    form.reset();
    submit.disabled = false;
    submit.textContent = 'Yes, I’m getting this';
  });
}

/* ─── BOOT ───────────────────────────────────────────────── */
renderContent();
buildHearts();
initCountdown();
initMotion();
initPetals();
initCalendar();
initRsvp();
initWishes();
initWishlist();
$('#openInvite').addEventListener('click', openInvitation);

})();
