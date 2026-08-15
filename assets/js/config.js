/* ══════════════════════════════════════════════════════════════
   CONFIG — the only file you normally need to edit.
   Everything on the site reads from here.
   ══════════════════════════════════════════════════════════════ */

window.CONFIG = {

  /* ── Couple ─────────────────────────────────────────────── */
  bride:  'Nurul Fatehah Binti Abu Bakar',
  groom:  'Muhammad Syazril Bin Abd Halim',
  short:  { bride: 'Fatehah', groom: 'Syazril' },

  parents: [
    ['MOHD SAHFANI BIN HUSSIN', 'NORSABRINA BINTI DOL MOID'],
    ['HAJI ABD HALIM BIN MOHD', 'HAJAH MAIMUNAH BINTI SAMEK']
  ],

  /* ── Event ──────────────────────────────────────────────── */
  event: {
    start: '2026-12-12T11:00:00+08:00',
    end:   '2026-12-12T16:00:00+08:00',
    dateLabel: '12 December 2026',
    timeLabel: '11:30AM – 3:30PM',
    venue:   'Laman Sri Pinang',
    address: '1478 Persiaran Diana, Batu 4, Jalan Pantai,\n71050 Port Dickson, Negeri Sembilan',
    waze:  'https://ul.waze.com/ul?place=ChIJlXOTsIfxzTERS6HaK9siVlE&ll=2.50207780%2C101.83939900&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location',
    maps:  'https://www.google.com/maps/search/?api=1&query=Laman+Sri+Pinang%2C+Port+Dickson'
  },

  timeline: [
    { time: '11:30AM', text: 'Arrival of Guests',            icon: 'clock'  },
    { time: '12:30PM', text: 'Entrance of Bride & Groom',     icon: 'rings'  },
    { time: '1:30PM',  text: 'Makan Beradab',                 icon: 'dining' },
    { time: '2:30PM',  text: 'Photography Session',           icon: 'camera' },
    { time: '3:30PM',  text: 'Majlis Bersurai',               icon: 'heart'  }
  ],

  /* ── RSVP ───────────────────────────────────────────────── */
  rsvp: {
    // Paste the Apps Script Web App URL here after you deploy it (see SETUP.md).
    // Leave '' and the form falls back to WhatsApp automatically.
    endpoint: 'https://script.google.com/macros/s/AKfycbyM8WViP11m2PB3A2IuGnCosQX5bTf8MjfjVvfxQVOyFOmh26pB6KjpwYvlTCkLnkEFhw/exec',
    deadline: '30 November 2026',
    maxPax: 8,
    // Optional fallback / secondary contact
    whatsapp: '601111915417'
  },

  /* ── Registry ───────────────────────────────────────────── */
  registry: {
    intro: 'We are so grateful to have you in our lives. If you’re thinking of giving us a gift to celebrate our union, a monetary contribution or an item from our wishlist would be greatly appreciated. Thank you for being a part of our story!',
    bank:     { name: 'GX BANK', no: '8888007285455', holder: 'MUHAMMAD SYAZRIL BIN ABD HALIM' },
    qrImage:  '',                       // e.g. 'assets/img/duitnow-qr.png'
    wishlist: ''                        // e.g. 'https://www.shopee.com.my/...'
  },

  /* ── Contacts ───────────────────────────────────────────── */
  contacts: [
    { name: 'Syazwan Halim',      role: 'Groom’s Brother', phone: '60126017821' },
    { name: 'Ashyikin Abu Bakar', role: 'Bride’s Sister',  phone: '60183718462' }
  ],

  /* ── Story photos (the two polaroids on the lace hearts) ── */
  photos: [
    { src: 'assets/img/photo-1.jpg.png',  alt: 'Fatehah as a child', tilt: -5 },
    { src: 'assets/img/photo-2.jpg.jpeg', alt: 'Syazril as a child', tilt:  6 }
  ],

  /* ── Music ──────────────────────────────────────────────── */
  music: { src: 'assets/audio/song.mp3', volume: .4 },

  /* ── Motion ─────────────────────────────────────────────── */
  motion: {
    background: true,   // slow drifting floral backgrounds
    petals:     true,   // falling petals on the cover
    parallax:   true
  }
};
