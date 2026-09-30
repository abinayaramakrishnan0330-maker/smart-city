/* ═══════════════════════════════════════════════════════
   Smart City – Profile / Login Page
   ═══════════════════════════════════════════════════════ */

import { $, el, observeReveal } from '../utils/dom.js';
import store, { subscribe } from '../store.js';
import t from '../i18n.js';
import { toastSuccess, toastError } from '../notifications.js';
import { navigate } from '../router.js';

const BADGES = [
  ['🌱 Reporter', 50],
  ['🛡️ Street Guardian', 200],
  ['🏙️ City Hero', 500]
];

const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

export default {
  title: 'Profile',

  render(container) {
    const user = store.user;

    if (!user) {
      renderLogin(container);
    } else {
      renderProfile(container, user);
    }

    const unsub = subscribe('user', (u) => {
      if (u) renderProfile(container, u);
      else renderLogin(container);
    });

    return () => unsub();
  }
};

function renderLogin(container) {
  container.innerHTML = `
    <div class="login-page">
      <div class="glass-static login-card">
        <div class="login-card__title">
          <div class="avatar avatar-lg" style="margin:0 auto var(--space-lg)">🏙️</div>
          <h2>${t('profile.loginTitle')}</h2>
          <p class="section-subtitle" style="text-align:center">${t('profile.loginSubtitle')}</p>
        </div>

        <form id="login-form" novalidate>
          <label for="login-name">${t('profile.nameField')}</label>
          <input id="login-name" required autocomplete="name" placeholder="Arjun Kumar">
          <div class="error-msg" id="login-err-name"></div>

          <label for="login-email">${t('profile.emailField')}</label>
          <input id="login-email" type="email" required autocomplete="email" placeholder="arjun@example.com">
          <div class="error-msg" id="login-err-email"></div>

          <label for="login-pass">${t('profile.passwordField')}</label>
          <input id="login-pass" type="password" required autocomplete="current-password" placeholder="••••••••">
          <div class="error-msg" id="login-err-pass"></div>

          <button class="btn btn-lg" type="submit" style="width:100%;margin-top:var(--space-lg);color:#fff">
            ${t('profile.loginBtn')}
          </button>
        </form>

        <div class="login-card__divider">or</div>

        <button class="btn btn-lg btn-outline" id="guest-btn" style="width:100%">
          ${t('profile.guest')}
        </button>
      </div>
    </div>
  `;

  const form = container.querySelector('#login-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    let ok = true;

    const name = container.querySelector('#login-name').value.trim();
    const email = container.querySelector('#login-email').value.trim();
    const pass = container.querySelector('#login-pass').value;

    container.querySelector('#login-err-name').textContent = name.length < 2 ? (ok = false, 'Enter your name') : '';
    container.querySelector('#login-err-email').textContent = !/^\S+@\S+\.\S+$/.test(email) ? (ok = false, 'Enter a valid email') : '';
    container.querySelector('#login-err-pass').textContent = pass.length < 4 ? (ok = false, 'Enter a password') : '';

    if (!ok) return;

    store.user = {
      name,
      email,
      joinDate: new Date().toISOString(),
      avatar: name.charAt(0).toUpperCase()
    };

    toastSuccess(`Welcome, ${name.split(' ')[0]}! 🎉`);
  };

  container.querySelector('#guest-btn').onclick = () => {
    store.user = {
      name: 'Guest Citizen',
      email: 'guest@smartcity.in',
      joinDate: new Date().toISOString(),
      avatar: 'G'
    };
    toastSuccess('Signed in as Guest');
  };
}

function renderProfile(container, user) {
  const pts = store.points;
  const db = store.complaints;
  const myComplaints = Object.entries(db)
    .filter(([, d]) => d.name === user.name || d.contact === user.email)
    .sort((a, b) => new Date(b[1].date || 0) - new Date(a[1].date || 0));

  const allComplaints = Object.entries(db)
    .sort((a, b) => new Date(b[1].date || 0) - new Date(a[1].date || 0));

  container.innerHTML = `
    <section id="profile-section">
      <div class="wrapper">
        <!-- Profile Header -->
        <div class="profile-header reveal">
          <div class="avatar avatar-lg" style="font-size:2rem">${user.avatar || user.name.charAt(0).toUpperCase()}</div>
          <div class="profile-header__info">
            <h2 class="profile-header__name">${user.name}</h2>
            <p class="profile-header__email">${user.email}</p>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:4px">
              Member since ${new Date(user.joinDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button class="btn btn-outline" id="logout-btn">${t('profile.logout')}</button>
        </div>

        <!-- Stats -->
        <div class="profile-stats stagger-in">
          <div class="glass" style="text-align:center">
            <div class="profile-stat__value gradient-text">${pts}</div>
            <div class="profile-stat__label">Civic Points</div>
          </div>
          <div class="glass" style="text-align:center">
            <div class="profile-stat__value" style="color:var(--primary)">${allComplaints.length}</div>
            <div class="profile-stat__label">Complaints Filed</div>
          </div>
          <div class="glass" style="text-align:center">
            <div class="profile-stat__value" style="color:var(--success)">${allComplaints.filter(([, d]) => d.step >= 3).length}</div>
            <div class="profile-stat__label">Resolved</div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Badges -->
          <div class="glass-static reveal">
            <h3>${t('profile.badges')}</h3>
            <div style="margin-top:var(--space-md)">
              ${BADGES.map(([name, threshold]) => `
                <div style="display:flex;align-items:center;gap:var(--space-md);margin:var(--space-md) 0">
                  <span class="badge ${pts >= threshold ? 'earned' : ''}" style="font-size:1.2rem;padding:8px 16px">${name}</span>
                  <div style="flex:1">
                    <div class="progress-bar">
                      <span class="progress-bar__fill" style="width:${Math.min(100, (pts / threshold) * 100)}%;background:${pts >= threshold ? 'var(--success)' : 'var(--primary)'}"></span>
                    </div>
                    <small style="color:var(--text-muted)">${pts >= threshold ? '✅ Unlocked!' : `${threshold - pts} pts to go`}</small>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Complaints History -->
          <div class="glass-static reveal">
            <h3>${t('profile.complaints')}</h3>
            <div id="profile-complaints" style="margin-top:var(--space-md)">
              ${allComplaints.length === 0 ? '<p class="card__text">No complaints yet. Report an issue to get started!</p>' : ''}
              ${allComplaints.map(([id, d]) => `
                <div class="issue-item">
                  <div class="issue-item__content">
                    <div class="issue-item__title">${id} · ${d.cat}</div>
                    <div class="issue-item__meta">${d.zone || ''} · ${d.desc ? d.desc.substring(0, 40) + '...' : ''}</div>
                  </div>
                  <span class="tag" style="${d.step >= 3 ? 'background:var(--success-glow);color:var(--success)' : ''}">${STEPS[d.step] || 'Submitted'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  container.querySelector('#logout-btn').onclick = () => {
    store.user = null;
    toastSuccess('Logged out successfully');
  };

  observeReveal(container);
}
