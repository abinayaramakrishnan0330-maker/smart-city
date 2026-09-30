/* ═══════════════════════════════════════════════════════
   Smart City – Global State Store
   ═══════════════════════════════════════════════════════ */

/**
 * Simple reactive store using localStorage for persistence
 * and pub/sub for component updates.
 */
const listeners = new Map();

function notify(key) {
  (listeners.get(key) || []).forEach(fn => fn(store[key]));
  (listeners.get('*') || []).forEach(fn => fn(key, store[key]));
}

const store = {
  // ── Theme ──
  get theme() {
    return localStorage.getItem('sc-theme') || 'system';
  },
  set theme(v) {
    localStorage.setItem('sc-theme', v);
    applyTheme(v);
    notify('theme');
  },

  // ── Language ──
  get lang() {
    return localStorage.getItem('sc-lang') || 'en';
  },
  set lang(v) {
    localStorage.setItem('sc-lang', v);
    notify('lang');
  },

  // ── Civic Points ──
  get points() {
    return parseInt(localStorage.getItem('sc-points') || '120', 10);
  },
  set points(v) {
    localStorage.setItem('sc-points', String(v));
    notify('points');
  },

  // ── User (simulated login) ──
  get user() {
    const raw = localStorage.getItem('sc-user');
    return raw ? JSON.parse(raw) : null;
  },
  set user(v) {
    if (v) localStorage.setItem('sc-user', JSON.stringify(v));
    else localStorage.removeItem('sc-user');
    notify('user');
  },

  // ── Complaint Database ──
  get complaints() {
    const raw = localStorage.getItem('sc-complaints');
    return raw ? JSON.parse(raw) : {
      'CL-1042': { cat: 'Pothole', step: 2, desc: 'Deep pothole near City Mall', zone: 'Zone 1', date: '2026-09-25T10:30:00' },
      'CL-1038': { cat: 'Broken streetlight', step: 3, desc: 'Streetlight out on Lake Road', zone: 'Zone 2', date: '2026-09-22T14:00:00' },
      'CL-1035': { cat: 'Water leakage', step: 1, desc: 'Water leak at Old Town market', zone: 'Zone 4', date: '2026-09-20T09:15:00' }
    };
  },
  set complaints(v) {
    localStorage.setItem('sc-complaints', JSON.stringify(v));
    notify('complaints');
  },

  // ── Add a new complaint ──
  addComplaint(id, data) {
    const db = this.complaints;
    db[id] = data;
    this.complaints = db;
    return id;
  },

  // ── Update complaint step ──
  updateComplaintStep(id, step) {
    const db = this.complaints;
    if (db[id]) {
      db[id].step = step;
      this.complaints = db;
    }
  },

  // ── Add civic points ──
  addPoints(n) {
    this.points = this.points + n;
  }
};

/** Subscribe to store changes. Use key '*' for all. */
export function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, []);
  listeners.get(key).push(fn);
  return () => {
    const arr = listeners.get(key);
    const idx = arr.indexOf(fn);
    if (idx > -1) arr.splice(idx, 1);
  };
}

/** Apply theme to DOM */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.dataset.theme = theme;
  }
}

// Initialize theme on load
applyTheme(store.theme);

export default store;
