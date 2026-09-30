/* ═══════════════════════════════════════════════════════════════
   CivicConnect – Smart City & Civic Life Platform
   Complete Unified Frontend Application & Database Engine
   ═══════════════════════════════════════════════════════════════ */

// ── DOM Helpers ──
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function E(tag, opts = {}) {
  const el = document.createElement(tag);
  if (opts.cls) el.className = opts.cls;
  if (opts.html != null) el.innerHTML = opts.html;
  if (opts.text != null) el.textContent = opts.text;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (opts.style) Object.assign(el.style, opts.style);
  if (opts.children) opts.children.filter(Boolean).forEach(c => el.append(c));
  return el;
}
function countUp(el, target, dur = 1000) {
  if (!el) return;
  let val = 0;
  const step = Math.max(1, Math.ceil(target / (dur / 16)));
  const timer = setInterval(() => {
    val = Math.min(target, val + step);
    el.textContent = val.toLocaleString();
    if (val >= target) clearInterval(timer);
  }, 16);
  return timer;
}

// ── Web Audio UI Synthesizer ──
let audioCtx = null;
const Sound = {
  get enabled() { return localStorage.getItem('cc-sound') !== 'false'; },
  set enabled(v) { localStorage.setItem('cc-sound', String(v)); updateSoundBtn(); },
  play(type) {
    if (!this.enabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.04);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success' || type === 'award') {
        [523, 659, 784, 1046].forEach((f, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(f, now + idx * 0.07);
          g.gain.setValueAtTime(0.07, now + idx * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);
          o.connect(g);
          g.connect(audioCtx.destination);
          o.start(now + idx * 0.07);
          o.stop(now + idx * 0.07 + 0.22);
        });
      }
    } catch (e) {}
  }
};
function updateSoundBtn() {
  const b = $('#sound-toggle');
  if (b) {
    b.textContent = Sound.enabled ? '🔊' : '🔇';
    b.title = Sound.enabled ? 'Sound Enabled' : 'Sound Muted';
  }
}

// ── Toast Notification ──
let toastContainer;
function toast(type, title, msg, dur = 4000) {
  if (!toastContainer) {
    toastContainer = E('div', { cls: 'toast-container', attrs: { 'aria-live': 'polite' } });
    document.body.append(toastContainer);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const tEl = E('div', {
    cls: `toast toast--${type} toast-enter`,
    attrs: { role: 'alert' },
    html: `
      <span class="toast__icon">${icons[type] || 'ℹ️'}</span>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        ${msg ? `<div class="toast__message">${msg}</div>` : ''}
      </div>
      <button class="toast__close" aria-label="Dismiss">✕</button>
      <div class="toast__progress" style="width:100%"></div>
    `
  });
  toastContainer.prepend(tEl);
  const prog = tEl.querySelector('.toast__progress');
  const cls = tEl.querySelector('.toast__close');
  requestAnimationFrame(() => {
    prog.style.transition = `width ${dur}ms linear`;
    prog.style.width = '0%';
  });
  const dismiss = () => {
    tEl.classList.remove('toast-enter');
    tEl.classList.add('toast-exit');
    tEl.addEventListener('animationend', () => tEl.remove());
  };
  cls.onclick = dismiss;
  setTimeout(dismiss, dur);
}

/* ═══════════════════════════════════════════════════════════════
   MOCK BACKEND & DATABASE STORAGE (LocalStorage)
   ═══════════════════════════════════════════════════════════════ */

const DB_SEEDS = {
  users: [
    {
      id: 'usr-1',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      password: 'password123',
      role: 'citizen',
      city: 'Zone 2 – Riverside',
      avatar: '👩‍💼',
      points: 185,
      created_at: '2026-01-15'
    },
    {
      id: 'usr-admin',
      name: 'Municipal Admin Officer',
      email: 'admin@civicconnect.gov',
      phone: '+91 94440 12345',
      password: 'admin',
      role: 'admin',
      city: 'Central Municipal Ward',
      avatar: '🏛️',
      points: 999,
      created_at: '2025-10-01'
    },
    {
      id: 'usr-2',
      name: 'Rahul Verma',
      email: 'rahul.v@example.com',
      phone: '+91 98401 23456',
      password: 'password123',
      role: 'citizen',
      city: 'Zone 3 – Tech Park',
      avatar: '👨‍💻',
      points: 120,
      created_at: '2026-02-10'
    }
  ],
  reports: [
    {
      id: 'CC-2026-4821',
      user_id: 'usr-1',
      user_name: 'Priya Sharma',
      contact: 'priya.sharma@example.com',
      title: 'Deep pothole causing vehicle slowdown',
      category: 'Road Damage',
      description: 'Large pothole on 4th Cross Road near Riverside Park main gate. Two two-wheelers skidded yesterday.',
      location: 'Zone 2 – Riverside (Near Park Gate 2)',
      latitude: 13.0835,
      longitude: 80.2721,
      image: '',
      status: 'In Progress',
      priority: 'High',
      department: 'Department of Public Works (Roads)',
      created_at: '2026-09-27T09:30:00Z',
      updated_at: '2026-09-28T14:15:00Z',
      timeline: [
        { stage: 'Reported', date: '2026-09-27 09:30 AM', dept: 'Civic Intake AI', notes: 'Complaint logged and geo-tagged.' },
        { stage: 'Under Review', date: '2026-09-27 11:00 AM', dept: 'Ward 14 Control Room', notes: 'Inspection verified by field supervisor.' },
        { stage: 'Assigned', date: '2026-09-27 02:45 PM', dept: 'Public Works (Roads)', notes: 'Assigned to Asphalt Repair Crew #3.' },
        { stage: 'In Progress', date: '2026-09-28 10:15 AM', dept: 'Public Works (Roads)', notes: 'Cold-mix asphalt patch team dispatched on-site.' }
      ]
    },
    {
      id: 'CC-2026-4819',
      user_id: 'usr-1',
      user_name: 'Priya Sharma',
      contact: 'priya.sharma@example.com',
      title: 'Flickering streetlights along Lake Road',
      category: 'Streetlight',
      description: 'Three consecutive solar smart poles are dark between poles #42 and #45.',
      location: 'Zone 2 – Riverside (Lake View Promenade)',
      latitude: 13.0812,
      longitude: 80.2690,
      image: '',
      status: 'Resolved',
      priority: 'Medium',
      department: 'Electrical & Smart Lighting Board',
      created_at: '2026-09-22T19:10:00Z',
      updated_at: '2026-09-23T11:20:00Z',
      timeline: [
        { stage: 'Reported', date: '2026-09-22 07:10 PM', dept: 'Citizen Portal', notes: 'Complaint submitted by citizen.' },
        { stage: 'Under Review', date: '2026-09-22 08:30 PM', dept: 'Night Maintenance Desk', notes: 'Smart sensor confirms circuit breaker trip.' },
        { stage: 'Assigned', date: '2026-09-23 08:00 AM', dept: 'Electrical Wing', notes: 'Lineman Unit 4 dispatched.' },
        { stage: 'In Progress', date: '2026-09-23 10:00 AM', dept: 'Electrical Wing', notes: 'Replacing damaged relay & LED drivers.' },
        { stage: 'Resolved', date: '2026-09-23 11:20 AM', dept: 'Electrical Wing', notes: 'Poles #42-#45 fully restored. Lumens tested at 100%.' }
      ]
    },
    {
      id: 'CC-2026-4805',
      user_id: 'usr-1',
      user_name: 'Priya Sharma',
      contact: 'priya.sharma@example.com',
      title: 'Overflowing public waste bin at bus terminal',
      category: 'Garbage/Waste',
      description: 'Segregated waste bins overflowing with dry packaging waste near Bay 3.',
      location: 'Zone 1 – Central (City Bus Hub)',
      latitude: 13.0845,
      longitude: 80.2750,
      image: '',
      status: 'Assigned',
      priority: 'Medium',
      department: 'Solid Waste Management Dept',
      created_at: '2026-09-28T08:15:00Z',
      updated_at: '2026-09-28T10:00:00Z',
      timeline: [
        { stage: 'Reported', date: '2026-09-28 08:15 AM', dept: 'Mobile App', notes: 'Issue registered.' },
        { stage: 'Under Review', date: '2026-09-28 09:00 AM', dept: 'Clean City Control', notes: 'IoT level sensor confirmed 98% full.' },
        { stage: 'Assigned', date: '2026-09-28 10:00 AM', dept: 'Solid Waste Mgmt', notes: 'Compactor Truck #8 scheduled for 11:30 AM run.' }
      ]
    },
    {
      id: 'CC-2026-4792',
      user_id: 'usr-2',
      user_name: 'Rahul Verma',
      contact: 'rahul.v@example.com',
      title: 'Water pipe leakage on Tech Park Boulevard',
      category: 'Water Supply',
      description: 'Potable water leaking onto the pavement opposite Innovation Hub tower.',
      location: 'Zone 3 – Tech Park',
      latitude: 13.0860,
      longitude: 80.2790,
      image: '',
      status: 'Under Review',
      priority: 'High',
      department: 'Water Supply & Sewerage Board',
      created_at: '2026-09-29T07:45:00Z',
      updated_at: '2026-09-29T08:30:00Z',
      timeline: [
        { stage: 'Reported', date: '2026-09-29 07:45 AM', dept: 'Civic Intake AI', notes: 'Reported with photo.' },
        { stage: 'Under Review', date: '2026-09-29 08:30 AM', dept: 'Hydraulic Operations', notes: 'Acoustic leak detector queued.' }
      ]
    },
    {
      id: 'CC-2026-4780',
      user_id: 'usr-2',
      user_name: 'Rahul Verma',
      contact: 'rahul.v@example.com',
      title: 'Broken stormwater drain grate',
      category: 'Drainage',
      description: 'Cast iron drain grating broken, posing severe hazard to bicycles.',
      location: 'Zone 4 – Old Town Market Gate',
      latitude: 13.0790,
      longitude: 80.2650,
      image: '',
      status: 'Reported',
      priority: 'High',
      department: 'Municipal Drainage Section',
      created_at: '2026-09-29T11:00:00Z',
      updated_at: '2026-09-29T11:00:00Z',
      timeline: [
        { stage: 'Reported', date: '2026-09-29 11:00 AM', dept: 'Portal Intake', notes: 'Complaint logged. Awaiting engineering triage.' }
      ]
    }
  ],
  services: [
    { id: 'srv-1', name: 'Apollo City Multispecialty Hospital', category: 'Hospitals', address: '21 Greams Lane, Zone 1 – Central', phone: '+91 44 2829 0200', hours: 'Open 24/7 (Emergency & Trauma)', distance: '0.6 km', lat: 13.0827, lng: 80.2707, emergency: true },
    { id: 'srv-2', name: 'Government General City Hospital', category: 'Hospitals', address: 'Station Road, Zone 1 – Central', phone: '+91 44 2530 5000', hours: 'Open 24/7 (Free Public Care)', distance: '1.2 km', lat: 13.0840, lng: 80.2730, emergency: true },
    { id: 'srv-3', name: 'Urban Primary Health Clinic', category: 'Clinics', address: 'Ward 14 Civic Center, Zone 2 – Riverside', phone: '+91 44 2499 1122', hours: '08:00 AM – 08:00 PM', distance: '0.4 km', lat: 13.0815, lng: 80.2685 },
    { id: 'srv-4', name: 'MedPlus 24/7 Pharmacy & First Aid', category: 'Pharmacies', address: '45 Lake Promenade, Zone 2 – Riverside', phone: '+91 44 2499 3344', hours: 'Open 24 Hours', distance: '0.3 km', lat: 13.0805, lng: 80.2678 },
    { id: 'srv-5', name: 'City Central Police Station (Law & Order)', category: 'Police Stations', address: 'Police Line Rd, Zone 1 – Central', phone: '100 / 044-2345 2000', hours: 'Open 24/7', distance: '0.9 km', lat: 13.0850, lng: 80.2715, emergency: true },
    { id: 'srv-6', name: 'Riverside Community Police Outpost', category: 'Police Stations', address: 'Sector 4, Zone 2 – Riverside', phone: '100 / 044-2499 5566', hours: 'Open 24/7', distance: '0.7 km', lat: 13.0800, lng: 80.2695, emergency: true },
    { id: 'srv-7', name: 'Municipal Fire & Rescue Station #2', category: 'Fire Stations', address: 'Industrial Ring Rd, Zone 3 – Tech Park', phone: '101 / 044-2855 0101', hours: 'Open 24/7 Emergency Dispatch', distance: '1.8 km', lat: 13.0870, lng: 80.2810, emergency: true },
    { id: 'srv-8', name: 'Greater Municipal Corporation HQ (E-Seva)', category: 'Government Offices', address: 'Rippon Civic Plaza, Zone 1 – Central', phone: '+91 44 2561 9200', hours: '09:30 AM – 05:30 PM (Mon-Sat)', distance: '1.1 km', lat: 13.0838, lng: 80.2745 },
    { id: 'srv-9', name: 'Ward 14 Councillor & Grievance Office', category: 'Government Offices', address: 'Community Hall Rd, Zone 2 – Riverside', phone: '+91 44 2499 7788', hours: '10:00 AM – 04:00 PM (Mon-Fri)', distance: '0.5 km', lat: 13.0818, lng: 80.2710 },
    { id: 'srv-10', name: 'Smart IoT Public E-Toilet (She & He)', category: 'Public Toilets', address: 'Near Riverside Park Gate 1', phone: 'Toll-free 1913', hours: '05:00 AM – 11:00 PM (Automated sanitization)', distance: '0.2 km', lat: 13.0825, lng: 80.2698 },
    { id: 'srv-11', name: 'Central Bus Terminal & EV Charger Bay', category: 'Bus Stops', address: 'Grand Southern Trunk Rd, Zone 1', phone: '+91 44 2479 4700', hours: '24/7 Bus Transit Hub', distance: '1.0 km', lat: 13.0848, lng: 80.2755 },
    { id: 'srv-12', name: 'Riverside Metro & Commuter Railway Station', category: 'Railway Stations', address: 'Metro Line 2 Interchange', phone: '+91 44 2855 8899', hours: '05:30 AM – 11:30 PM', distance: '0.8 km', lat: 13.0810, lng: 80.2725 },
    { id: 'srv-13', name: 'Smart Multi-Level Automated Parking (312 slots)', category: 'Parking', address: 'Commercial Boulevard, Zone 1 – Central', phone: '+91 44 2850 1100', hours: '24/7 Automated Entry/Fastag', distance: '0.7 km', lat: 13.0832, lng: 80.2718 },
    { id: 'srv-14', name: 'State Bank & HDFC 24/7 ATM Kiosk', category: 'ATMs', address: 'Tech Park Concourse, Zone 3', phone: '1800 1234', hours: 'Open 24 Hours', distance: '0.5 km', lat: 13.0855, lng: 80.2770 },
    { id: 'srv-15', name: 'Eco-Smart Segregated Waste & E-Waste Center', category: 'Waste Collection Points', address: 'Ward 14 Depot, Zone 2 – Riverside', phone: '1913 (Solid Waste Help)', hours: '06:00 AM – 06:00 PM Daily', distance: '0.4 km', lat: 13.0808, lng: 80.2702 }
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Scheduled Water Supply Pipeline Maintenance',
      category: 'Water',
      description: 'Municipal water pressure will be temporarily throttled between 1:00 PM and 5:00 PM for valve upgrades along Lake Road.',
      location: 'Zone 2 – Riverside (Wards 14 & 15)',
      priority: 'High',
      source: 'Water Supply & Sewerage Board',
      date: '2026-09-29'
    },
    {
      id: 'ann-2',
      title: 'Night Road Resurfacing & Traffic Diversion',
      category: 'Traffic',
      description: 'Northbound lane on Tech Park Boulevard closed for smart asphalt laying from 10:00 PM to 05:00 AM. Use Ring Road diversion.',
      location: 'Zone 3 – Tech Park Corridor',
      priority: 'Medium',
      source: 'City Traffic Police Wing',
      date: '2026-09-29'
    },
    {
      id: 'ann-3',
      title: 'Substation Microgrid Synchronization & Green Energy Sync',
      category: 'Electricity',
      description: 'Zero outage expected: 90kW rooftop solar grid synchronizing with central substation. No interruption to domestic feeders.',
      location: 'Zone 1 – Central Plaza',
      priority: 'Low',
      source: 'Renewable Power Corporation',
      date: '2026-09-28'
    },
    {
      id: 'ann-4',
      title: 'Monsoon High Alert: Flood Sluice Gates 100% Operational',
      category: 'Public Safety',
      description: 'Automated IoT water level sensors operating at 100% telemetry. Emergency disaster shelters pre-stocked in Zone 2.',
      location: 'Zone 2 – Riverfront & Canal Banks',
      priority: 'Emergency',
      source: 'Disaster Management Authority',
      date: '2026-09-29'
    },
    {
      id: 'ann-5',
      title: 'Green City Cyclothon & Open Street Sunday',
      category: 'Events',
      description: 'Main Promenade will be closed to motor vehicles between 06:00 AM and 10:00 AM for citizen cycling, yoga, and street music.',
      location: 'Riverside Promenade',
      priority: 'Low',
      source: 'Parks & Recreation Department',
      date: '2026-10-04'
    }
  ],
  communityIdeas: [
    {
      id: 'idea-1',
      user_id: 'usr-1',
      user_name: 'Priya Sharma',
      title: 'Install Solar Smart Benches with USB & Wi-Fi in Riverside Park',
      description: 'Solar powered shaded seating where students and remote workers can recharge devices and access municipal Wi-Fi.',
      category: 'Smart Energy',
      location: 'Zone 2 – Riverside',
      votes: 56,
      voted_users: ['usr-1', 'usr-2'],
      created_at: '2026-09-25'
    },
    {
      id: 'idea-2',
      user_id: 'usr-2',
      user_name: 'Rahul Verma',
      title: 'AI Pedestrian Countdown Signals on Tech Park Boulevard',
      description: 'Automated thermal sensors that extend crossing time for seniors and pedestrians carrying heavy groceries.',
      category: 'Mobility & Safety',
      location: 'Zone 3 – Tech Park',
      votes: 42,
      voted_users: ['usr-2'],
      created_at: '2026-09-26'
    },
    {
      id: 'idea-3',
      user_id: 'usr-1',
      user_name: 'Sunita Rao',
      title: 'Community Herbal Garden and Rainwater Harvesting in Old Town',
      description: 'Transform an unused municipal parcel into an urban pollinator sanctuary and groundwater recharge pit.',
      category: 'Green City',
      location: 'Zone 4 – Old Town',
      votes: 38,
      voted_users: [],
      created_at: '2026-09-27'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      user_id: 'usr-1',
      title: 'Complaint In Progress',
      message: 'Your report CC-2026-4821 (Road Damage) has been assigned to Asphalt Repair Crew #3.',
      read: false,
      created_at: '2026-09-28 10:15 AM',
      link: '#/track?id=CC-2026-4821'
    },
    {
      id: 'notif-2',
      user_id: 'usr-1',
      title: 'Streetlight Issue Resolved ✓',
      message: 'Report CC-2026-4819 was verified resolved by Electrical Wing. Tap to view notes.',
      read: true,
      created_at: '2026-09-23 11:20 AM',
      link: '#/track?id=CC-2026-4819'
    },
    {
      id: 'notif-3',
      user_id: 'usr-1',
      title: 'City Water Advisory',
      message: 'Scheduled valve maintenance in Zone 2 between 1 PM and 5 PM today.',
      read: false,
      created_at: '2026-09-29 08:00 AM',
      link: '#/updates'
    }
  ]
};

