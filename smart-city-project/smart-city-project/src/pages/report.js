/* ═══════════════════════════════════════════════════════
   Smart City – Report Issue Page
   ═══════════════════════════════════════════════════════ */

import { $, el, observeReveal } from '../utils/dom.js';
import store from '../store.js';
import t from '../i18n.js';
import { toastSuccess, toastError } from '../notifications.js';

const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

const CAT_KW = {
  'Pothole': /pothole|hole|crater/,
  'Garbage': /garbage|trash|waste|bin|smell/,
  'Broken streetlight': /light|lamp|dark/,
  'Water leakage': /water|leak|pipe|burst/,
  'Damaged road': /road|crack|broken road/
};

function timelineHTML(step) {
  return `<div class="timeline">${STEPS.map((s, i) =>
    `<div class="timeline__step ${i <= step ? 'active' : ''}">${s}</div>`
  ).join('')}</div>`;
}

export default {
  title: 'Report Issue',

  render(container) {
    const timers = [];

    container.innerHTML = `
      <section class="section-alt" id="report">
        <div class="wrapper">
          <div class="section-header reveal">
            <h2>${t('report.title')}</h2>
            <p class="section-subtitle">${t('report.subtitle')}</p>
          </div>

          <div class="grid-2">
            <!-- Report Form -->
            <form class="glass-static" id="report-form" novalidate>
              <label for="report-name">${t('report.name')}</label>
              <input id="report-name" autocomplete="name">
              <div class="error-msg" id="err-name"></div>

              <label for="report-contact">${t('report.contact')}</label>
              <input id="report-contact" autocomplete="email">
              <div class="error-msg" id="err-contact"></div>

              <label for="issue-category">${t('report.category')}</label>
              <select id="issue-category">
                <option value="">${t('report.chooseCat')}</option>
                <option>Pothole</option>
                <option>Garbage</option>
                <option>Broken streetlight</option>
                <option>Water leakage</option>
                <option>Damaged road</option>
                <option>Other</option>
              </select>
              <div class="error-msg" id="err-category"></div>

              <label for="report-desc">${t('report.desc')}</label>
              <textarea id="report-desc" rows="3"></textarea>
              <div class="hint-msg" id="ai-hint"></div>
              <div class="error-msg" id="err-desc"></div>

              <label for="report-location">${t('report.location')}</label>
              <select id="report-location">
                <option value="">${t('report.selectLoc')}</option>
                <option>${t('zone.1')}</option>
                <option>${t('zone.2')}</option>
                <option>${t('zone.3')}</option>
                <option>${t('zone.4')}</option>
              </select>
              <div class="error-msg" id="err-location"></div>

              <label for="report-photo">${t('report.upload')}</label>
              <input id="report-photo" type="file" accept="image/*">
              <div style="height:12px"></div>

              <button class="btn btn-lg" type="submit" style="width:100%;color:#fff">${t('report.submit')}</button>
              <div id="report-result" role="status" aria-live="polite" style="margin-top:var(--space-md)"></div>
            </form>

            <!-- Track Complaint -->
            <div>
              <div class="glass-static">
                <h3>${t('report.track')}</h3>
                <p class="section-subtitle" style="margin-bottom:var(--space-sm);font-size:var(--fs-sm)">${t('report.trackHint')}</p>
                <div class="input-row">
                  <input id="track-id" placeholder="${t('report.enterId')}" aria-label="${t('report.enterId')}">
                  <button class="btn" id="track-btn">${t('report.trackBtn')}</button>
                </div>
                <div id="track-result" style="margin-top:var(--space-md)"></div>
              </div>

              <!-- Recent Complaints Preview -->
              <div class="glass-static" style="margin-top:var(--space-lg)">
                <h3>Recent Complaints</h3>
                <div id="recent-complaints"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    const form = container.querySelector('#report-form');
    const descField = container.querySelector('#report-desc');
    const hintEl = container.querySelector('#ai-hint');

    // AI auto-category detection
    descField.oninput = () => {
      const text = descField.value.toLowerCase();
      const match = Object.keys(CAT_KW).find(k => CAT_KW[k].test(text));
      hintEl.textContent = match ? `✨ CivicAI suggests: ${match}` : '';
      const catSel = container.querySelector('#issue-category');
      if (match && !catSel.value) catSel.value = match;
    };

    // Pre-fill from user profile
    const user = store.user;
    if (user) {
      container.querySelector('#report-name').value = user.name || '';
      container.querySelector('#report-contact').value = user.email || '';
    }

    // Form submission
    form.onsubmit = (e) => {
      e.preventDefault();
      let ok = true;

      const check = (id, field, bad, msg) => {
        container.querySelector('#err-' + id).textContent = bad ? msg : '';
        if (bad) ok = false;
      };

      const name = container.querySelector('#report-name').value.trim();
      const contact = container.querySelector('#report-contact').value.trim();
      const cat = container.querySelector('#issue-category').value;
      const desc = container.querySelector('#report-desc').value.trim();
      const loc = container.querySelector('#report-location').value;

      check('name', 'report-name', name.length < 2, t('report.errName'));
      check('contact', 'report-contact',
        !(/^\S+@\S+\.\S+$/.test(contact) || /^\+?\d{10,13}$/.test(contact)),
        t('report.errContact'));
      check('category', 'issue-category', !cat, t('report.errCat'));
      check('desc', 'report-desc', desc.length < 10, t('report.errDesc'));
      check('location', 'report-location', !loc, t('report.errLoc'));

      if (!ok) return;

      const id = 'CL-' + (1100 + Math.floor(Math.random() * 900));
      store.addComplaint(id, {
        cat, desc, zone: loc, step: 0,
        date: new Date().toISOString(),
        name, contact
      });

      const resultEl = container.querySelector('#report-result');
      resultEl.innerHTML = `
        <div class="success-box">
          <b>${t('report.success')}</b><br>
          ${t('report.complaintId')}: <b>${id}</b>
          ${timelineHTML(0)}
        </div>
      `;

      // Animate progress
      let step = 0;
      const progressTimer = setInterval(() => {
        step++;
        store.updateComplaintStep(id, step);
        const tlEl = resultEl.querySelector('.timeline');
        if (tlEl) tlEl.outerHTML = timelineHTML(step);
        if (step >= 3) clearInterval(progressTimer);
      }, 2500);
      timers.push(progressTimer);

      form.reset();
      hintEl.textContent = '';
      store.addPoints(50);
      toastSuccess(`Complaint ${id} registered! +50 civic points`);
      renderRecent();
    };

    // Track button
    container.querySelector('#track-btn').onclick = () => {
      const idInput = container.querySelector('#track-id').value.trim().toUpperCase();
      const db = store.complaints;
      const d = db[idInput];
      const resultEl = container.querySelector('#track-result');

      if (d) {
        resultEl.innerHTML = `
          <div class="glass" style="margin-top:var(--space-sm)">
            <b>${idInput}</b> · ${d.cat}
            <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:4px">
              ${d.desc || ''} · ${d.zone || ''}
            </div>
            ${timelineHTML(d.step)}
          </div>
        `;
      } else {
        resultEl.innerHTML = `<span class="error-msg" style="font-size:var(--fs-sm)">${t('report.notFound')}</span>`;
      }
    };

    // Allow Enter key on track input
    container.querySelector('#track-id').onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        container.querySelector('#track-btn').click();
      }
    };

    // Recent complaints
    function renderRecent() {
      const recentEl = container.querySelector('#recent-complaints');
      const db = store.complaints;
      const entries = Object.entries(db).sort((a, b) =>
        new Date(b[1].date || 0) - new Date(a[1].date || 0)
      ).slice(0, 5);

      if (!entries.length) {
        recentEl.innerHTML = '<p class="card__text">No complaints yet.</p>';
        return;
      }

      recentEl.innerHTML = entries.map(([id, d]) => `
        <div class="issue-item">
          <div class="issue-item__content">
            <div class="issue-item__title">${id} · ${d.cat}</div>
            <div class="issue-item__meta">${d.zone || ''} · ${STEPS[d.step] || 'Submitted'}</div>
          </div>
          <span class="tag">${STEPS[d.step] || 'Submitted'}</span>
        </div>
      `).join('');
    }

    renderRecent();
    observeReveal(container);

    return () => { timers.forEach(clearInterval); };
  }
};