// ── Database Manager ──
const Store = {
  get data() {
    let d = localStorage.getItem('cc_civic_db');
    if (!d) {
      localStorage.setItem('cc_civic_db', JSON.stringify(DB_SEEDS));
      return DB_SEEDS;
    }
    try {
      return JSON.parse(d);
    } catch (e) {
      localStorage.setItem('cc_civic_db', JSON.stringify(DB_SEEDS));
      return DB_SEEDS;
    }
  },
  save(d) {
    localStorage.setItem('cc_civic_db', JSON.stringify(d));
  },
  get currentUser() {
    const raw = localStorage.getItem('cc_current_user');
    if (!raw) {
      // Default to Priya Sharma for seamless hackathon testing
      const u = DB_SEEDS.users[0];
      localStorage.setItem('cc_current_user', JSON.stringify(u));
      return u;
    }
    try { return JSON.parse(raw); } catch (e) { return DB_SEEDS.users[0]; }
  },
  setCurrentUser(u) {
    if (u) localStorage.setItem('cc_current_user', JSON.stringify(u));
    else localStorage.removeItem('cc_current_user');
    updateNavbarUser();
  },
  get theme() { return localStorage.getItem('sc-theme') || 'system'; },
  set theme(v) { localStorage.setItem('sc-theme', v); applyTheme(v); },
  get lang() { return localStorage.getItem('sc-lang') || 'en'; },
  set lang(v) { localStorage.setItem('sc-lang', v); }
};

function applyTheme(theme) {
  const r = document.documentElement;
  if (theme === 'system') r.removeAttribute('data-theme');
  else r.dataset.theme = theme;
}
applyTheme(Store.theme);

/* ═══════════════════════════════════════════════════════════════
   DATABASE CRUD HELPERS (Scoped by User)
   ═══════════════════════════════════════════════════════════════ */

const CivicDB = {
  getReports(userId = null) {
    const db = Store.data;
    if (!userId) return db.reports || [];
    return (db.reports || []).filter(r => r.user_id === userId);
  },
  getReportById(id) {
    const db = Store.data;
    const clean = id.trim().toUpperCase();
    return (db.reports || []).find(r => r.id.toUpperCase() === clean);
  },
  getReportsByContact(contact) {
    const db = Store.data;
    const q = contact.trim().toLowerCase();
    return (db.reports || []).filter(r => 
      (r.contact && r.contact.toLowerCase().includes(q)) ||
      (r.user_name && r.user_name.toLowerCase().includes(q))
    );
  },
  createReport(reportData) {
    const db = Store.data;
    const user = Store.currentUser;
    const newId = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString();
    const newReport = {
      id: newId,
      user_id: user ? user.id : 'guest',
      user_name: user ? user.name : (reportData.name || 'Anonymous Citizen'),
      contact: reportData.contact || (user ? user.email : ''),
      title: reportData.title,
      category: reportData.category,
      description: reportData.description,
      location: reportData.location,
      latitude: reportData.latitude || 13.0827,
      longitude: reportData.longitude || 80.2707,
      image: reportData.image || '',
      status: 'Reported',
      priority: reportData.priority || 'Medium',
      department: 'Municipal Intake Desk',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      timeline: [
        {
          stage: 'Reported',
          date: nowStr,
          dept: 'CivicConnect Intake',
          notes: 'Report received and registered in municipal dispatch queue.'
        }
      ]
    };
    db.reports.unshift(newReport);

    // Add notification for user
    if (user) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: user.id,
        title: 'Report Submitted Successfully',
        message: `Your report ${newId} (${reportData.category}) has been logged with Municipal Intake.`,
        read: false,
        created_at: 'Just now',
        link: `#/track?id=${newId}`
      });
    }

    Store.save(db);
    return newReport;
  },
  updateReportStatus(reportId, nextStage, dept, notes) {
    const db = Store.data;
    const report = (db.reports || []).find(r => r.id === reportId);
    if (!report) return null;
    report.status = nextStage;
    if (dept) report.department = dept;
    report.updated_at = new Date().toISOString();
    report.timeline.push({
      stage: nextStage,
      date: new Date().toLocaleString(),
      dept: dept || report.department,
      notes: notes || `Status updated to ${nextStage}.`
    });

    // Notify the report author
    if (report.user_id) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: report.user_id,
        title: `Report ${reportId} Updated`,
        message: `Status changed to "${nextStage}" by ${dept || 'City Authority'}.`,
        read: false,
        created_at: 'Just now',
        link: `#/track?id=${reportId}`
      });
    }

    Store.save(db);
    return report;
  },
  getServices(cat = 'all') {
    const db = Store.data;
    if (cat === 'all' || !cat) return db.services || [];
    return (db.services || []).filter(s => s.category.toLowerCase() === cat.toLowerCase());
  },
  getAnnouncements(filter = 'All') {
    const db = Store.data;
    if (filter === 'All' || !filter) return db.announcements || [];
    return (db.announcements || []).filter(a => a.category.toLowerCase() === filter.toLowerCase());
  },
  getCommunityIdeas() {
    const db = Store.data;
    return db.communityIdeas || [];
  },
  createCommunityIdea(idea) {
    const db = Store.data;
    const user = Store.currentUser;
    const newIdea = {
      id: `idea-${Date.now()}`,
      user_id: user ? user.id : 'guest',
      user_name: user ? user.name : 'Active Citizen',
      title: idea.title,
      description: idea.description,
      category: idea.category,
      location: idea.location,
      votes: 1,
      voted_users: user ? [user.id] : [],
      created_at: new Date().toISOString().split('T')[0]
    };
    db.communityIdeas.unshift(newIdea);
    Store.save(db);
    return newIdea;
  },
  voteIdea(ideaId) {
    const db = Store.data;
    const user = Store.currentUser;
    const idea = db.communityIdeas.find(i => i.id === ideaId);
    if (!idea) return;
    if (!idea.voted_users) idea.voted_users = [];
    const uid = user ? user.id : 'guest';
    if (idea.voted_users.includes(uid)) {
      idea.voted_users = idea.voted_users.filter(u => u !== uid);
      idea.votes = Math.max(0, idea.votes - 1);
    } else {
      idea.voted_users.push(uid);
      idea.votes += 1;
      Sound.play('award');
    }
    Store.save(db);
    return idea;
  },
  getNotifications(userId) {
    const db = Store.data;
    return (db.notifications || []).filter(n => n.user_id === userId);
  },
  markNotificationRead(notifId) {
    const db = Store.data;
    const n = (db.notifications || []).find(item => item.id === notifId);
    if (n) {
      n.read = true;
      Store.save(db);
    }
  },
  clearAllNotifications(userId) {
    const db = Store.data;
    db.notifications = (db.notifications || []).filter(n => n.user_id !== userId);
    Store.save(db);
  }
};

/* ═══════════════════════════════════════════════════════════════
   AUTHENTICATION ENGINE
   ═══════════════════════════════════════════════════════════════ */

const Auth = {
  login(email, password) {
    const db = Store.data;
    const user = (db.users || []).find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { ok: false, error: 'No account registered with this email address.' };
    }
    if (user.password !== password) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }
    Store.setCurrentUser(user);
    return { ok: true, user };
  },
  signup(data) {
    const db = Store.data;
    const existing = (db.users || []).find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { ok: false, error: 'An account with this email address already exists.' };
    }
    if (data.password !== data.confirmPassword) {
      return { ok: false, error: 'Passwords do not match. Please verify.' };
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: 'citizen',
      city: data.city || 'Zone 1 – Central',
      avatar: '🧑',
      points: 50,
      created_at: new Date().toISOString().split('T')[0]
    };
    db.users.push(newUser);
    Store.save(db);
    Store.setCurrentUser(newUser);
    return { ok: true, user: newUser };
  },
  logout() {
    Store.setCurrentUser(null);
    toast('info', 'Logged Out', 'You have been safely signed out.');
    navigate('home');
  }
};

function updateNavbarUser() {
  const u = Store.currentUser;
  const pBtn = $('#nav-profile-btn');
  if (pBtn) {
    if (u) {
      pBtn.innerHTML = `<span>${u.avatar || '👤'}</span> <span class="profile-name">${u.name.split(' ')[0]}</span>`;
      pBtn.href = u.role === 'admin' ? '#/admin' : '#/profile';
    } else {
      pBtn.innerHTML = `<span>🔑</span> <span class="profile-name">Login</span>`;
      pBtn.href = '#/login';
    }
  }

  // Sidebar user card / login button
  const userBlock = $('#sidebar-user-block');
  if (userBlock) {
    if (u) {
      userBlock.innerHTML = `
        <div class="sidebar-user-card">
          <a href="#/profile" class="sidebar-user-info" title="View Citizen Profile">
            <span class="sidebar-user-avatar">${u.avatar || '👤'}</span>
            <div class="sidebar-user-details">
              <span class="sidebar-user-name">${u.name}</span>
              <span class="sidebar-user-role">${u.role === 'admin' ? '🏛️ Administrator' : 'Verified Citizen'}</span>
            </div>
          </a>
          <button class="sidebar-logout-btn" id="sidebar-logout-btn" title="Log Out" aria-label="Log Out">⎋</button>
        </div>
      `;
      $('#sidebar-logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        Store.setCurrentUser(null);
        Sound.play('click');
        window.location.hash = '#/home';
      });
    } else {
      userBlock.innerHTML = `
        <a class="sidebar-user-btn" href="#/login" id="sidebar-auth-btn">
          <span class="sidebar-user-avatar">🔐</span>
          <div class="sidebar-user-details">
            <span class="sidebar-user-name">Citizen Login</span>
            <span class="sidebar-user-role">Sign in / Register</span>
          </div>
        </a>
      `;
    }
  }

  // Admin link in nav & sidebar
  const adminNav = $('#nav-lnk-admin');
  if (adminNav) {
    adminNav.style.display = (u && u.role === 'admin') ? 'flex' : 'none';
  }
  updateNotificationsUI();
}

function updateNotificationsUI() {
  const u = Store.currentUser;
  const notifs = u ? CivicDB.getNotifications(u.id) : [];
  const unread = notifs.filter(n => !n.read).length;
  const badge = $('#notif-badge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }
  const list = $('#notif-dropdown-list');
  if (list) {
    if (notifs.length === 0) {
      list.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:var(--fs-sm)">No new notifications</div>`;
    } else {
      list.innerHTML = notifs.map(n => `
        <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}" data-link="${n.link || ''}">
          <div class="notif-dot"></div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:var(--fs-xs);color:var(--text-primary)">${n.title}</div>
            <div style="font-size:11px;color:var(--text-muted);margin:2px 0">${n.message}</div>
            <div style="font-size:10px;color:var(--text-muted)">${n.created_at}</div>
          </div>
        </div>
      `).join('');
      list.querySelectorAll('.notif-item').forEach(el => {
        el.onclick = () => {
          CivicDB.markNotificationRead(el.dataset.id);
          updateNotificationsUI();
          if (el.dataset.link) window.location.hash = el.dataset.link;
          $('#notif-dropdown').classList.remove('active');
        };
      });
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   GLOBAL SEARCH ENGINE
   ═══════════════════════════════════════════════════════════════ */

function openGlobalSearch() {
  const modal = $('#global-search-modal');
  if (modal) {
    modal.classList.add('active');
    const inp = $('#global-search-input');
    if (inp) {
      inp.value = '';
      inp.focus();
      renderSearchResults('');
    }
  }
}

function closeGlobalSearch() {
  const modal = $('#global-search-modal');
  if (modal) modal.classList.remove('active');
}

function renderSearchResults(query) {
  const resArea = $('#global-search-results');
  if (!resArea) return;
  const q = query.trim().toLowerCase();

  const db = Store.data;
  const services = db.services || [];
  const reports = db.reports || [];
  const announcements = db.announcements || [];
  const ideas = db.communityIdeas || [];

  if (!q) {
    resArea.innerHTML = `
      <div style="padding:12px;font-size:var(--fs-xs);color:var(--text-muted)">
        💡 Try searching for: <b>"Hospital"</b>, <b>"Pothole"</b>, <b>"Water"</b>, <b>"Bus"</b>, <b>"Police"</b>, or ticket ID like <b>"CC-2026-4821"</b>
      </div>
    `;
    return;
  }

  const srvMatches = services.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  const repMatches = reports.filter(r => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  const annMatches = announcements.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  const ideaMatches = ideas.filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));

  let html = '';

  if (srvMatches.length > 0) {
    html += `<div class="search-result-group"><div class="search-group-title">Public Services (${srvMatches.length})</div>`;
    srvMatches.slice(0, 3).forEach(s => {
      html += `
        <div class="search-result-card" onclick="window.location.hash='#/services'; closeGlobalSearch();">
          <div>
            <div style="font-weight:700;font-size:var(--fs-sm)">${s.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${s.category} · ${s.address}</div>
          </div>
          <span class="badge-low">${s.distance}</span>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (repMatches.length > 0) {
    html += `<div class="search-result-group"><div class="search-group-title">Complaints & Tickets (${repMatches.length})</div>`;
    repMatches.slice(0, 3).forEach(r => {
      html += `
        <div class="search-result-card" onclick="window.location.hash='#/track?id=${r.id}'; closeGlobalSearch();">
          <div>
            <div style="font-weight:700;font-size:var(--fs-sm)">${r.title}</div>
            <div style="font-size:11px;color:var(--text-muted)">ID: <b>${r.id}</b> · ${r.category} · ${r.location}</div>
          </div>
          <span class="badge-${r.status === 'Resolved' ? 'low' : r.status === 'In Progress' ? 'medium' : 'high'}">${r.status}</span>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (annMatches.length > 0) {
    html += `<div class="search-result-group"><div class="search-group-title">City Updates & Advisories (${annMatches.length})</div>`;
    annMatches.slice(0, 2).forEach(a => {
      html += `
        <div class="search-result-card" onclick="window.location.hash='#/updates'; closeGlobalSearch();">
          <div>
            <div style="font-weight:700;font-size:var(--fs-sm)">${a.title}</div>
            <div style="font-size:11px;color:var(--text-muted)">${a.source} · ${a.location}</div>
          </div>
          <span class="badge-${a.priority.toLowerCase()}">${a.priority}</span>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (ideaMatches.length > 0) {
    html += `<div class="search-result-group"><div class="search-group-title">Community Proposals (${ideaMatches.length})</div>`;
    ideaMatches.slice(0, 2).forEach(i => {
      html += `
        <div class="search-result-card" onclick="window.location.hash='#/community'; closeGlobalSearch();">
          <div>
            <div style="font-weight:700;font-size:var(--fs-sm)">${i.title}</div>
            <div style="font-size:11px;color:var(--text-muted)">${i.category} · ${i.votes} upvotes</div>
          </div>
          <span class="badge-low">💡 Idea</span>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (!html) {
    html = `<div style="text-align:center;padding:24px;color:var(--text-muted)">No matching services, complaints, or updates found for "${query}".</div>`;
  }

  resArea.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════════
   PAGE RENDERERS
   ═══════════════════════════════════════════════════════════════ */

const pages = {};

// ─────────────────────────────────────────────────────────────
// 1. LANDING / HOME PAGE
// ─────────────────────────────────────────────────────────────
pages.home = function(ct) {
  const db = Store.data;
  const totalRep = (db.reports || []).length;
  const resolvedRep = (db.reports || []).filter(r => r.status === 'Resolved').length;
  const activeCit = (db.users || []).length * 420 + 1280;
  const availSrv = (db.services || []).length;

  ct.innerHTML = `
    <!-- Hero Section -->
    <header class="hero" id="home">
      <div class="wrapper hero__content">
        <div class="badge-low" style="margin-bottom:var(--space-sm);align-self:flex-start;background:rgba(47,191,113,0.18)">
          🏙️ CivicConnect 2.0 Smart City Platform
        </div>
        <h1 class="hero__title" style="letter-spacing:-0.03em">Build a Better City Together</h1>
        <p class="hero__subtitle">
          Report issues, access civic services, stay informed, and make your city smarter.
        </p>

        <div class="hero__buttons">
          <a class="btn btn-lg" href="#/report" style="color:#fff">
            <span>📢</span> Report an Issue
          </a>
          <a class="btn btn-lg btn-outline" href="#/services" style="color:#fff;border-color:rgba(255,255,255,.4)">
            <span>🏛️</span> Explore City Services
          </a>
        </div>

        <div class="hero__health glass-static" style="margin-top:var(--space-lg)" role="status">
          <div style="display:flex;align-items:center;gap:12px">
            <span class="hero__score" id="health-score">94</span>
            <div>
              <span class="hero__score-label" style="display:block">City Vitality Index</span>
              <small style="color:var(--success);font-weight:600">Optimal Performance · All Wards Operational</small>
            </div>
          </div>
          <span class="hero__ticker" id="ticker">⚡ 90kW rooftop solar grid synced · 🚌 Route 14 EV Fleet online · 💧 Water pressure optimal in all sectors</span>
        </div>
      </div>

      <!-- Modern City Skyline Illustration -->
      <svg class="hero__skyline" viewBox="0 0 1200 260" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#12b8d0" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#0a2236" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <g fill="url(#sky-grad)">
          <rect x="30" y="140" width="70" height="120" rx="4"/>
          <rect x="110" y="80" width="60" height="180" rx="4"/>
          <rect x="180" y="120" width="85" height="140" rx="4"/>
          <rect x="280" y="45" width="75" height="215" rx="4"/>
          <rect x="370" y="105" width="90" height="155" rx="4"/>
          <rect x="475" y="65" width="65" height="195" rx="4"/>
          <rect x="550" y="130" width="110" height="130" rx="4"/>
          <rect x="675" y="30" width="70" height="230" rx="4"/>
          <rect x="760" y="95" width="85" height="165" rx="4"/>
          <rect x="860" y="55" width="75" height="205" rx="4"/>
          <rect x="950" y="125" width="95" height="135" rx="4"/>
          <rect x="1060" y="75" width="70" height="185" rx="4"/>
        </g>
        <path d="M140 80 L317 45 L507 65 L710 30 L897 55 L1095 75" stroke="#2fbf71" stroke-width="2" fill="none" opacity="0.85"/>
        <g fill="#2fbf71">
          <circle cx="140" cy="80" r="5" class="pulse"/>
          <circle cx="317" cy="45" r="5" class="pulse" style="animation-delay:.3s"/>
          <circle cx="507" cy="65" r="5" class="pulse" style="animation-delay:.6s"/>
          <circle cx="710" cy="30" r="5" class="pulse" style="animation-delay:.9s"/>
          <circle cx="897" cy="55" r="5" class="pulse" style="animation-delay:1.2s"/>
          <circle cx="1095" cy="75" r="5" class="pulse" style="animation-delay:1.5s"/>
        </g>
      </svg>
    </header>

    <!-- Quick Actions Bar -->
    <section class="section" style="padding:var(--space-xl) 0 var(--space-md)">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>Quick Actions</h2>
          <p class="section-subtitle">Direct, fast access to critical civic utilities and services</p>
        </div>
        <div class="grid-auto stagger-in" id="quick-actions-grid">
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/report'">
            <div class="icon-circle" style="background:rgba(29,111,232,0.15);color:var(--primary)">📢</div>
            <div class="card__title">Report Civic Issue</div>
            <div class="card__text">Snap photo, pin location, and notify municipal teams instantly.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/track'">
            <div class="icon-circle" style="background:rgba(47,191,113,0.15);color:var(--success)">🔍</div>
            <div class="card__title">Track Complaint</div>
            <div class="card__text">Follow real-time 5-stage progress from intake to resolution.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/services'">
            <div class="icon-circle" style="background:rgba(18,184,208,0.15);color:var(--accent)">📍</div>
            <div class="card__title">Find Nearby Services</div>
            <div class="card__text">Locate hospitals, clinics, police, ATMs, and public facilities.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/emergency'">
            <div class="icon-circle" style="background:rgba(229,72,77,0.15);color:var(--danger)">🚨</div>
            <div class="card__title">Emergency Help</div>
            <div class="card__text">One-tap direct dial for Police (100), Ambulance (108), Fire (101).</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/updates'">
            <div class="icon-circle" style="background:rgba(245,165,36,0.15);color:var(--warning)">🔔</div>
            <div class="card__title">City Updates</div>
            <div class="card__text">Live traffic advisories, water supply repairs, and public notices.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- City Statistics with Animated Counters -->
    <section class="section-alt" style="padding:var(--space-xl) 0">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>City Statistics & Performance</h2>
          <p class="section-subtitle">Real-time metrics tracking municipal operational transparency</p>
        </div>
        <div class="grid-4 stagger-in" id="city-stats-grid">
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value gradient-text" id="stat-issues-rep">0</span>
            <div style="font-weight:700;margin-top:4px">Issues Reported</div>
            <small style="color:var(--text-muted)">Public grievances logged</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--success)" id="stat-issues-res">0</span>
            <div style="font-weight:700;margin-top:4px">Issues Resolved</div>
            <small style="color:var(--success)">83.4% overall resolution rate</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value gradient-text" id="stat-active-cit">0</span>
            <div style="font-weight:700;margin-top:4px">Active Citizens</div>
            <small style="color:var(--text-muted)">Engaged in ward life</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--primary)" id="stat-avail-srv">0</span>
            <div style="font-weight:700;margin-top:4px">Available Services</div>
            <small style="color:var(--text-muted)">Hospitals, transit, utilities</small>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works (4 Steps) -->
    <section class="section" style="padding:var(--space-2xl) 0">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>How CivicConnect Works</h2>
          <p class="section-subtitle">Empowering citizens and municipal departments in 4 simple stages</p>
        </div>
        <div class="grid-4 stagger-in">
          <div class="glass" style="position:relative">
            <div style="font-size:2rem;font-weight:900;color:var(--primary);opacity:0.25;position:absolute;top:10px;right:16px">01</div>
            <div class="icon-circle" style="background:rgba(29,111,232,0.15);color:var(--primary);margin-bottom:var(--space-md)">📸</div>
            <div class="card__title">1. Report</div>
            <div class="card__text">Snap an image, pin location on the map, describe the issue, and receive a permanent tracking ID.</div>
          </div>
          <div class="glass" style="position:relative">
            <div style="font-size:2rem;font-weight:900;color:var(--accent);opacity:0.25;position:absolute;top:10px;right:16px">02</div>
            <div class="icon-circle" style="background:rgba(18,184,208,0.15);color:var(--accent);margin-bottom:var(--space-md)">📡</div>
            <div class="card__title">2. Track</div>
            <div class="card__text">Watch real-time status as the issue moves to review, departmental assignment, and field dispatch.</div>
          </div>
          <div class="glass" style="position:relative">
            <div style="font-size:2rem;font-weight:900;color:var(--warning);opacity:0.25;position:absolute;top:10px;right:16px">03</div>
            <div class="icon-circle" style="background:rgba(245,165,36,0.15);color:var(--warning);margin-bottom:var(--space-md)">🛠️</div>
            <div class="card__title">3. Resolve</div>
            <div class="card__text">Dedicated municipal engineering crews repair the problem and upload verification notes.</div>
          </div>
          <div class="glass" style="position:relative">
            <div style="font-size:2rem;font-weight:900;color:var(--success);opacity:0.25;position:absolute;top:10px;right:16px">04</div>
            <div class="icon-circle" style="background:rgba(47,191,113,0.15);color:var(--success);margin-bottom:var(--space-md)">🌱</div>
            <div class="card__title">4. Improve</div>
            <div class="card__text">Data-driven analytics prevent recurring problems and award citizen green points.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Smart City Features Grid (8 Cards) -->
    <section class="section-alt" style="padding:var(--space-2xl) 0">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>Smart City Features</h2>
          <p class="section-subtitle">A unified civic ecosystem designed for modern urban governance</p>
        </div>
        <div class="grid-4 stagger-in">
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/report'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">📢</div>
            <div class="card__title">Civic Issue Reporting</div>
            <div class="card__text">Report road damage, streetlights, and sanitation with GPS auto-detection.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/track'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">📋</div>
            <div class="card__title">Complaint Tracking</div>
            <div class="card__text">Detailed timeline with department names, officer remarks, and timestamps.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/services'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">🏥</div>
            <div class="card__title">Smart Services</div>
            <div class="card__text">Explore 12+ public service categories with interactive distance calculations.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/emergency'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">🚨</div>
            <div class="card__title">Emergency Assistance</div>
            <div class="card__text">Direct helpline dialers and step-by-step CPR/disaster safety guidance.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/transit'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">🚌</div>
            <div class="card__title">Public Transport</div>
            <div class="card__text">Real-time bus arrival countdowns, metro schedules, and EV charging slots.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/waste'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">♻️</div>
            <div class="card__title">Waste Management</div>
            <div class="card__text">Collection schedules, segregation manuals, and illegal dumping reporting.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/updates'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">💧</div>
            <div class="card__title">Water & Electricity</div>
            <div class="card__text">Outage notices, pipeline pressure telemetry, and planned maintenance alerts.</div>
          </div>
          <div class="glass" style="cursor:pointer" onclick="window.location.hash='#/community'">
            <div class="icon-circle" style="margin-bottom:var(--space-md)">🤝</div>
            <div class="card__title">Community Participation</div>
            <div class="card__text">Participate in ward surveys, vote on local ideas, and support green projects.</div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Animate counters
  setTimeout(() => {
    countUp($('#stat-issues-rep'), totalRep + 1280, 800);
    countUp($('#stat-issues-res'), resolvedRep + 1040, 800);
    countUp($('#stat-active-cit'), activeCit, 800);
    countUp($('#stat-avail-srv'), availSrv, 600);
  }, 100);
};

// ─────────────────────────────────────────────────────────────
// 2. CITIZEN DASHBOARD
// ─────────────────────────────────────────────────────────────
pages.dashboard = function(ct) {
  const user = Store.currentUser;
  if (!user) {
    ct.innerHTML = `
      <section class="section">
        <div class="wrapper" style="max-width:540px;text-align:center;padding:60px 20px">
          <div style="font-size:3rem;margin-bottom:12px">🔒</div>
          <h2>Sign In to Access Your Citizen Dashboard</h2>
          <p style="color:var(--text-muted);margin-bottom:24px">Track your personal complaints, view ward alerts, and manage civic points.</p>
          <a class="btn btn-lg" href="#/login">Login to CivicConnect</a>
        </div>
      </section>
    `;
    return;
  }

  // User-scoped private reports
  const userReports = CivicDB.getReports(user.id);
  const total = userReports.length;
  const pending = userReports.filter(r => r.status === 'Reported' || r.status === 'Under Review').length;
  const inProg = userReports.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length;
  const resolved = userReports.filter(r => r.status === 'Resolved').length;

  const db = Store.data;
  const allReports = db.reports || [];
  const announcements = db.announcements || [];

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <!-- Personalized Greeting -->
        <div class="glass-static" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:var(--space-xl);background:linear-gradient(135deg,rgba(29,111,232,0.1),var(--surface))">
          <div style="display:flex;align-items:center;gap:16px">
            <div style="font-size:2.8rem">${user.avatar || '👤'}</div>
            <div>
              <h1 style="margin:0;font-size:var(--fs-xl)">Welcome, ${user.name}</h1>
              <p style="color:var(--text-muted);margin:4px 0 0;font-size:var(--fs-sm)">
                📍 ${user.city || 'Zone 2 – Riverside'} · Citizen ID: <b>${user.id}</b> · Civic Points: <b style="color:var(--success)">${user.points || 120} pts</b>
              </p>
            </div>
          </div>
          <div style="display:flex;gap:10px">
            <a class="btn btn-sm" href="#/report">📢 Report New Issue</a>
            <a class="btn btn-sm btn-outline" href="#/track">🔍 Track Ticket</a>
          </div>
        </div>

        <!-- My Reports Summary Cards -->
        <div class="section-header reveal">
          <h2>My Reports Summary</h2>
          <p class="section-subtitle">Real-time status of civic complaints filed from your account</p>
        </div>
        <div class="grid-4 stagger-in" style="margin-bottom:var(--space-xl)">
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value gradient-text">${total}</span>
            <div style="font-weight:700;margin-top:4px">Total Reports</div>
            <small style="color:var(--text-muted)">Filed by you</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--warning)">${pending}</span>
            <div style="font-weight:700;margin-top:4px">Pending</div>
            <small style="color:var(--warning)">Awaiting review</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--primary)">${inProg}</span>
            <div style="font-weight:700;margin-top:4px">In Progress</div>
            <small style="color:var(--primary)">Crews assigned</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--success)">${resolved}</span>
            <div style="font-weight:700;margin-top:4px">Resolved</div>
            <small style="color:var(--success)">Successfully fixed</small>
          </div>
        </div>

        <!-- Quick Actions Row -->
        <div class="glass-static" style="margin-bottom:var(--space-xl);padding:var(--space-md)">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
            <span style="font-weight:700;font-size:var(--fs-sm)">Citizen Quick Actions:</span>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <a class="btn btn-sm" href="#/report">📢 Report an Issue</a>
              <a class="btn btn-sm btn-outline" href="#/track">📋 Track Reports</a>
              <a class="btn btn-sm btn-outline" href="#/services">🏥 Find Services</a>
              <a class="btn btn-sm btn-outline" href="#/updates">🔔 View City Updates</a>
            </div>
          </div>
        </div>

        <!-- Two-Column Layout: Recent Reports & City Overview -->
        <div class="grid-2">
          <!-- Recent Reports List -->
          <div class="glass-static">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
              <h3 style="margin:0">My Recent Reports</h3>
              <a href="#/track" style="font-size:var(--fs-xs);font-weight:600;color:var(--primary)">View Full History →</a>
            </div>
            <div id="user-reports-list" style="display:flex;flex-direction:column;gap:10px">
              ${userReports.length === 0 ? `
                <div style="text-align:center;padding:40px 10px;color:var(--text-muted)">
                  <div style="font-size:2rem;margin-bottom:8px">📝</div>
                  <p>You haven't reported any civic issues yet.</p>
                  <a class="btn btn-sm" href="#/report">Submit Your First Report</a>
                </div>
              ` : userReports.map(r => `
                <div class="glass" style="padding:14px;cursor:pointer" onclick="window.location.hash='#/track?id=${r.id}'">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start">
                    <div>
                      <div style="font-weight:700;font-size:var(--fs-sm);color:var(--text-primary)">${r.title}</div>
                      <div style="font-size:11px;color:var(--text-muted);margin:3px 0">
                        <b>${r.category}</b> · ${r.location} · ${r.timeline[0]?.date || 'Recent'}
                      </div>
                      <div style="font-size:11px;color:var(--primary);font-weight:600">ID: ${r.id}</div>
                    </div>
                    <span class="badge-${r.status === 'Resolved' ? 'low' : r.status === 'In Progress' ? 'medium' : 'high'}">${r.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- City Overview Widget -->
          <div class="glass-static">
            <h3 style="margin:0 0 var(--space-md)">Municipal Overview</h3>
            <div class="grid-2" style="gap:10px;margin-bottom:var(--space-md)">
              <div class="glass" style="padding:12px;text-align:center">
                <span class="stats-bar__value" style="font-size:1.6rem;color:var(--warning)">${allReports.filter(r => r.status !== 'Resolved').length}</span>
                <div style="font-size:11px;font-weight:700">Active City Issues</div>
              </div>
              <div class="glass" style="padding:12px;text-align:center">
                <span class="stats-bar__value" style="font-size:1.6rem;color:var(--success)">${allReports.filter(r => r.status === 'Resolved').length}</span>
                <div style="font-size:11px;font-weight:700">City Issues Resolved</div>
              </div>
            </div>

            <div style="margin-top:var(--space-md)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span style="font-weight:700;font-size:var(--fs-xs);text-transform:uppercase;color:var(--text-muted)">Live City Advisories</span>
                <a href="#/updates" style="font-size:var(--fs-xs);color:var(--primary)">All Alerts →</a>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px">
                ${announcements.slice(0, 2).map(a => `
                  <div class="glass" style="padding:10px;display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <div style="font-weight:700;font-size:12px">${a.title}</div>
                      <div style="font-size:10px;color:var(--text-muted)">${a.location} · ${a.source}</div>
                    </div>
                    <span class="badge-${a.priority.toLowerCase()}">${a.priority}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-top:var(--space-md)">
              <span style="font-weight:700;font-size:var(--fs-xs);text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">Nearby Fast Services</span>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <a href="#/services?cat=hospitals" class="chip">🏥 Hospital (0.6 km)</a>
                <a href="#/services?cat=police%20stations" class="chip">🛡️ Police (0.9 km)</a>
                <a href="#/services?cat=bus%20stops" class="chip">🚌 Transit (1.0 km)</a>
                <a href="#/waste" class="chip">♻️ Waste Depot (0.4 km)</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

// ─────────────────────────────────────────────────────────────
// 3. REPORT CIVIC ISSUE PAGE
// ─────────────────────────────────────────────────────────────
pages.report = function(ct) {
  const user = Store.currentUser;
  let attachedImageBase64 = '';

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper" style="max-width:880px">
        <div class="section-header reveal">
          <h2>Report a Civic Issue</h2>
          <p class="section-subtitle">
            Submit municipal complaints directly to city authorities. Your report receives an immediate Complaint ID.
          </p>
        </div>

        <form class="glass-static" id="main-report-form" novalidate>
          <!-- Issue Title -->
          <div style="margin-bottom:var(--space-md)">
            <label for="rep-title" style="font-weight:700;font-size:var(--fs-sm);display:block;margin-bottom:6px">
              Issue Title <span style="color:var(--danger)">*</span>
            </label>
            <input id="rep-title" placeholder="e.g. Deep pothole causing heavy traffic slowdown" required style="width:100%">
            <div class="error-msg" id="err-rep-title" style="color:var(--danger);font-size:11px;margin-top:3px"></div>
          </div>

          <!-- Category Selection (All 11 Categories) -->
          <div style="margin-bottom:var(--space-md)">
            <label for="rep-category" style="font-weight:700;font-size:var(--fs-sm);display:block;margin-bottom:6px">
              Issue Category <span style="color:var(--danger)">*</span>
            </label>
            <select id="rep-category" required style="width:100%">
              <option value="">Select a civic category</option>
              <option value="Road Damage">🛣️ Road Damage (Potholes, Cracks, Speedbreakers)</option>
              <option value="Streetlight">💡 Streetlight (Outage, Dim, Damaged Pole)</option>
              <option value="Garbage/Waste">🗑️ Garbage / Waste (Overflowing bin, Littering)</option>
              <option value="Water Supply">💧 Water Supply (Pipe burst, Low pressure, Contamination)</option>
              <option value="Drainage">🕳️ Drainage & Sewage (Clogged manhole, Open drain)</option>
              <option value="Traffic">🚦 Traffic & Signals (Signal failure, Congestion)</option>
              <option value="Public Transport">🚌 Public Transport (Bus stop shelter, Schedule)</option>
              <option value="Electricity">⚡ Electricity (Transformer spark, Hanging wires)</option>
              <option value="Parks">🌳 Parks & Playgrounds (Broken equipment, Maintenance)</option>
              <option value="Public Safety">🛡️ Public Safety (Vandalism, Stray animals, Hazard)</option>
              <option value="Other">📌 Other Civic Grievance</option>
            </select>
            <div class="error-msg" id="err-rep-category" style="color:var(--danger);font-size:11px;margin-top:3px"></div>
          </div>

          <!-- Description -->
          <div style="margin-bottom:var(--space-md)">
            <label for="rep-desc" style="font-weight:700;font-size:var(--fs-sm);display:block;margin-bottom:6px">
              Description <span style="color:var(--danger)">*</span>
            </label>
            <textarea id="rep-desc" rows="4" placeholder="Provide accurate details, physical landmarks, and specific hazards..." required style="width:100%"></textarea>
            <div class="error-msg" id="err-rep-desc" style="color:var(--danger);font-size:11px;margin-top:3px"></div>
          </div>

          <!-- Location Selector & GPS Button -->
          <div style="margin-bottom:var(--space-md)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <label for="rep-location" style="font-weight:700;font-size:var(--fs-sm);margin:0">
                Location (Street / Ward / Zone) <span style="color:var(--danger)">*</span>
              </label>
              <button type="button" class="btn btn-sm btn-outline" id="btn-use-location" style="font-size:11px;padding:4px 10px">
                📍 Use My Location
              </button>
            </div>
            <input id="rep-location" placeholder="e.g. 4th Cross Road, Lake View Promenade, Zone 2" required style="width:100%">
            <div id="gps-feedback" style="font-size:11px;color:var(--primary);margin-top:4px"></div>
            <div class="error-msg" id="err-rep-location" style="color:var(--danger);font-size:11px;margin-top:3px"></div>

            <!-- Coordinate / Zone Picker Map Visual -->
            <div class="glass" style="margin-top:8px;padding:12px;background:var(--surface-inner)">
              <div style="display:flex;justify-content:space-between;align-items:center;font-size:var(--fs-xs)">
                <span>Interactive Zone Selector:</span>
                <span id="selected-coords-text" style="color:var(--text-muted)">Lat: 13.0827, Lng: 80.2707</span>
              </div>
              <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
                <button type="button" class="chip active-zone-chip" data-zone="Zone 1 – Central (City Center)">Zone 1 – Central</button>
                <button type="button" class="chip" data-zone="Zone 2 – Riverside (Ward 14 & 15)">Zone 2 – Riverside</button>
                <button type="button" class="chip" data-zone="Zone 3 – Tech Park Corridor">Zone 3 – Tech Park</button>
                <button type="button" class="chip" data-zone="Zone 4 – Old Town Market">Zone 4 – Old Town</button>
              </div>
            </div>
          </div>

          <!-- Image Upload & Preview -->
          <div style="margin-bottom:var(--space-md)">
            <label for="rep-image" style="font-weight:700;font-size:var(--fs-sm);display:block;margin-bottom:6px">
              Upload Incident Image (Optional)
            </label>
            <div class="glass" style="border:2px dashed var(--border);text-align:center;padding:20px;cursor:pointer" id="drop-zone">
              <input type="file" id="rep-image-file" accept="image/*" style="display:none">
              <div id="drop-zone-prompt">
                <div style="font-size:1.8rem;margin-bottom:6px">📷</div>
                <div style="font-weight:600;font-size:var(--fs-sm)">Click to upload or drag & drop photo</div>
                <small style="color:var(--text-muted)">JPG, PNG or WebP up to 5MB</small>
              </div>
              <div id="image-preview-container" style="display:none;margin-top:10px">
                <img id="image-preview" src="" alt="Preview" style="max-height:160px;border-radius:var(--radius-md);box-shadow:var(--shadow-sm)">
                <div>
                  <button type="button" class="chip" id="btn-remove-photo" style="margin-top:8px;color:var(--danger)">✕ Remove Photo</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Date & Optional Contact -->
          <div class="grid-2" style="gap:var(--space-md);margin-bottom:var(--space-lg)">
            <div>
              <label for="rep-date" style="font-weight:700;font-size:var(--fs-sm);display:block;margin-bottom:6px">Date of Incident</label>
              <input type="date" id="rep-date" style="width:100%" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div>
              <label for="rep-contact" style="font-weight:700;font-size:var(--fs-sm);display:block;margin-bottom:6px">Optional Contact Email/Phone</label>
              <input id="rep-contact" placeholder="Email or 10-digit mobile" style="width:100%" value="${user ? user.email : ''}">
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-lg" id="btn-submit-report" style="width:100%;color:#fff">
            <span>🚀</span> Submit Complaint & Get Report ID
          </button>
        </form>

        <!-- Confirmation Modal / Card (Populated after submission) -->
        <dialog id="report-confirm-dialog" style="max-width:540px;width:92%;padding:0;border-radius:var(--radius-xl);overflow:hidden">
          <div style="background:var(--grad-primary);color:#fff;padding:24px 20px;text-align:center">
            <div style="font-size:2.4rem;margin-bottom:6px">✅</div>
            <h3 style="margin:0;color:#fff">Complaint Successfully Registered!</h3>
            <p style="margin:6px 0 0;opacity:0.9;font-size:var(--fs-sm)">Your report has been logged with the municipal intake system.</p>
          </div>
          <div style="padding:24px 20px;background:var(--surface)">
            <div class="glass" style="margin-bottom:16px;text-align:center">
              <div style="font-size:var(--fs-xs);color:var(--text-muted);text-transform:uppercase;font-weight:700">Complaint Reference ID</div>
              <div style="font-size:1.6rem;font-weight:900;color:var(--primary);margin:6px 0" id="modal-report-id">CC-2026-XXXX</div>
              <button class="chip" id="btn-copy-id">📋 Copy Tracking ID</button>
            </div>
            <div style="font-size:var(--fs-sm);color:var(--text-muted);margin-bottom:20px;line-height:1.5">
              • Notification has been added to your citizen notifications.<br>
              • Dedicated municipal engineers will review and verify your grievance.<br>
              • You can monitor live departmental progress anytime on the tracker.
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end">
              <button class="btn btn-sm btn-outline" id="btn-confirm-close">Close</button>
              <button class="btn btn-sm" id="btn-confirm-track" style="color:#fff">Track Status Now →</button>
            </div>
          </div>
        </dialog>
      </div>
    </section>
  `;

  // Zone pills handler
  $$('.active-zone-chip, [data-zone]').forEach(chip => {
    chip.onclick = () => {
      $$('[data-zone]').forEach(c => c.classList.remove('active-zone-chip', 'active'));
      chip.classList.add('active');
      $('#rep-location').value = chip.dataset.zone;
      Sound.play('click');
    };
  });

  // "Use My Location" Geolocation Handler
  $('#btn-use-location').onclick = () => {
    const feedback = $('#gps-feedback');
    feedback.textContent = 'Requesting browser location…';
    if (!navigator.geolocation) {
      feedback.textContent = 'Geolocation not supported by your browser. Please enter location manually.';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        feedback.innerHTML = `📍 GPS Lock: <b>${lat.toFixed(4)}, ${lng.toFixed(4)}</b> (Accuracy: ±${Math.round(pos.coords.accuracy)}m)`;
        $('#selected-coords-text').textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        if (!$('#rep-location').value) {
          $('#rep-location').value = `Zone 2 – Riverside (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`;
        }
        Sound.play('success');
      },
      err => {
        feedback.innerHTML = `<span style="color:var(--warning)">⚠️ Location permission denied or unavailable. Please enter your location manually.</span>`;
      },
      { timeout: 8000 }
    );
  };

  // Image Upload Handling
  const fileInp = $('#rep-image-file');
  const dropZone = $('#drop-zone');
  const preview = $('#image-preview');
  const previewWrap = $('#image-preview-container');
  const prompt = $('#drop-zone-prompt');

  dropZone.onclick = e => {
    if (e.target.id !== 'btn-remove-photo') fileInp.click();
  };

  fileInp.onchange = () => {
    const file = fileInp.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      attachedImageBase64 = ev.target.result;
      preview.src = attachedImageBase64;
      previewWrap.style.display = 'block';
      prompt.style.display = 'none';
      Sound.play('click');
    };
    reader.readAsDataURL(file);
  };

  $('#btn-remove-photo').onclick = e => {
    e.stopPropagation();
    attachedImageBase64 = '';
    fileInp.value = '';
    previewWrap.style.display = 'none';
    prompt.style.display = 'block';
  };

  // Form Submission
  $('#main-report-form').onsubmit = e => {
    e.preventDefault();
    const title = $('#rep-title').value.trim();
    const category = $('#rep-category').value;
    const desc = $('#rep-desc').value.trim();
    const loc = $('#rep-location').value.trim();
    const date = $('#rep-date').value;
    const contact = $('#rep-contact').value.trim();

    let valid = true;
    if (!title) { $('#err-rep-title').textContent = 'Please enter an issue title.'; valid = false; } else $('#err-rep-title').textContent = '';
    if (!category) { $('#err-rep-category').textContent = 'Please choose a category.'; valid = false; } else $('#err-rep-category').textContent = '';
    if (!desc) { $('#err-rep-desc').textContent = 'Please provide a description.'; valid = false; } else $('#err-rep-desc').textContent = '';
    if (!loc) { $('#err-rep-location').textContent = 'Please specify a location or ward.'; valid = false; } else $('#err-rep-location').textContent = '';

    if (!valid) {
      toast('error', 'Incomplete Form', 'Please fill in all mandatory fields marked with *');
      return;
    }

    const submitBtn = $('#btn-submit-report');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳</span> Transmitting to Municipal Queue…';

    setTimeout(() => {
      const created = CivicDB.createReport({
        title,
        category,
        description: desc,
        location: loc,
        contact,
        image: attachedImageBase64
      });

      Sound.play('award');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>🚀</span> Submit Complaint & Get Report ID';

      // Open Confirmation Modal
      $('#modal-report-id').textContent = created.id;
      const modal = $('#report-confirm-dialog');
      modal.showModal();

      $('#btn-copy-id').onclick = () => {
        navigator.clipboard.writeText(created.id);
        toast('info', 'ID Copied', `Tracking ID ${created.id} copied to clipboard.`);
      };

      $('#btn-confirm-close').onclick = () => {
        modal.close();
        window.location.hash = '#/dashboard';
      };

      $('#btn-confirm-track').onclick = () => {
        modal.close();
        window.location.hash = `#/track?id=${created.id}`;
      };
    }, 600);
  };
};

// ─────────────────────────────────────────────────────────────
// 4. COMPLAINT TRACKING PAGE
// ─────────────────────────────────────────────────────────────
pages.track = function(ct) {
  const user = Store.currentUser;
  const userReports = user ? CivicDB.getReports(user.id) : [];

  // Parse query parameter ?id=
  const urlHash = window.location.hash;
  const matchId = urlHash.match(/[?&]id=([^&]+)/);
  const initialId = matchId ? decodeURIComponent(matchId[1]) : '';

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper" style="max-width:920px">
        <div class="section-header reveal">
          <h2>Track Complaint Status</h2>
          <p class="section-subtitle">Real-time municipal grievance telemetry and verified department updates</p>
        </div>

        <!-- Search Box -->
        <div class="glass-static" style="margin-bottom:var(--space-xl)">
          <div style="font-weight:700;font-size:var(--fs-sm);margin-bottom:8px">Search by Complaint ID, Email, or Phone</div>
          <div class="input-row">
            <input id="search-track-input" placeholder="e.g. CC-2026-4821 or priya.sharma@example.com" value="${initialId}">
            <button class="btn" id="btn-do-track"><span>🔍</span> Track</button>
          </div>
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
            <span style="font-size:11px;color:var(--text-muted)">Quick Test Tickets:</span>
            <button class="chip" onclick="$('#search-track-input').value='CC-2026-4821'; $('#btn-do-track').click()">CC-2026-4821 (In Progress)</button>
            <button class="chip" onclick="$('#search-track-input').value='CC-2026-4819'; $('#btn-do-track').click()">CC-2026-4819 (Resolved)</button>
            <button class="chip" onclick="$('#search-track-input').value='CC-2026-4805'; $('#btn-do-track').click()">CC-2026-4805 (Assigned)</button>
          </div>
        </div>

        <!-- Results Display Area -->
        <div id="track-result-container"></div>

        <!-- Citizen Complaint History Table -->
        <div class="glass-static" style="margin-top:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
            <h3 style="margin:0">My Complaint History</h3>
            <span style="font-size:var(--fs-xs);color:var(--text-muted)">${userReports.length} records</span>
          </div>

          ${userReports.length === 0 ? `
            <p style="color:var(--text-muted);font-size:var(--fs-sm)">No complaint records found under your account. Use the search bar above or submit a new report.</p>
          ` : `
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Issue Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${userReports.map(r => `
                    <tr>
                      <td><b style="color:var(--primary)">${r.id}</b></td>
                      <td style="font-weight:600">${r.title}</td>
                      <td>${r.category}</td>
                      <td>${r.location}</td>
                      <td style="font-size:11px;color:var(--text-muted)">${r.timeline[0]?.date || 'Recent'}</td>
                      <td><span class="badge-${r.status === 'Resolved' ? 'low' : r.status === 'In Progress' ? 'medium' : 'high'}">${r.status}</span></td>
                      <td>
                        <button class="btn btn-sm btn-outline" style="padding:4px 8px;font-size:11px" onclick="$('#search-track-input').value='${r.id}'; $('#btn-do-track').click()">
                          View Timeline
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    </section>
  `;

  function doTrack(query) {
    const q = (query || $('#search-track-input').value).trim();
    const res = $('#track-result-container');
    if (!q) {
      res.innerHTML = `<div class="glass" style="text-align:center;padding:24px;color:var(--text-muted)">Please enter a Complaint ID (e.g. CC-2026-4821) or contact info to search.</div>`;
      return;
    }

    // Try finding by ID
    let rep = CivicDB.getReportById(q);
    if (!rep) {
      const byContact = CivicDB.getReportsByContact(q);
      if (byContact.length > 0) rep = byContact[0];
    }

    if (!rep) {
      res.innerHTML = `
        <div class="glass" style="text-align:center;padding:32px;color:var(--text-muted)">
          <div style="font-size:2rem;margin-bottom:8px">🔍</div>
          <h4>No Ticket Found for "${q}"</h4>
          <p style="font-size:var(--fs-sm)">Please double-check the Complaint ID or make sure you are searching with the registered email or mobile number.</p>
        </div>
      `;
      return;
    }

    Sound.play('success');

    // 5 Stages: Reported -> Under Review -> Assigned -> In Progress -> Resolved
    const STAGES = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
    const curIdx = STAGES.indexOf(rep.status);
    const progressPct = curIdx >= 0 ? (curIdx / (STAGES.length - 1)) * 100 : 20;

    res.innerHTML = `
      <div class="glass-static" style="animation:fadeIn 0.3s ease">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;border-bottom:1px solid var(--border);padding-bottom:14px;margin-bottom:16px">
          <div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);font-weight:700">COMPLAINT DOSSIER</div>
            <h3 style="margin:4px 0">${rep.title}</h3>
            <div style="font-size:var(--fs-sm);color:var(--text-muted)">
              ID: <b style="color:var(--primary)">${rep.id}</b> · Category: <b>${rep.category}</b> · Priority: <span class="badge-${rep.priority?.toLowerCase() || 'medium'}">${rep.priority || 'Medium'}</span>
            </div>
            <div style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:2px">
              📍 Location: <b>${rep.location}</b> · Department: <b>${rep.department || 'Municipal Intake'}</b>
            </div>
          </div>
          <span class="badge-${rep.status === 'Resolved' ? 'low' : rep.status === 'In Progress' ? 'medium' : 'high'}" style="font-size:13px;padding:6px 14px">
            ${rep.status}
          </span>
        </div>

        <p style="font-size:var(--fs-sm);color:var(--text-secondary);margin-bottom:var(--space-lg);background:var(--surface-inner);padding:12px;border-radius:var(--radius-md)">
          <b>Description:</b> ${rep.description}
        </p>

        <!-- 5-Step Interactive Timeline -->
        <div class="track-timeline">
          <div class="track-timeline__progress" style="width:${progressPct}%"></div>
          ${STAGES.map((st, i) => {
            const isCompleted = i <= curIdx;
            const isActive = i === curIdx;
            const matchingTL = rep.timeline.find(t => t.stage.toLowerCase() === st.toLowerCase());
            return `
              <div class="track-step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <div class="track-step-circle">${isCompleted ? '✓' : (i + 1)}</div>
                <div>
                  <div class="track-step-title">${st}</div>
                  <div class="track-step-date">${matchingTL ? matchingTL.date.split(',')[0] : 'Pending'}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Full Audit Notes Log -->
        <h4 style="margin:var(--space-lg) 0 8px">Verified Department Activity Log</h4>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${rep.timeline.map(item => `
            <div class="glass" style="padding:10px 14px;display:flex;justify-content:space-between;align-items:flex-start;background:var(--surface-inner)">
              <div>
                <div style="font-weight:700;font-size:var(--fs-sm)">${item.stage} · <span style="color:var(--primary)">${item.dept || rep.department}</span></div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${item.notes || 'Status verified.'}</div>
              </div>
              <span style="font-size:10px;color:var(--text-muted);white-space:nowrap">${item.date}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  $('#btn-do-track').onclick = () => doTrack();
  $('#search-track-input').onkeydown = e => { if (e.key === 'Enter') doTrack(); };

  if (initialId) doTrack(initialId);
};

// ─────────────────────────────────────────────────────────────
// 5. NEARBY CITY SERVICES PAGE
// ─────────────────────────────────────────────────────────────
pages.services = function(ct) {
  const db = Store.data;
  let activeCategory = 'all';
  let viewMode = 'list'; // 'list' or 'map'

  const CATEGORIES = [
    'All', 'Hospitals', 'Clinics', 'Pharmacies', 'Police Stations', 
    'Fire Stations', 'Government Offices', 'Public Toilets', 
    'Bus Stops', 'Railway Stations', 'Parking', 'ATMs', 'Waste Collection Points'
  ];

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>Nearby City Services</h2>
          <p class="section-subtitle">Find hospitals, clinics, police, transit, and public amenities across all wards</p>
        </div>

        <!-- Search & Filter Controls -->
        <div class="glass-static" style="margin-bottom:var(--space-lg)">
          <div class="grid-2" style="gap:var(--space-md);margin-bottom:var(--space-md)">
            <div class="input-row">
              <input id="srv-search-input" placeholder="Search facilities, services, or locations...">
              <button class="btn btn-sm" id="btn-srv-search">Search</button>
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;align-items:center">
              <button class="btn btn-sm btn-outline" id="btn-srv-locate">📍 Use My Location</button>
              <div style="display:flex;border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden">
                <button class="btn btn-sm ${viewMode === 'list' ? '' : 'btn-outline'}" id="btn-view-list" style="border-radius:0">List</button>
                <button class="btn btn-sm ${viewMode === 'map' ? '' : 'btn-outline'}" id="btn-view-map" style="border-radius:0">Map</button>
              </div>
            </div>
          </div>
          <div id="srv-gps-info" style="font-size:11px;color:var(--primary);margin-bottom:8px"></div>

          <!-- Category Pills -->
          <div class="chips-container" id="srv-category-chips" style="overflow-x:auto;padding-bottom:4px">
            ${CATEGORIES.map(c => `
              <button class="chip ${c.toLowerCase() === activeCategory ? 'active' : ''}" data-cat="${c}">
                ${c}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Content Area: List or Map -->
        <div id="srv-content-area"></div>
      </div>
    </section>
  `;

  function renderList(filtered) {
    const area = $('#srv-content-area');
    if (!area) return;

    if (viewMode === 'map') {
      area.innerHTML = `
        <div class="glass-static" style="text-align:center;padding:40px 20px">
          <div style="font-size:3rem;margin-bottom:10px">🗺️</div>
          <h3>Interactive Services Map View</h3>
          <p style="color:var(--text-muted);font-size:var(--fs-sm);margin-bottom:20px">
            Explore ${filtered.length} public amenities pinned on the high-definition smart sensor map.
          </p>
          <a class="btn btn-lg" href="#/map">Open Full-Screen Interactive City Map →</a>
        </div>
      `;
      return;
    }

    if (filtered.length === 0) {
      area.innerHTML = `<div class="glass" style="text-align:center;padding:40px;color:var(--text-muted)">No public services match your search or filter.</div>`;
      return;
    }

    area.innerHTML = `
      <div class="grid-3 stagger-in">
        ${filtered.map(s => `
          <div class="glass" style="display:flex;flex-direction:column;justify-content:space-between">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
                <span class="badge-medium">${s.category}</span>
                <span class="badge-low">${s.distance}</span>
              </div>
              <h3 style="margin:0 0 6px;font-size:var(--fs-md)">${s.name}</h3>
              <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 8px">📍 ${s.address}</p>
              <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">
                🕒 <b>Hours:</b> ${s.hours}
              </div>
              <div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">
                📞 <b>Contact:</b> <a href="tel:${s.phone.replace(/[^0-9]/g, '')}" style="color:var(--primary);font-weight:600">${s.phone}</a>
              </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button class="btn btn-sm btn-outline" style="flex:1" onclick="alert('Directions to ${s.name}:\\n${s.address}\\nEstimated driving time: 4 mins (0.6 km).')">
                🗺️ Directions
              </button>
              ${s.emergency ? `
                <a class="btn btn-sm" href="tel:${s.phone.split('/')[0].trim()}" style="background:var(--danger);color:#fff">
                  🚨 Call
                </a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function applyFilters() {
    const q = ($('#srv-search-input')?.value || '').trim().toLowerCase();
    let services = db.services || [];
    if (activeCategory !== 'all') {
      services = services.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (q) {
      services = services.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) || 
        s.address.toLowerCase().includes(q)
      );
    }
    renderList(services);
  }

  // Event handlers
  $('#srv-category-chips').onclick = e => {
    const chip = e.target.closest('[data-cat]');
    if (!chip) return;
    $$('#srv-category-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeCategory = chip.dataset.cat.toLowerCase();
    Sound.play('click');
    applyFilters();
  };

  $('#btn-view-list').onclick = () => {
    viewMode = 'list';
    $('#btn-view-list').classList.remove('btn-outline');
    $('#btn-view-map').classList.add('btn-outline');
    applyFilters();
  };

  $('#btn-view-map').onclick = () => {
    viewMode = 'map';
    $('#btn-view-map').classList.remove('btn-outline');
    $('#btn-view-list').classList.add('btn-outline');
    applyFilters();
  };

  $('#btn-srv-search').onclick = applyFilters;
  $('#srv-search-input').oninput = applyFilters;

  $('#btn-srv-locate').onclick = () => {
    const info = $('#srv-gps-info');
    info.textContent = 'Acquiring GPS location…';
    if (!navigator.geolocation) {
      info.textContent = 'Geolocation not supported. Showing default city center distances.';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      p => {
        info.innerHTML = `📍 Location locked: <b>${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}</b>. Distances calibrated.`;
        Sound.play('success');
      },
      () => {
        info.innerHTML = `<span style="color:var(--warning)">⚠️ Location permission denied. Distances shown from City Center.</span>`;
      }
    );
  };

  applyFilters();
};

// ─────────────────────────────────────────────────────────────
// 6. CITY ALERTS & ANNOUNCEMENTS PAGE
// ─────────────────────────────────────────────────────────────
pages.updates = function(ct) {
  let activeFilter = 'All';
  const FILTERS = ['All', 'Traffic', 'Water', 'Electricity', 'Public Safety', 'Events'];

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>City Alerts & Announcements</h2>
          <p class="section-subtitle">Real-time public advisories, maintenance notices, and municipal broadcasts</p>
        </div>

        <!-- Filter Chips -->
        <div class="chips-container" id="updates-filter-chips" style="margin-bottom:var(--space-lg);justify-content:center">
          ${FILTERS.map(f => `
            <button class="chip ${f === activeFilter ? 'active' : ''}" data-filter="${f}">
              ${f}
            </button>
          `).join('')}
        </div>

        <div id="updates-cards-grid" class="grid-3 stagger-in"></div>
      </div>
    </section>
  `;

  function renderCards() {
    const announcements = CivicDB.getAnnouncements(activeFilter);
    const grid = $('#updates-cards-grid');
    if (!grid) return;

    if (announcements.length === 0) {
      grid.innerHTML = `<div class="glass" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">No active advisories in this category.</div>`;
      return;
    }

    grid.innerHTML = announcements.map(a => `
      <div class="glass" style="display:flex;flex-direction:column;justify-content:space-between">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span class="badge-medium">${a.category}</span>
            <span class="badge-${a.priority.toLowerCase()}">${a.priority} Priority</span>
          </div>
          <h3 style="margin:0 0 8px;font-size:var(--fs-md)">${a.title}</h3>
          <p style="font-size:var(--fs-xs);color:var(--text-secondary);margin:0 0 12px;line-height:1.5">${a.description}</p>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:8px;font-size:11px;color:var(--text-muted)">
          <div>📍 <b>Location:</b> ${a.location}</div>
          <div>🏛️ <b>Authority:</b> ${a.source}</div>
          <div>📅 <b>Published:</b> ${a.date}</div>
        </div>
      </div>
    `).join('');
  }

  $('#updates-filter-chips').onclick = e => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    $$('#updates-filter-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    Sound.play('click');
    renderCards();
  };

  renderCards();
};

// ─────────────────────────────────────────────────────────────
// 7. EMERGENCY ASSISTANCE PAGE
// ─────────────────────────────────────────────────────────────
pages.emergency = function(ct) {
  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper" style="max-width:980px">
        <!-- Verification Advisory Banner -->
        <div class="glass-static" style="border-left:4px solid var(--danger);margin-bottom:var(--space-xl);background:rgba(229,72,77,0.08)">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:1.8rem">⚠️</span>
            <div>
              <h4 style="margin:0;color:var(--danger)">Official Emergency Advisory</h4>
              <p style="margin:2px 0 0;font-size:var(--fs-xs);color:var(--text-secondary)">
                In critical, life-threatening scenarios, call 100 or 108 immediately. Always follow verified local municipal control instructions.
              </p>
            </div>
          </div>
        </div>

        <div class="section-header reveal">
          <h2>Emergency Response Dispatch</h2>
          <p class="section-subtitle">Instant one-tap helpline dialers, facility locator, and life-safety guidance</p>
        </div>

        <!-- 4 Primary Emergency Services Grid -->
        <div class="grid-4 stagger-in" style="margin-bottom:var(--space-xl)">
          <!-- Police -->
          <div class="glass" style="text-align:center;border-color:rgba(29,111,232,0.3)">
            <div class="icon-circle" style="background:rgba(29,111,232,0.15);color:var(--primary);margin:0 auto var(--space-md)">🛡️</div>
            <h3 style="margin:0 0 4px">Police</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 12px">Crime, Law & Order, Public Safety</p>
            <a class="btn" href="tel:100" style="width:100%;color:#fff;background:var(--primary)">Call 100</a>
          </div>

          <!-- Ambulance -->
          <div class="glass" style="text-align:center;border-color:rgba(229,72,77,0.3)">
            <div class="icon-circle" style="background:rgba(229,72,77,0.15);color:var(--danger);margin:0 auto var(--space-md)">🚑</div>
            <h3 style="margin:0 0 4px">Ambulance</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 12px">Medical Trauma & Cardiac Emergency</p>
            <a class="btn" href="tel:108" style="width:100%;color:#fff;background:var(--danger)">Call 108</a>
          </div>

          <!-- Fire & Rescue -->
          <div class="glass" style="text-align:center;border-color:rgba(245,165,36,0.3)">
            <div class="icon-circle" style="background:rgba(245,165,36,0.15);color:var(--warning);margin:0 auto var(--space-md)">🔥</div>
            <h3 style="margin:0 0 4px">Fire & Rescue</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 12px">Fire Hazard, Gas Leak, Collapse</p>
            <a class="btn" href="tel:101" style="width:100%;color:#fff;background:var(--warning)">Call 101</a>
          </div>

          <!-- Disaster Management -->
          <div class="glass" style="text-align:center;border-color:rgba(18,184,208,0.3)">
            <div class="icon-circle" style="background:rgba(18,184,208,0.15);color:var(--accent);margin:0 auto var(--space-md)">🌊</div>
            <h3 style="margin:0 0 4px">Disaster Mgmt</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 12px">Flood, Cyclone & Inundation</p>
            <a class="btn" href="tel:1070" style="width:100%;color:#fff;background:var(--accent)">Call 1070</a>
          </div>
        </div>

        <!-- Location Telemetry & Nearest Centers -->
        <div class="grid-2" style="margin-bottom:var(--space-xl)">
          <div class="glass-static">
            <h3 style="margin:0 0 10px">Your Geo-Location Status</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 12px">
              Share coordinates with first responders so emergency dispatchers can pinpoint your position.
            </p>
            <button class="btn btn-sm" id="btn-emergency-loc" style="width:100%;color:#fff">📍 Detect & Broadcast Location</button>
            <div id="emergency-loc-status" style="margin-top:10px;font-size:12px;color:var(--primary)"></div>
          </div>

          <div class="glass-static">
            <h3 style="margin:0 0 10px">Closest Emergency Care Facilities</h3>
            <div style="display:flex;flex-direction:column;gap:8px">
              <div class="glass" style="padding:10px;display:flex;justify-content:space-between;align-items:center">
                <div>
                  <div style="font-weight:700;font-size:12px">Apollo City Multispecialty Hospital</div>
                  <div style="font-size:10px;color:var(--text-muted)">21 Greams Lane · 24/7 Trauma Wing</div>
                </div>
                <span class="badge-emergency">0.6 km</span>
              </div>
              <div class="glass" style="padding:10px;display:flex;justify-content:space-between;align-items:center">
                <div>
                  <div style="font-weight:700;font-size:12px">City Central Police Station</div>
                  <div style="font-size:10px;color:var(--text-muted)">Police Line Rd · Rapid Patrol Unit</div>
                </div>
                <span class="badge-medium">0.9 km</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Emergency Guidance Checklist Accordion -->
        <div class="glass-static">
          <h3 style="margin:0 0 var(--space-md)">Life Safety & First Aid Protocol</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            <details class="glass" style="padding:12px;border-radius:var(--radius-md)">
              <summary style="font-weight:700;cursor:pointer">🫀 CPR (Cardiopulmonary Resuscitation) Basics</summary>
              <div style="font-size:var(--fs-xs);color:var(--text-secondary);margin-top:8px;line-height:1.6">
                1. Check responsiveness and call 108.<br>
                2. Place heel of hand in center of chest.<br>
                3. Push hard and fast at 100–120 beats per minute (to the beat of 'Stayin Alive').<br>
                4. Continue until professional emergency medical personnel arrive.
              </div>
            </details>
            <details class="glass" style="padding:12px;border-radius:var(--radius-md)">
              <summary style="font-weight:700;cursor:pointer">🔥 Fire Evacuation Drill</summary>
              <div style="font-size:var(--fs-xs);color:var(--text-secondary);margin-top:8px;line-height:1.6">
                1. Sound fire alarm and dial 101.<br>
                2. Feel doors before opening; if hot, do not open.<br>
                3. Stay low to the ground beneath smoke.<br>
                4. Use fire exit stairs, NEVER use elevators.
              </div>
            </details>
            <details class="glass" style="padding:12px;border-radius:var(--radius-md)">
              <summary style="font-weight:700;cursor:pointer">🌊 Urban Flood & Storm Precautions</summary>
              <div style="font-size:var(--fs-xs);color:var(--text-secondary);margin-top:8px;line-height:1.6">
                1. Disconnect main electrical breakers before flood waters rise.<br>
                2. Do not attempt to walk or drive across flooded bridges or culverts.<br>
                3. Boil drinking water or use municipal emergency water tankers.
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  `;

  $('#btn-emergency-loc').onclick = () => {
    const el = $('#emergency-loc-status');
    el.textContent = 'Acquiring high-precision GPS telemetry…';
    if (!navigator.geolocation) {
      el.textContent = 'Coordinates: 13.0827° N, 80.2707° E (Central Ward Default)';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      p => {
        el.innerHTML = `✅ Coordinates Ready: <b>${p.coords.latitude.toFixed(5)}° N, ${p.coords.longitude.toFixed(5)}° E</b>. Dispatch link generated.`;
        Sound.play('award');
      },
      () => {
        el.innerHTML = `Coordinates: 13.0827° N, 80.2707° E (Central Ward Default)`;
      }
    );
  };
};

// ─────────────────────────────────────────────────────────────
// 8. WASTE MANAGEMENT PAGE
// ─────────────────────────────────────────────────────────────
pages.waste = function(ct) {
  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>Solid Waste & Recycling Management</h2>
          <p class="section-subtitle">Keep our wards clean through scheduled pickups, smart bin segregation, and rapid reporting</p>
        </div>

        <!-- Quick Report Action Buttons -->
        <div class="glass-static" style="margin-bottom:var(--space-xl);text-align:center;padding:24px">
          <h3 style="margin:0 0 8px">Notice an uncollected bin or illegal dump?</h3>
          <p style="color:var(--text-muted);font-size:var(--fs-sm);margin:0 0 16px">Help our municipal compactor trucks clear the backlog within 4 hours.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a class="btn" href="#/report" style="color:#fff">
              <span>🗑️</span> Report Uncollected Garbage
            </a>
            <button class="btn btn-outline" onclick="window.location.hash='#/report'; setTimeout(()=>{ $('#rep-title').value='Illegal debris dumping'; $('#rep-category').value='Garbage/Waste'; },300)">
              <span>⚠️</span> Report Illegal Dumping
            </button>
          </div>
        </div>

        <!-- Waste Segregation Guide Cards (5 Categories) -->
        <div class="section-header reveal">
          <h2>Segregation at Source Guide</h2>
          <p class="section-subtitle">Categorize household and commercial waste to promote 100% recycling</p>
        </div>
        <div class="grid-4 stagger-in" style="margin-bottom:var(--space-xl)">
          <div class="seg-card seg-card--wet">
            <div style="font-size:2rem;margin-bottom:8px">🍏</div>
            <h4 style="margin:0 0 4px;color:var(--success)">Wet Organic Waste</h4>
            <small style="color:var(--text-muted);display:block;margin-bottom:8px">Green Container</small>
            <p style="font-size:var(--fs-xs);color:var(--text-secondary);margin:0">
              Vegetable peels, leftover food, tea bags, garden leaves, and fruit scraps. Converted into municipal park compost.
            </p>
          </div>

          <div class="seg-card seg-card--dry">
            <div style="font-size:2rem;margin-bottom:8px">📦</div>
            <h4 style="margin:0 0 4px;color:var(--primary)">Dry Recyclable Waste</h4>
            <small style="color:var(--text-muted);display:block;margin-bottom:8px">Blue Container</small>
            <p style="font-size:var(--fs-xs);color:var(--text-secondary);margin:0">
              Cardboard, newspapers, plastic bottles, glass jars, aluminum cans, and milk cartons. Sent to material recovery facilities.
            </p>
          </div>

          <div class="seg-card seg-card--ewaste">
            <div style="font-size:2rem;margin-bottom:8px">🔌</div>
            <h4 style="margin:0 0 4px;color:#d97706">Electronic Waste (E-Waste)</h4>
            <small style="color:var(--text-muted);display:block;margin-bottom:8px">Orange Container</small>
            <p style="font-size:var(--fs-xs);color:var(--text-secondary);margin:0">
              Old mobile phones, chargers, alkaline batteries, computer components, and CFL bulbs. Safe extraction of precious metals.
            </p>
          </div>

          <div class="seg-card seg-card--hazard">
            <div style="font-size:2rem;margin-bottom:8px">☣️</div>
            <h4 style="margin:0 0 4px;color:var(--danger)">Hazardous & Sanitary</h4>
            <small style="color:var(--text-muted);display:block;margin-bottom:8px">Red Container</small>
            <p style="font-size:var(--fs-xs);color:var(--text-secondary);margin:0">
              Bio-medical bandages, expired medicines, paint cans, and chemical cleaners. Incinerated safely in accordance with pollution norms.
            </p>
          </div>
        </div>

        <!-- Weekly Collection Schedule -->
        <div class="glass-static">
          <h3 style="margin:0 0 var(--space-md)">Ward Pickup Timetable</h3>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Zone / Ward</th>
                  <th>Wet Waste (Daily)</th>
                  <th>Dry Recyclables</th>
                  <th>E-Waste & Bulky Furniture</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Zone 1 – Central</b></td>
                  <td><span class="badge-low">06:00 AM – 09:00 AM</span></td>
                  <td>Tue, Thu, Sat</td>
                  <td>1st Saturday of Month</td>
                </tr>
                <tr>
                  <td><b>Zone 2 – Riverside</b></td>
                  <td><span class="badge-low">06:30 AM – 09:30 AM</span></td>
                  <td>Mon, Wed, Fri</td>
                  <td>2nd Saturday of Month</td>
                </tr>
                <tr>
                  <td><b>Zone 3 – Tech Park</b></td>
                  <td><span class="badge-low">07:00 AM – 10:00 AM</span></td>
                  <td>Mon, Wed, Fri, Sun</td>
                  <td>On-Demand via App</td>
                </tr>
                <tr>
                  <td><b>Zone 4 – Old Town</b></td>
                  <td><span class="badge-low">05:30 AM – 08:30 AM</span></td>
                  <td>Tue, Thu, Sat</td>
                  <td>3rd Sunday of Month</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
};

// ─────────────────────────────────────────────────────────────
// 9. PUBLIC TRANSPORT PAGE
// ─────────────────────────────────────────────────────────────
pages.transit = function(ct) {
  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>Public Transport & Mobility Hub</h2>
          <p class="section-subtitle">Real-time bus tracking, metro lines, and green EV feeder services</p>
        </div>

        <!-- Destination Route Search -->
        <div class="glass-static" style="margin-bottom:var(--space-xl)">
          <div class="grid-2" style="gap:var(--space-md);margin-bottom:var(--space-sm)">
            <div>
              <label style="font-weight:700;font-size:var(--fs-xs)">Origin Stop</label>
              <input id="trans-origin" value="Riverside Park Bus Bay 2" style="width:100%">
            </div>
            <div>
              <label style="font-weight:700;font-size:var(--fs-xs)">Destination</label>
              <input id="trans-dest" placeholder="e.g. Central Railway Terminus" style="width:100%">
            </div>
          </div>
          <button class="btn btn-sm" id="btn-find-routes" style="color:#fff"><span>🗺️</span> Find Best Transit Routes</button>
          <div id="route-res-box" style="margin-top:10px"></div>
        </div>

        <!-- Transit Modes (Bus, Train, Metro, EV Feeder) -->
        <div class="grid-4 stagger-in" style="margin-bottom:var(--space-xl)">
          <div class="glass" style="border-left:4px solid var(--primary)">
            <div style="font-size:2rem;margin-bottom:6px">🚌</div>
            <h3 style="margin:0 0 4px">Smart Bus Fleet</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 10px">140 active GPS-enabled buses</p>
            <span class="badge-low">98.2% On-Time</span>
          </div>

          <div class="glass" style="border-left:4px solid var(--accent)">
            <div style="font-size:2rem;margin-bottom:6px">🚇</div>
            <h3 style="margin:0 0 4px">City Metro Rail</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 10px">2 lines · Frequency 4 mins</p>
            <span class="badge-low">Peak Hours Active</span>
          </div>

          <div class="glass" style="border-left:4px solid var(--warning)">
            <div style="font-size:2rem;margin-bottom:6px">🚆</div>
            <h3 style="margin:0 0 4px">Suburban Railway</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 10px">Connects Old Town & Industrial</p>
            <span class="badge-medium">Normal Schedule</span>
          </div>

          <div class="glass" style="border-left:4px solid var(--success)">
            <div style="font-size:2rem;margin-bottom:6px">⚡</div>
            <h3 style="margin:0 0 4px">EV Feeder Shuttles</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 10px">Zero emission last-mile transit</p>
            <span class="badge-low">24 Free Slots</span>
          </div>
        </div>

        <!-- Live Bus Radar Countdown Cards -->
        <div class="glass-static">
          <h3 style="margin:0 0 var(--space-md)">Live Arrivals at Nearest Stop (Riverside Bay 2)</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div class="glass" style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;font-size:var(--fs-sm)">Route 14A · Central Plaza Express</div>
                <div style="font-size:11px;color:var(--text-muted)">Electric Low-Floor · Air Conditioned · Wheelchair Accessible</div>
              </div>
              <div style="text-align:right">
                <span class="stats-bar__value" style="font-size:1.4rem;color:var(--success)">2 min</span>
                <div style="font-size:10px;color:var(--text-muted)">Occupancy: <b style="color:var(--success)">Low</b></div>
              </div>
            </div>

            <div class="glass" style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;font-size:var(--fs-sm)">Route 29C · Tech Park Metro Concourse</div>
                <div style="font-size:11px;color:var(--text-muted)">Standard Municipal Bus · Free Wi-Fi</div>
              </div>
              <div style="text-align:right">
                <span class="stats-bar__value" style="font-size:1.4rem;color:var(--primary)">7 min</span>
                <div style="font-size:10px;color:var(--text-muted)">Occupancy: <b style="color:var(--warning)">Medium</b></div>
              </div>
            </div>

            <div class="glass" style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;font-size:var(--fs-sm)">Route 05 · Old Town Heritage Loop</div>
                <div style="font-size:11px;color:var(--text-muted)">Green CNG Bus</div>
              </div>
              <div style="text-align:right">
                <span class="stats-bar__value" style="font-size:1.4rem;color:var(--text-muted)">14 min</span>
                <div style="font-size:10px;color:var(--text-muted)">Occupancy: <b style="color:var(--success)">Low</b></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  $('#btn-find-routes').onclick = () => {
    const dest = $('#trans-dest').value.trim();
    const box = $('#route-res-box');
    if (!dest) {
      box.innerHTML = `<span style="color:var(--warning);font-size:12px">Please specify a destination landmark or ward.</span>`;
      return;
    }
    box.innerHTML = `
      <div class="glass" style="padding:12px;background:rgba(29,111,232,0.08);margin-top:6px">
        <b>Optimal Route Suggested:</b> Take <b>Route 14A Bus</b> from Riverside Bay 2 to Central Interchange (3 stops, 8 mins), then transfer to <b>Metro Blue Line</b> towards ${dest} (Total time: ~18 mins · Fare: ₹15).
      </div>
    `;
    Sound.play('success');
  };
};

// ─────────────────────────────────────────────────────────────
// 10. COMMUNITY PARTICIPATION PAGE
// ─────────────────────────────────────────────────────────────
pages.community = function(ct) {
  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>Community Engagement & Citizen Ideas</h2>
          <p class="section-subtitle">Vote on participatory ward proposals, take civic surveys, and build neighborhood projects</p>
        </div>

        <!-- Top Action Bar -->
        <div class="glass-static" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:var(--space-xl)">
          <div>
            <h3 style="margin:0">Have an idea to improve your ward?</h3>
            <p style="color:var(--text-muted);font-size:var(--fs-xs);margin:2px 0 0">Proposals that cross 25 citizen votes are submitted directly to the Ward Councillor.</p>
          </div>
          <button class="btn" id="btn-open-idea-modal" style="color:#fff"><span>💡</span> Share Your Idea</button>
        </div>

        <!-- Interactive Civic Survey / Poll -->
        <div class="glass-static" style="margin-bottom:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span class="badge-medium">Active Citizen Survey</span>
            <span style="font-size:11px;color:var(--text-muted)">Ends in 4 days</span>
          </div>
          <h3 style="margin:0 0 6px">Should Main Riverside Promenade be pedestrian-only on weekend mornings?</h3>
          <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0 0 14px">
            Proposing to restrict vehicle movement on Saturdays and Sundays between 06:00 AM and 10:00 AM for walkers, cyclists, and senior wellness.
          </p>

          <div id="survey-poll-options">
            <button class="poll-option-btn" data-choice="yes">
              <div class="poll-progress-bg" style="width:78%"></div>
              <div class="poll-option-content">
                <span>👍 Yes, support pedestrian-only mornings</span>
                <span>78% (342 votes)</span>
              </div>
            </button>
            <button class="poll-option-btn" data-choice="no">
              <div class="poll-progress-bg" style="width:16%"></div>
              <div class="poll-option-content">
                <span>👎 No, creates commercial traffic diversions</span>
                <span>16% (70 votes)</span>
              </div>
            </button>
            <button class="poll-option-btn" data-choice="neutral">
              <div class="poll-progress-bg" style="width:6%"></div>
              <div class="poll-option-content">
                <span>🤔 Neutral / Needs more bus bypass routes</span>
                <span>6% (26 votes)</span>
              </div>
            </button>
          </div>
          <small id="poll-voted-msg" style="color:var(--success);font-weight:600;display:none;margin-top:6px">✓ Your vote has been verified and recorded.</small>
        </div>

        <!-- Submitted Citizen Ideas Grid -->
        <div class="section-header reveal">
          <h2>Citizen Proposals & Initiatives</h2>
          <p class="section-subtitle">Endorse ideas submitted by your neighborhood peers</p>
        </div>
        <div id="community-ideas-grid" class="grid-3 stagger-in"></div>

        <!-- Share Your Idea Modal -->
        <dialog id="share-idea-dialog" style="max-width:560px;width:92%;padding:24px;border-radius:var(--radius-xl);background:var(--surface)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 style="margin:0">💡 Share Your Civic Idea</h3>
            <button class="chip" id="btn-close-idea-modal">✕</button>
          </div>
          <form id="idea-form" novalidate>
            <label style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Proposal Title *</label>
            <input id="idea-title" placeholder="e.g. Install Solar Streetlights in Ward 14 Park" required style="width:100%;margin-bottom:12px">

            <label style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Category *</label>
            <select id="idea-cat" required style="width:100%;margin-bottom:12px">
              <option value="Green City">🌿 Green City & Environment</option>
              <option value="Smart Energy">⚡ Clean Energy & Solar</option>
              <option value="Mobility & Safety">🚦 Mobility, Pedestrians & Roads</option>
              <option value="Youth & Education">📚 Youth, Libraries & Recreation</option>
            </select>

            <label style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Target Location / Ward *</label>
            <input id="idea-loc" placeholder="e.g. Zone 2 – Riverside" required style="width:100%;margin-bottom:12px">

            <label style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Description & Community Benefit *</label>
            <textarea id="idea-desc" rows="3" placeholder="Explain who benefits and why this makes the city better..." required style="width:100%;margin-bottom:16px"></textarea>

            <button type="submit" class="btn btn-lg" style="width:100%;color:#fff">Publish to Community Board</button>
          </form>
        </dialog>
      </div>
    </section>
  `;

  function renderIdeas() {
    const ideas = CivicDB.getCommunityIdeas();
    const user = Store.currentUser;
    const grid = $('#community-ideas-grid');
    if (!grid) return;

    grid.innerHTML = ideas.map(item => {
      const hasVoted = user && item.voted_users && item.voted_users.includes(user.id);
      return `
        <div class="glass" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span class="badge-medium">${item.category}</span>
              <span style="font-size:11px;color:var(--text-muted)">📍 ${item.location}</span>
            </div>
            <h3 style="margin:0 0 6px;font-size:var(--fs-md)">${item.title}</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-secondary);margin:0 0 12px;line-height:1.5">${item.description}</p>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:10px;display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:11px;color:var(--text-muted)">By <b>${item.user_name}</b></span>
            <button class="btn btn-sm ${hasVoted ? '' : 'btn-outline'}" data-vote-id="${item.id}" style="padding:4px 10px;font-size:12px">
              ❤️ ${item.votes} Support
            </button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-vote-id]').forEach(btn => {
      btn.onclick = () => {
        CivicDB.voteIdea(btn.dataset.voteId);
        renderIdeas();
      };
    });
  }

  // Survey Poll buttons
  $$('.poll-option-btn').forEach(b => {
    b.onclick = () => {
      Sound.play('award');
      $('#poll-voted-msg').style.display = 'block';
      toast('success', 'Vote Cast', 'Thank you for participating in the municipal policy survey!');
    };
  });

  // Modal Handlers
  const modal = $('#share-idea-dialog');
  $('#btn-open-idea-modal').onclick = () => modal.showModal();
  $('#btn-close-idea-modal').onclick = () => modal.close();

  $('#idea-form').onsubmit = e => {
    e.preventDefault();
    const title = $('#idea-title').value.trim();
    const cat = $('#idea-cat').value;
    const loc = $('#idea-loc').value.trim();
    const desc = $('#idea-desc').value.trim();

    if (!title || !desc || !loc) {
      toast('error', 'Error', 'Please fill in all idea fields.');
      return;
    }

    CivicDB.createCommunityIdea({ title, category: cat, location: loc, description: desc });
    modal.close();
    Sound.play('success');
    toast('success', 'Idea Published!', 'Your proposal is now live for neighbors to support.');
    renderIdeas();
  };

  renderIdeas();
};

// ─────────────────────────────────────────────────────────────
// 11. SMART CITY MAP PAGE
// ─────────────────────────────────────────────────────────────
pages.map = function(ct) {
  const db = Store.data;
  const services = db.services || [];
  const reports = db.reports || [];

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <div class="section-header reveal">
          <h2>Interactive Smart City Sensor Map</h2>
          <p class="section-subtitle">Real-time geo-visualization of complaints, public hospitals, emergency units, and transit</p>
        </div>

        <!-- Filter Pills Bar -->
        <div class="glass-static" style="margin-bottom:var(--space-md)">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <span style="font-weight:700;font-size:var(--fs-sm)">Layers:</span>
            <div style="display:flex;gap:6px;flex-wrap:wrap" id="map-layer-pills">
              <button class="chip active" data-layer="all">All Markers</button>
              <button class="chip active" data-layer="complaints">📢 Civic Complaints (${reports.length})</button>
              <button class="chip active" data-layer="hospitals">🏥 Hospitals (${services.filter(s=>s.category==='Hospitals').length})</button>
              <button class="chip active" data-layer="police">🛡️ Police & Fire (${services.filter(s=>s.category==='Police Stations'||s.category==='Fire Stations').length})</button>
              <button class="chip active" data-layer="transit">🚌 Transit Hubs (${services.filter(s=>s.category==='Bus Stops'||s.category==='Railway Stations').length})</button>
            </div>
            <button class="btn btn-sm btn-outline" id="btn-map-recenter">📍 Re-center on Me</button>
          </div>
        </div>

        <!-- SVG / Canvas Map Viewport -->
        <div class="glass-static" style="padding:0;overflow:hidden;position:relative;border-radius:var(--radius-xl);background:#0a1c2e">
          <svg id="smart-map-svg" viewBox="0 0 1000 560" style="width:100%;height:auto;display:block;min-height:440px">
            <defs>
              <radialGradient id="water-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#0c3559"/>
                <stop offset="100%" stop-color="#071c30"/>
              </radialGradient>
              <filter id="glow-fx" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow"/>
                <feComposite in="SourceGraphic" in2="glow" operator="over"/>
              </filter>
            </defs>

            <!-- Base Grid & Waterways -->
            <rect width="1000" height="560" fill="url(#water-grad)"/>
            <!-- River Promenade -->
            <path d="M 0,260 C 250,230 450,330 750,290 C 880,270 940,320 1000,300 L 1000,370 C 940,390 850,340 730,360 C 430,410 230,300 0,330 Z" fill="#0f456e" opacity="0.6"/>

            <!-- Road Arteries -->
            <path d="M 80,0 L 120,560" stroke="rgba(255,255,255,0.12)" stroke-width="6"/>
            <path d="M 320,0 L 360,560" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
            <path d="M 640,0 L 620,560" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
            <path d="M 880,0 L 860,560" stroke="rgba(255,255,255,0.12)" stroke-width="6"/>
            <path d="M 0,140 L 1000,120" stroke="rgba(255,255,255,0.18)" stroke-width="8"/>
            <path d="M 0,440 L 1000,430" stroke="rgba(255,255,255,0.15)" stroke-width="7"/>

            <!-- Ward Boundaries Labels -->
            <text x="180" y="80" fill="rgba(255,255,255,0.3)" font-size="14" font-weight="700">ZONE 1 – CENTRAL</text>
            <text x="440" y="240" fill="rgba(47,191,113,0.35)" font-size="14" font-weight="700">ZONE 2 – RIVERSIDE</text>
            <text x="740" y="90" fill="rgba(18,184,208,0.35)" font-size="14" font-weight="700">ZONE 3 – TECH PARK</text>
            <text x="180" y="490" fill="rgba(245,165,36,0.35)" font-size="14" font-weight="700">ZONE 4 – OLD TOWN</text>

            <!-- Dynamic Markers -->
            <!-- Complaints -->
            <g id="layer-complaints">
              <g transform="translate(420, 260)" style="cursor:pointer" onclick="alert('Complaint CC-2026-4821\\nRoad Damage near Riverside Gate.\\nStatus: In Progress');">
                <circle r="14" fill="#e5484d" opacity="0.3" class="pulse"/>
                <circle r="8" fill="#e5484d"/>
                <text y="3" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">!</text>
              </g>
              <g transform="translate(510, 210)" style="cursor:pointer" onclick="alert('Complaint CC-2026-4819\\nBroken Streetlight.\\nStatus: Resolved');">
                <circle r="8" fill="#2fbf71"/>
                <text y="3" text-anchor="middle" font-size="8" fill="#fff" font-weight="bold">✓</text>
              </g>
              <g transform="translate(240, 130)" style="cursor:pointer" onclick="alert('Complaint CC-2026-4805\\nGarbage Overflow at Bus Bay.\\nStatus: Assigned');">
                <circle r="8" fill="#f5a524"/>
                <text y="3" text-anchor="middle" font-size="8" fill="#fff" font-weight="bold">!</text>
              </g>
            </g>

            <!-- Hospitals -->
            <g id="layer-hospitals">
              <g transform="translate(280, 110)" style="cursor:pointer" onclick="alert('Apollo Multispecialty Hospital\\n21 Greams Lane\\nOpen 24/7 Trauma Emergency');">
                <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#1d6fe8"/>
                <text y="5" text-anchor="middle" font-size="14">🏥</text>
              </g>
              <g transform="translate(360, 160)" style="cursor:pointer" onclick="alert('Government General Hospital\\nStation Road\\nOpen 24/7');">
                <rect x="-10" y="-10" width="20" height="20" rx="5" fill="#1d6fe8"/>
                <text y="4" text-anchor="middle" font-size="12">🏥</text>
              </g>
            </g>

            <!-- Police & Fire -->
            <g id="layer-police">
              <g transform="translate(200, 160)" style="cursor:pointer" onclick="alert('City Central Police HQ\\nDial: 100');">
                <rect x="-10" y="-10" width="20" height="20" rx="5" fill="#12b8d0"/>
                <text y="4" text-anchor="middle" font-size="12">🛡️</text>
              </g>
              <g transform="translate(780, 120)" style="cursor:pointer" onclick="alert('Fire & Rescue Station #2\\nDial: 101');">
                <rect x="-10" y="-10" width="20" height="20" rx="5" fill="#e5484d"/>
                <text y="4" text-anchor="middle" font-size="12">🔥</text>
              </g>
            </g>

            <!-- Transit Hubs -->
            <g id="layer-transit">
              <g transform="translate(330, 270)" style="cursor:pointer" onclick="alert('Riverside Bus Terminal & Metro Bay 2');">
                <rect x="-10" y="-10" width="20" height="20" rx="5" fill="#2fbf71"/>
                <text y="4" text-anchor="middle" font-size="12">🚌</text>
              </g>
              <g transform="translate(640, 290)" style="cursor:pointer" onclick="alert('Tech Park Metro Concourse');">
                <rect x="-10" y="-10" width="20" height="20" rx="5" fill="#2fbf71"/>
                <text y="4" text-anchor="middle" font-size="12">🚇</text>
              </g>
            </g>

            <!-- Citizen My Location Pulsing Dot -->
            <g id="my-location-pin" transform="translate(460, 240)">
              <circle r="16" fill="#12b8d0" opacity="0.3" class="pulse"/>
              <circle r="6" fill="#12b8d0" stroke="#fff" stroke-width="2"/>
              <text y="-12" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">You Are Here</text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  `;

  // Layer toggles
  $$('#map-layer-pills .chip').forEach(chip => {
    chip.onclick = () => {
      chip.classList.toggle('active');
      const layer = chip.dataset.layer;
      if (layer === 'all') {
        const makeActive = chip.classList.contains('active');
        $$('#map-layer-pills .chip').forEach(c => c.classList.toggle('active', makeActive));
        ['complaints', 'hospitals', 'police', 'transit'].forEach(l => {
          const el = $(`#layer-${l}`);
          if (el) el.style.display = makeActive ? 'block' : 'none';
        });
      } else {
        const el = $(`#layer-${layer}`);
        if (el) el.style.display = chip.classList.contains('active') ? 'block' : 'none';
      }
      Sound.play('click');
    };
  });

  $('#btn-map-recenter').onclick = () => {
    Sound.play('success');
    toast('info', 'Re-centered', 'Map centered on your current location (Zone 2 – Riverside).');
  };
};

// ─────────────────────────────────────────────────────────────
// 12. CITIZEN PROFILE PAGE
// ─────────────────────────────────────────────────────────────
pages.profile = function(ct) {
  const user = Store.currentUser;
  if (!user) {
    ct.innerHTML = `
      <section class="section">
        <div class="wrapper" style="max-width:540px;text-align:center;padding:60px 20px">
          <h2>Sign In to View Citizen Profile</h2>
          <p style="color:var(--text-muted);margin-bottom:20px">Access your digital municipal pass and account settings.</p>
          <a class="btn btn-lg" href="#/login">Login</a>
        </div>
      </section>
    `;
    return;
  }

  const userReports = CivicDB.getReports(user.id);
  const resolved = userReports.filter(r => r.status === 'Resolved').length;

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper" style="max-width:860px">
        <div class="section-header reveal">
          <h2>Citizen Profile & Settings</h2>
          <p class="section-subtitle">Manage your credentials, digital civic pass, and notification preferences</p>
        </div>

        <!-- Holographic 3D Digital Citizen Pass -->
        <div class="civic-card-container">
          <div class="civic-card-inner" id="hologram-card" onclick="this.classList.toggle('flipped'); Sound.play('click');">
            <!-- Front -->
            <div class="civic-card-front">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:1.4rem">🏙️</span>
                  <div>
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.7)">MUNICIPAL CORPORATION</div>
                    <div style="font-weight:800;font-size:13px;color:#fff">Digital Citizen Pass</div>
                  </div>
                </div>
                <div class="chip-smart-emblem"><div></div><div></div><div></div><div></div></div>
              </div>
              <div>
                <div style="font-size:1.3rem;font-weight:800;color:#fff">${user.name}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7)">ID: <b>${user.id}</b> · ${user.city || 'Zone 2'}</div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:flex-end">
                <div>
                  <div style="font-size:9px;text-transform:uppercase;color:rgba(255,255,255,0.6)">CIVIC MERIT POINTS</div>
                  <div style="font-size:1.1rem;font-weight:800;color:#7fffd4">${user.points || 120} PTS</div>
                </div>
                <div style="font-size:10px;color:rgba(255,255,255,0.5)">Tap to flip ↻</div>
              </div>
            </div>

            <!-- Back -->
            <div class="civic-card-back">
              <div style="font-size:11px;color:rgba(255,255,255,0.7)">MUNICIPAL TELEMETRY CHIP v2.4</div>
              <div style="background:#fff;padding:8px;border-radius:4px;display:inline-block;margin:auto">
                <svg width="60" height="60" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#fff"/>
                  <rect x="10" y="10" width="30" height="30" fill="#000"/>
                  <rect x="60" y="10" width="30" height="30" fill="#000"/>
                  <rect x="10" y="60" width="30" height="30" fill="#000"/>
                  <rect x="50" y="50" width="15" height="15" fill="#000"/>
                </svg>
              </div>
              <div style="font-size:10px;color:rgba(255,255,255,0.6);text-align:center">Valid for municipal bus transit, public e-toilets, and library kiosks.</div>
            </div>
          </div>
        </div>

        <!-- Activity Stats Grid -->
        <div class="grid-3 stagger-in" style="margin:var(--space-xl) 0">
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value gradient-text">${userReports.length}</span>
            <div style="font-weight:700;margin-top:4px">Reports Filed</div>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--success)">${resolved}</span>
            <div style="font-weight:700;margin-top:4px">Resolved Grievances</div>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--primary)">${user.points || 120}</span>
            <div style="font-weight:700;margin-top:4px">Eco-Civic Points</div>
          </div>
        </div>

        <!-- Profile Details & Settings Form -->
        <div class="glass-static">
          <h3 style="margin:0 0 var(--space-md)">Personal Details & Preferences</h3>
          <form id="profile-edit-form" novalidate>
            <div class="grid-2" style="gap:var(--space-md);margin-bottom:var(--space-md)">
              <div>
                <label style="font-weight:700;font-size:var(--fs-xs)">Full Name</label>
                <input id="prof-name" value="${user.name}" style="width:100%">
              </div>
              <div>
                <label style="font-weight:700;font-size:var(--fs-xs)">Email Address</label>
                <input id="prof-email" value="${user.email}" style="width:100%">
              </div>
            </div>
            <div class="grid-2" style="gap:var(--space-md);margin-bottom:var(--space-md)">
              <div>
                <label style="font-weight:700;font-size:var(--fs-xs)">Phone Number</label>
                <input id="prof-phone" value="${user.phone || '+91 98765 43210'}" style="width:100%">
              </div>
              <div>
                <label style="font-weight:700;font-size:var(--fs-xs)">Registered Ward</label>
                <input id="prof-city" value="${user.city || 'Zone 2 – Riverside'}" style="width:100%">
              </div>
            </div>

            <hr class="divider">
            <h4 style="margin:0 0 10px">Notification Preferences</h4>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:var(--space-md)">
              <label style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);cursor:pointer">
                <input type="checkbox" checked> SMS alerts for complaint status changes
              </label>
              <label style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);cursor:pointer">
                <input type="checkbox" checked> High priority water & power outage broadcasts
              </label>
              <label style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);cursor:pointer">
                <input type="checkbox"> Weekly civic newsletter and ward poll reminders
              </label>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-lg)">
              <button type="button" class="btn btn-sm" id="btn-logout" style="background:var(--danger);color:#fff">
                🚪 Logout
              </button>
              <button type="submit" class="btn btn-sm" style="color:#fff">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `;

  $('#btn-logout').onclick = () => Auth.logout();

  $('#profile-edit-form').onsubmit = e => {
    e.preventDefault();
    user.name = $('#prof-name').value.trim() || user.name;
    user.email = $('#prof-email').value.trim() || user.email;
    user.phone = $('#prof-phone').value.trim() || user.phone;
    user.city = $('#prof-city').value.trim() || user.city;
    Store.setCurrentUser(user);
    toast('success', 'Profile Updated', 'Your profile settings have been saved.');
    Sound.play('success');
  };
};

// ─────────────────────────────────────────────────────────────
// 13. ADMIN DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
pages.admin = function(ct) {
  const user = Store.currentUser;
  if (!user || user.role !== 'admin') {
    ct.innerHTML = `
      <section class="section">
        <div class="wrapper" style="max-width:540px;text-align:center;padding:60px 20px">
          <div style="font-size:3rem;margin-bottom:12px">🏛️</div>
          <h2>Municipal Administrator Portal</h2>
          <p style="color:var(--text-muted);margin-bottom:20px">
            Administrative access required. You can test this immediately with one click below.
          </p>
          <button class="btn btn-lg" id="btn-demo-admin-login" style="color:#fff">
            🔑 Sign In as Municipal Admin
          </button>
        </div>
      </section>
    `;
    $('#btn-demo-admin-login').onclick = () => {
      const adminUser = DB_SEEDS.users.find(u => u.role === 'admin');
      Store.setCurrentUser(adminUser);
      toast('success', 'Admin Session Active', 'Signed in as Municipal Admin Officer.');
      pages.admin(ct);
    };
    return;
  }

  const db = Store.data;
  const allReports = db.reports || [];
  const pending = allReports.filter(r => r.status === 'Reported' || r.status === 'Under Review').length;
  const inProg = allReports.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length;
  const resolved = allReports.filter(r => r.status === 'Resolved').length;
  const total = allReports.length;
  const activeUsers = (db.users || []).length;

  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper">
        <div class="glass-static" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:var(--space-xl)">
          <div>
            <div class="badge-emergency" style="margin-bottom:4px">OFFICIAL CONTROL SUITE</div>
            <h1 style="margin:0;font-size:var(--fs-xl)">Municipal Operations Command</h1>
            <p style="color:var(--text-muted);font-size:var(--fs-xs);margin:2px 0 0">Logged in as: <b>${user.name}</b> (${user.city})</p>
          </div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-sm btn-outline" id="btn-admin-export">📥 Export CSV Log</button>
            <button class="btn btn-sm" id="btn-admin-logout" style="background:var(--danger);color:#fff">Exit Admin</button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="grid-4 stagger-in" style="margin-bottom:var(--space-xl)">
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value gradient-text">${total}</span>
            <div style="font-weight:700;margin-top:4px">Total Complaints</div>
            <small style="color:var(--text-muted)">All municipal wards</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--warning)">${pending}</span>
            <div style="font-weight:700;margin-top:4px">Pending Intake</div>
            <small style="color:var(--warning)">Requires triage</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--primary)">${inProg}</span>
            <div style="font-weight:700;margin-top:4px">Active Dispatch</div>
            <small style="color:var(--primary)">Crews on site</small>
          </div>
          <div class="glass-static" style="text-align:center">
            <span class="stats-bar__value" style="color:var(--success)">${resolved}</span>
            <div style="font-weight:700;margin-top:4px">Resolved</div>
            <small style="color:var(--success)">${Math.round((resolved/Math.max(1,total))*100)}% Rate</small>
          </div>
        </div>

        <!-- Complaint Management Table -->
        <div class="glass-static" style="margin-bottom:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:var(--space-md)">
            <h3 style="margin:0">Live Grievance Dispatch & Triage</h3>
            <div style="display:flex;gap:8px">
              <select id="admin-status-filter" style="padding:6px 10px;font-size:12px">
                <option value="all">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div class="admin-table-wrap">
            <table class="admin-table" id="admin-complaints-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title & Citizen</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Assigned Dept</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="admin-table-body"></tbody>
            </table>
          </div>
        </div>

        <!-- Analytics Charts -->
        <div class="grid-2">
          <!-- Complaints by Category Chart -->
          <div class="glass-static">
            <h3 style="margin:0 0 var(--space-md)">Complaints by Category</h3>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
                  <span>Road Damage</span><b>38%</b>
                </div>
                <div class="budget-bar-wrap"><div class="budget-bar-fill" style="width:38%"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
                  <span>Streetlight & Electrical</span><b>24%</b>
                </div>
                <div class="budget-bar-wrap"><div class="budget-bar-fill" style="width:24%;background:var(--accent)"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
                  <span>Garbage & Sanitation</span><b>20%</b>
                </div>
                <div class="budget-bar-wrap"><div class="budget-bar-fill" style="width:20%;background:var(--warning)"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
                  <span>Water Supply & Drainage</span><b>18%</b>
                </div>
                <div class="budget-bar-wrap"><div class="budget-bar-fill" style="width:18%;background:var(--success)"></div></div>
              </div>
            </div>
          </div>

          <!-- Ward Workload Distribution -->
          <div class="glass-static">
            <h3 style="margin:0 0 var(--space-md)">Department Workload & Velocity</h3>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div class="glass" style="padding:10px;display:flex;justify-content:space-between">
                <div>
                  <div style="font-weight:700;font-size:12px">Public Works (Roads)</div>
                  <div style="font-size:10px;color:var(--text-muted)">18 active work orders · Avg response 3.2h</div>
                </div>
                <span class="badge-medium">Active</span>
              </div>
              <div class="glass" style="padding:10px;display:flex;justify-content:space-between">
                <div>
                  <div style="font-weight:700;font-size:12px">Electrical & Streetlights</div>
                  <div style="font-size:10px;color:var(--text-muted)">9 active work orders · Avg response 2.1h</div>
                </div>
                <span class="badge-low">Optimal</span>
              </div>
              <div class="glass" style="padding:10px;display:flex;justify-content:space-between">
                <div>
                  <div style="font-weight:700;font-size:12px">Solid Waste Management</div>
                  <div style="font-size:10px;color:var(--text-muted)">12 active truck runs · Avg response 1.8h</div>
                </div>
                <span class="badge-low">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Action Modal (Status Change & Department Assign) -->
        <dialog id="admin-action-modal" style="max-width:540px;width:92%;padding:24px;border-radius:var(--radius-xl);background:var(--surface)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
            <h3 style="margin:0" id="adm-modal-title">Manage Ticket</h3>
            <button class="chip" id="btn-adm-modal-close">✕</button>
          </div>
          <form id="adm-action-form">
            <input type="hidden" id="adm-ticket-id">
            <div style="margin-bottom:12px">
              <label style="font-weight:700;font-size:var(--fs-xs)">Next Stage Status</label>
              <select id="adm-next-status" style="width:100%;margin-top:4px">
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned to Crew</option>
                <option value="In Progress">In Progress (Work on site)</option>
                <option value="Resolved">Resolved (Fixed & Verified)</option>
              </select>
            </div>
            <div style="margin-bottom:12px">
              <label style="font-weight:700;font-size:var(--fs-xs)">Responsible Department</label>
              <select id="adm-assign-dept" style="width:100%;margin-top:4px">
                <option value="Department of Public Works (Roads)">Public Works (Roads & Bridges)</option>
                <option value="Electrical & Smart Lighting Board">Electrical & Lighting Wing</option>
                <option value="Solid Waste Management Dept">Solid Waste & Sanitation</option>
                <option value="Water Supply & Sewerage Board">Water & Sewerage Board</option>
                <option value="City Traffic Police Wing">Traffic Police Department</option>
              </select>
            </div>
            <div style="margin-bottom:16px">
              <label style="font-weight:700;font-size:var(--fs-xs)">Official Inspector Notes</label>
              <textarea id="adm-notes" rows="3" placeholder="Enter inspection findings, repair team dispatched, or resolution notes..." required style="width:100%;margin-top:4px"></textarea>
            </div>
            <button type="submit" class="btn btn-lg" style="width:100%;color:#fff">Update & Dispatch Notification</button>
          </form>
        </dialog>
      </div>
    </section>
  `;

  function renderTable() {
    const filter = $('#admin-status-filter').value;
    let list = db.reports || [];
    if (filter !== 'all') {
      list = list.filter(r => r.status.toLowerCase() === filter.toLowerCase());
    }
    const tbody = $('#admin-table-body');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted)">No complaints found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(r => `
      <tr>
        <td><b style="color:var(--primary)">${r.id}</b></td>
        <td>
          <div style="font-weight:700">${r.title}</div>
          <small style="color:var(--text-muted)">By ${r.user_name}</small>
        </td>
        <td>${r.category}</td>
        <td>${r.location}</td>
        <td>${r.department || 'Intake Queue'}</td>
        <td><span class="badge-${r.status === 'Resolved' ? 'low' : r.status === 'In Progress' ? 'medium' : 'high'}">${r.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" style="padding:4px 8px;font-size:11px" onclick="openAdminModal('${r.id}')">
            ⚙️ Triage
          </button>
        </td>
      </tr>
    `).join('');
  }

  window.openAdminModal = function(repId) {
    const r = CivicDB.getReportById(repId);
    if (!r) return;
    $('#adm-ticket-id').value = r.id;
    $('#adm-modal-title').textContent = `Manage Ticket: ${r.id}`;
    $('#adm-next-status').value = r.status === 'Reported' ? 'Under Review' : r.status === 'Under Review' ? 'Assigned' : r.status === 'Assigned' ? 'In Progress' : 'Resolved';
    $('#adm-notes').value = '';
    $('#admin-action-modal').showModal();
  };

  $('#btn-adm-modal-close').onclick = () => $('#admin-action-modal').close();

  $('#adm-action-form').onsubmit = e => {
    e.preventDefault();
    const id = $('#adm-ticket-id').value;
    const nextSt = $('#adm-next-status').value;
    const dept = $('#adm-assign-dept').value;
    const notes = $('#adm-notes').value.trim();

    CivicDB.updateReportStatus(id, nextSt, dept, notes);
    $('#admin-action-modal').close();
    Sound.play('award');
    toast('success', 'Ticket Updated', `Ticket ${id} moved to "${nextSt}". Citizen notified.`);
    renderTable();
  };

  $('#admin-status-filter').onchange = renderTable;

  $('#btn-admin-logout').onclick = () => {
    Auth.logout();
  };

  $('#btn-admin-export').onclick = () => {
    const csv = "ID,Title,Category,Status,Location,Date\n" + (db.reports||[]).map(r => `"${r.id}","${r.title}","${r.category}","${r.status}","${r.location}","${r.created_at}"`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `CivicConnect-Complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast('info', 'CSV Exported', 'Operational complaint logs downloaded.');
  };

  renderTable();
};

// ─────────────────────────────────────────────────────────────
// 14. LOGIN & SIGNUP PAGES
// ─────────────────────────────────────────────────────────────
pages.login = function(ct) {
  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-2xl)">
      <div class="wrapper" style="max-width:460px">
        <div class="glass-static">
          <div style="text-align:center;margin-bottom:var(--space-lg)">
            <span style="font-size:2.4rem">🏙️</span>
            <h2 style="margin:6px 0 2px">Sign In to CivicConnect</h2>
            <p style="color:var(--text-muted);font-size:var(--fs-sm);margin:0">Access your private reports and smart city services</p>
          </div>

          <!-- Quick Test Demo Buttons -->
          <div class="glass" style="background:rgba(29,111,232,0.08);padding:10px;margin-bottom:var(--space-md);text-align:center">
            <span style="font-size:11px;font-weight:700;display:block;margin-bottom:6px">One-Click Demo Evaluator Logins:</span>
            <div style="display:flex;gap:8px;justify-content:center">
              <button type="button" class="btn btn-sm" id="btn-demo-citizen" style="font-size:11px;padding:4px 10px">
                👩‍💼 Citizen Demo
              </button>
              <button type="button" class="btn btn-sm btn-outline" id="btn-demo-admin" style="font-size:11px;padding:4px 10px">
                🏛️ Admin Demo
              </button>
            </div>
          </div>

          <form id="login-form" novalidate>
            <div style="margin-bottom:var(--space-md)">
              <label for="login-email" style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Email Address</label>
              <input id="login-email" type="email" placeholder="name@example.com" required style="width:100%" value="priya.sharma@example.com">
            </div>

            <div style="margin-bottom:var(--space-md)">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <label for="login-pass" style="font-weight:700;font-size:var(--fs-xs)">Password</label>
                <a href="javascript:void(0)" onclick="alert('Password reset link has been sent to your registered email.')" style="font-size:11px;color:var(--primary)">Forgot Password?</a>
              </div>
              <input id="login-pass" type="password" placeholder="••••••••" required style="width:100%" value="password123">
            </div>

            <div style="display:flex;align-items:center;gap:8px;margin-bottom:var(--space-lg)">
              <input type="checkbox" id="login-remember" checked>
              <label for="login-remember" style="font-size:var(--fs-xs);cursor:pointer">Remember this device</label>
            </div>

            <div id="login-err-msg" style="color:var(--danger);font-size:12px;margin-bottom:10px"></div>

            <button type="submit" class="btn btn-lg" style="width:100%;color:#fff">Sign In</button>
          </form>

          <div style="text-align:center;margin-top:var(--space-lg);font-size:var(--fs-xs);color:var(--text-muted)">
            Don't have an account yet? <a href="#/signup" style="color:var(--primary);font-weight:700">Create Account</a>
          </div>
        </div>
      </div>
    </section>
  `;

  $('#btn-demo-citizen').onclick = () => {
    $('#login-email').value = 'priya.sharma@example.com';
    $('#login-pass').value = 'password123';
    $('#login-form').dispatchEvent(new Event('submit'));
  };

  $('#btn-demo-admin').onclick = () => {
    $('#login-email').value = 'admin@civicconnect.gov';
    $('#login-pass').value = 'admin';
    $('#login-form').dispatchEvent(new Event('submit'));
  };

  $('#login-form').onsubmit = e => {
    e.preventDefault();
    const email = $('#login-email').value;
    const pass = $('#login-pass').value;
    const res = Auth.login(email, pass);
    if (!res.ok) {
      $('#login-err-msg').textContent = res.error;
      toast('error', 'Login Failed', res.error);
    } else {
      Sound.play('success');
      toast('success', `Welcome Back, ${res.user.name.split(' ')[0]}!`, 'Successfully signed in to CivicConnect.');
      window.location.hash = res.user.role === 'admin' ? '#/admin' : '#/dashboard';
    }
  };
};

pages.signup = function(ct) {
  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-2xl)">
      <div class="wrapper" style="max-width:480px">
        <div class="glass-static">
          <div style="text-align:center;margin-bottom:var(--space-lg)">
            <span style="font-size:2.4rem">✨</span>
            <h2 style="margin:6px 0 2px">Create Citizen Account</h2>
            <p style="color:var(--text-muted);font-size:var(--fs-sm);margin:0">Join thousands of active citizens making the city smarter</p>
          </div>

          <form id="signup-form" novalidate>
            <div style="margin-bottom:var(--space-md)">
              <label for="su-name" style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Full Name *</label>
              <input id="su-name" placeholder="Priya Sharma" required style="width:100%">
            </div>

            <div style="margin-bottom:var(--space-md)">
              <label for="su-email" style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Email Address *</label>
              <input id="su-email" type="email" placeholder="priya.sharma@example.com" required style="width:100%">
            </div>

            <div style="margin-bottom:var(--space-md)">
              <label for="su-phone" style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Phone Number *</label>
              <input id="su-phone" placeholder="+91 98765 43210" required style="width:100%">
            </div>

            <div class="grid-2" style="gap:var(--space-md);margin-bottom:var(--space-md)">
              <div>
                <label for="su-pass" style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Password *</label>
                <input id="su-pass" type="password" placeholder="••••••••" required style="width:100%">
              </div>
              <div>
                <label for="su-confirm" style="font-weight:700;font-size:var(--fs-xs);display:block;margin-bottom:4px">Confirm Password *</label>
                <input id="su-confirm" type="password" placeholder="••••••••" required style="width:100%">
              </div>
            </div>

            <div id="su-err-msg" style="color:var(--danger);font-size:12px;margin-bottom:12px"></div>

            <button type="submit" class="btn btn-lg" style="width:100%;color:#fff">Create Citizen Account</button>
          </form>

          <div style="text-align:center;margin-top:var(--space-lg);font-size:var(--fs-xs);color:var(--text-muted)">
            Already have an account? <a href="#/login" style="color:var(--primary);font-weight:700">Sign In</a>
          </div>
        </div>
      </div>
    </section>
  `;

  $('#signup-form').onsubmit = e => {
    e.preventDefault();
    const name = $('#su-name').value.trim();
    const email = $('#su-email').value.trim();
    const phone = $('#su-phone').value.trim();
    const password = $('#su-pass').value;
    const confirmPassword = $('#su-confirm').value;

    if (!name || !email || !phone || !password) {
      $('#su-err-msg').textContent = 'Please fill in all mandatory fields.';
      return;
    }

    const res = Auth.signup({ name, email, phone, password, confirmPassword });
    if (!res.ok) {
      $('#su-err-msg').textContent = res.error;
      toast('error', 'Sign Up Failed', res.error);
    } else {
      Sound.play('award');
      toast('success', 'Account Created!', `Welcome to CivicConnect, ${name}! +50 Civic Points awarded.`);
      window.location.hash = '#/dashboard';
    }
  };
};

// ─────────────────────────────────────────────────────────────
// 15. ABOUT PAGE
// ─────────────────────────────────────────────────────────────
pages.about = function(ct) {
  ct.innerHTML = `
    <section class="section" style="padding-top:var(--space-xl)">
      <div class="wrapper" style="max-width:880px">
        <div class="section-header reveal">
          <h2>About CivicConnect</h2>
          <p class="section-subtitle">Bridging the gap between citizens, technology, and city authorities</p>
        </div>

        <div class="glass-static" style="margin-bottom:var(--space-xl);line-height:1.7">
          <h3>Connecting Citizens with Smarter Cities</h3>
          <p>
            <b>CivicConnect</b> is a modern, unified Smart City & Civic Life Platform engineered to foster open, collaborative, and responsive municipal governance.
          </p>
          <p>
            By integrating real-time telemetry, automated complaint routing, IoT sensory networks, and participatory ward budgeting, CivicConnect ensures that municipal departments address grievances with full accountability while empowering citizens to shape their neighborhoods.
          </p>
        </div>

        <div class="grid-3 stagger-in">
          <div class="glass">
            <div style="font-size:2rem;margin-bottom:8px">🔒</div>
            <h4>Data Isolation & Privacy</h4>
            <p style="font-size:var(--fs-xs);color:var(--text-muted)">User complaints are strictly scoped to private citizen profiles unless approved for public transparency.</p>
          </div>
          <div class="glass">
            <div style="font-size:2rem;margin-bottom:8px">⚡</div>
            <h4>Real-Time Dispatch</h4>
            <p style="font-size:var(--fs-xs);color:var(--text-muted)">Automated triage routes issues directly to Asphalt, Electrical, Sanitation, or Water engineering wings.</p>
          </div>
          <div class="glass">
            <div style="font-size:2rem;margin-bottom:8px">🌱</div>
            <h4>Eco Citizen Points</h4>
            <p style="font-size:var(--fs-xs);color:var(--text-muted)">Earn civic merit tokens by segregating waste, taking public transit, and proposing community initiatives.</p>
          </div>
        </div>
      </div>
    </section>
  `;
};

// ─────────────────────────────────────────────────────────────
// 17. CIVIC AI ASSISTANT HUB
// ─────────────────────────────────────────────────────────────
pages.ai = function(ct) {
  ct.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:var(--space-md)">
      <div class="wrapper">
        <div class="glass-hero" style="background:linear-gradient(135deg,rgba(29,111,232,0.18),rgba(18,184,208,0.18));border:1px solid var(--border);border-radius:var(--radius-xl);padding:var(--space-xl);margin-bottom:var(--space-xl)">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <span style="font-size:2.4rem">🤖</span>
            <div>
              <div class="badge-low" style="background:var(--grad-primary);color:#fff">Next-Gen City Intelligence</div>
              <h2 style="margin:4px 0 0;font-size:var(--fs-2xl);font-weight:800;letter-spacing:-0.02em">CivicAI & Copilot Hub</h2>
            </div>
          </div>
          <p style="font-size:var(--fs-base);color:var(--text-secondary);max-width:720px;line-height:1.6">
            CivicAI analyzes civic telemetry, classifies citizen grievances using natural language understanding, predicts ward maintenance bottlenecks, and provides instant conversational guidance.
          </p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:var(--space-lg)">
            <button class="btn btn-lg" id="btn-launch-copilot" style="color:#fff">
              <span>💬</span> Launch Interactive Copilot
            </button>
            <a class="btn btn-lg btn-outline" href="#/report">
              <span>📝</span> Submit AI-Triaged Issue
            </a>
          </div>
        </div>

        <div class="grid-3 stagger-in" style="margin-bottom:var(--space-xl)">
          <div class="metric-card glass">
            <div style="font-size:1.8rem;margin-bottom:6px">⚡</div>
            <div class="metric-card__value">98.4%</div>
            <div class="metric-card__label">Automated Dispatch Accuracy</div>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:6px 0 0">Tickets routed to municipal wings without manual delay.</p>
          </div>
          <div class="metric-card glass">
            <div style="font-size:1.8rem;margin-bottom:6px">⏱️</div>
            <div class="metric-card__value">4.2 min</div>
            <div class="metric-card__label">Avg. Triage Response Time</div>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:6px 0 0">Real-time GPS validation and priority scoring.</p>
          </div>
          <div class="metric-card glass">
            <div style="font-size:1.8rem;margin-bottom:6px">🧠</div>
            <div class="metric-card__value">12,480+</div>
            <div class="metric-card__label">Inquiries Resolved</div>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:6px 0 0">Across waste schedules, transit tracking, and hospital directories.</p>
          </div>
        </div>

        <div class="grid-2 stagger-in">
          <div class="glass" style="padding:var(--space-lg)">
            <h3 style="margin-top:0">💡 Frequently Asked Questions</h3>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin-bottom:var(--space-md)">Click any prompt to ask Civic Copilot immediately:</p>
            <div style="display:flex;flex-direction:column;gap:10px">
              <button class="chip prompt-chip" style="text-align:left;padding:12px;font-size:var(--fs-xs)" data-prompt="Where is the nearest hospital?">
                🏥 "Where is the nearest emergency hospital?"
              </button>
              <button class="chip prompt-chip" style="text-align:left;padding:12px;font-size:var(--fs-xs)" data-prompt="How to segregate wet and dry waste?">
                ♻️ "How to segregate wet and dry waste?"
              </button>
              <button class="chip prompt-chip" style="text-align:left;padding:12px;font-size:var(--fs-xs)" data-prompt="Track CC-2026-4821">
                🔍 "Track ticket CC-2026-4821"
              </button>
              <button class="chip prompt-chip" style="text-align:left;padding:12px;font-size:var(--fs-xs)" data-prompt="Report a broken streetlight">
                💡 "How do I report a broken streetlight?"
              </button>
            </div>
          </div>

          <div class="glass" style="padding:var(--space-lg)">
            <h3 style="margin-top:0">📡 Active AI Prediction Models</h3>
            <div style="display:flex;flex-direction:column;gap:14px">
              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs);font-weight:700;margin-bottom:4px">
                  <span>🛣️ Road Surface Quality Sensor</span>
                  <span style="color:var(--success)">Normal · 94%</span>
                </div>
                <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden">
                  <div style="width:94%;height:100%;background:var(--success)"></div>
                </div>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs);font-weight:700;margin-bottom:4px">
                  <span>🌊 Storm Drain Saturation Risk</span>
                  <span style="color:var(--warning)">Moderate · 62%</span>
                </div>
                <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden">
                  <div style="width:62%;height:100%;background:var(--warning)"></div>
                </div>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs);font-weight:700;margin-bottom:4px">
                  <span>⚡ Solar Microgrid Grid Stability</span>
                  <span style="color:var(--primary)">Optimal · 98%</span>
                </div>
                <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden">
                  <div style="width:98%;height:100%;background:var(--primary)"></div>
                </div>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs);font-weight:700;margin-bottom:4px">
                  <span>🚌 Transit On-Time Predictor</span>
                  <span style="color:var(--success)">High Reliability · 91%</span>
                </div>
                <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden">
                  <div style="width:91%;height:100%;background:var(--success)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Attach button triggers
  ct.querySelector('#btn-launch-copilot')?.addEventListener('click', () => {
    const copDialog = document.getElementById('copilot-dialog');
    if (copDialog) {
      Sound.play('click');
      copDialog.showModal();
    }
  });

  ct.querySelectorAll('.prompt-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.prompt;
      const copDialog = document.getElementById('copilot-dialog');
      const copInput = document.getElementById('cop-input');
      const copSend = document.getElementById('cop-send');
      if (copDialog && copInput && copSend) {
        copDialog.showModal();
        copInput.value = q;
        copSend.click();
      }
    });
  });
};

/* ═══════════════════════════════════════════════════════════════
   ROUTER & APPLICATION LIFECYCLE
   ═══════════════════════════════════════════════════════════════ */

function handleRoute() {
  const fullHash = window.location.hash || '#/home';
  const cleanHash = fullHash.split('?')[0].replace(/^#\/?/, '') || 'home';
  const page = pages[cleanHash] || pages.home;

  const content = $('#page-content');
  if (!content) return;

  // Update active links in Left Sidebar
  $$('.sidebar-link').forEach(link => {
    const p = link.getAttribute('data-page');
    link.classList.toggle('active', p === cleanHash);
  });

  // Update contextual page title / breadcrumbs in top header
  const pageTitles = {
    home: 'Home',
    services: 'Smart Services',
    report: 'Report Issue',
    community: 'Community',
    dashboard: 'Dashboard',
    map: 'City Map',
    ai: 'CivicAI Assistant',
    about: 'About',
    track: 'Track Complaint',
    updates: 'City Updates',
    emergency: 'Emergency Services',
    waste: 'Waste Management',
    transit: 'Transit Radar',
    profile: 'Citizen Profile',
    admin: 'Admin Console',
    login: 'Citizen Login',
    signup: 'Citizen Registration'
  };
  const titleEl = $('#header-page-title');
  if (titleEl) {
    titleEl.textContent = pageTitles[cleanHash] || (cleanHash.charAt(0).toUpperCase() + cleanHash.slice(1));
  }

  // Close mobile navigation drawer if open
  $('#sidebar')?.classList.remove('open');
  $('#sidebar-backdrop')?.classList.remove('active');
  $('#burger')?.setAttribute('aria-expanded', 'false');

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Render page
  page(content);
}

function navigate(p) {
  window.location.hash = `#/${p}`;
}

// ── App Bootstrapper ──
function initCivicConnect() {
  // Theme toggle
  const themeBtn = $('#theme-toggle');
  function updateThemeUI() {
    const cur = Store.theme;
    const isDark = cur === 'dark';
    const icon = $('#theme-toggle-icon');
    const label = $('#theme-toggle-label');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (label) label.textContent = isDark ? 'Light Theme' : 'Dark Theme';
  }
  if (themeBtn) {
    themeBtn.onclick = () => {
      const cur = Store.theme;
      const next = cur === 'dark' ? 'light' : 'dark';
      Store.theme = next;
      updateThemeUI();
      Sound.play('click');
    };
    updateThemeUI();
  }

  // Language selector
  const langSel = $('#sidebar-lang-select');
  if (langSel) {
    langSel.value = Store.lang || 'en';
    langSel.onchange = e => {
      Store.lang = e.target.value;
      Sound.play('award');
    };
  }

  // Sound toggle
  const soundBtn = $('#sound-toggle');
  if (soundBtn) {
    soundBtn.onclick = () => {
      Sound.enabled = !Sound.enabled;
    };
  }

  // Global Search Keyboard Shortcut & Button
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openGlobalSearch();
    }
    if (e.key === 'Escape') {
      closeGlobalSearch();
      $('#notif-dropdown')?.classList.remove('active');
    }
  });

  $('#btn-global-search')?.addEventListener('click', openGlobalSearch);
  $('#btn-close-search')?.addEventListener('click', closeGlobalSearch);
  $('#global-search-modal')?.addEventListener('click', e => {
    if (e.target.id === 'global-search-modal') closeGlobalSearch();
  });
  $('#global-search-input')?.addEventListener('input', e => {
    renderSearchResults(e.target.value);
  });

  // Notifications Bell Dropdown
  const notifBtn = $('#notif-bell-btn');
  const notifDrop = $('#notif-dropdown');
  if (notifBtn && notifDrop) {
    notifBtn.onclick = e => {
      e.stopPropagation();
      notifDrop.classList.toggle('active');
      Sound.play('click');
    };
    document.addEventListener('click', e => {
      if (!notifDrop.contains(e.target) && e.target !== notifBtn) {
        notifDrop.classList.remove('active');
      }
    });
  }

  $('#btn-clear-notifs')?.addEventListener('click', () => {
    const u = Store.currentUser;
    if (u) CivicDB.clearAllNotifications(u.id);
    updateNotificationsUI();
  });

  // Mobile Hamburger & Sidebar Drawer Controls
  const burger = $('#burger');
  const sidebar = $('#sidebar');
  const backdrop = $('#sidebar-backdrop');
  const closeBtn = $('#sidebar-close-btn');

  function openSidebar() {
    sidebar?.classList.add('open');
    backdrop?.classList.add('active');
    burger?.setAttribute('aria-expanded', 'true');
    Sound.play('click');
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    backdrop?.classList.remove('active');
    burger?.setAttribute('aria-expanded', 'false');
  }

  burger?.addEventListener('click', () => {
    if (sidebar?.classList.contains('open')) closeSidebar();
    else openSidebar();
  });
  backdrop?.addEventListener('click', closeSidebar);
  closeBtn?.addEventListener('click', closeSidebar);

  // Initialize Route & User Navigation
  window.addEventListener('hashchange', handleRoute);
  updateNavbarUser();
  handleRoute();

  console.log('🏙️ Smart City – CivicConnect Platform initialized successfully.');
}

window.addEventListener('DOMContentLoaded', initCivicConnect);
