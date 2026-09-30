/* ═══════════════════════════════════════════════════════
   Smart City – Community Hub Page
   ═══════════════════════════════════════════════════════ */

import { $, el, observeReveal } from '../utils/dom.js';
import store, { subscribe } from '../store.js';
import t from '../i18n.js';
import { toastSuccess } from '../notifications.js';

const BADGES = [
  ['🌱 Reporter', 50],
  ['🛡️ Street Guardian', 200],
  ['🏙️ City Hero', 500]
];

const FEED_DATA = [
  { t: 'Deep pothole near City Mall', z: 'Zone 1', v: 42, s: 'In Progress', on: false },
  { t: 'Streetlight out on Lake Road', z: 'Zone 2', v: 31, s: 'Assigned', on: false },
  { t: 'Water leak at Old Town market', z: 'Zone 4', v: 27, s: 'Reported', on: false },
  { t: 'Overflowing bin at Bus Depot', z: 'Zone 3', v: 19, s: 'Reported', on: false },
  { t: 'Cracked road near Central Park', z: 'Zone 1', v: 15, s: 'Reported', on: false },
  { t: 'Garbage not collected in Block D', z: 'Zone 4', v: 12, s: 'Assigned', on: false }
];

const BINS = [
  { n: 'Bus Depot', l: 88 },
  { n: 'City Mall', l: 52 },
  { n: 'Riverside Park', l: 34 },
  { n: 'Tech Park', l: 71 },
  { n: 'Old Town Market', l: 93 }
];

export default {
  title: 'Community',

  render(container) {
    const timers = [];
    // Deep clone so page remounts reset state
    const feed = FEED_DATA.map(f => ({ ...f }));
    const bins = BINS.map(b => ({ ...b }));

    container.innerHTML = `
      <section id="community">
        <div class="wrapper">
          <div class="section-header reveal">
            <h2>${t('community.title')}</h2>
            <p class="section-subtitle">${t('community.subtitle')}</p>
          </div>

          <div class="grid-2">
            <!-- Issues Feed -->
            <div class="glass-static">
              <h3>${t('community.nearYou')}</h3>
              <div id="community-feed"></div>
            </div>

            <!-- Points & Bins -->
            <div>
              <div class="glass-static">
                <h3>${t('community.points')}: <span id="civic-points" class="gradient-text">${store.points}</span></h3>
                <div class="progress-bar">
                  <span class="progress-bar__fill" id="points-bar" style="width:0%;background:var(--success)"></span>
                </div>
                <p id="points-next" style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:var(--space-sm)"></p>
                <div id="badges-container" style="margin-top:var(--space-sm)"></div>
                <p style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:var(--space-sm)">${t('community.pointsInfo')}</p>
              </div>

              <div class="glass-static" style="margin-top:var(--space-lg)">
                <h3>${t('community.smartBins')}</h3>
                <div id="smart-bins"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // ── Community Feed ──
    function drawFeed() {
      const feedEl = container.querySelector('#community-feed');
      if (!feedEl) return;
      feedEl.innerHTML = '';

      feed.sort((a, b) => b.v - a.v).forEach(f => {
        const item = el('div', { className: 'issue-item' });
        item.innerHTML = `
          <div class="issue-item__content">
            <div class="issue-item__title">${f.t}</div>
            <div class="issue-item__meta">${f.z} · ${f.s}</div>
          </div>
        `;

        const btn = el('button', {
          className: 'upvote-btn' + (f.on ? ' voted' : ''),
          text: '▲ ' + f.v,
          attrs: { 'aria-label': 'Upvote: ' + f.t }
        });

        btn.onclick = () => {
          if (f.on) return;
          f.on = true;
          f.v++;
          store.addPoints(5);
          toastSuccess('+5 civic points for upvoting!');
          drawFeed();
          drawPoints();
        };

        item.append(btn);
        feedEl.append(item);
      });
    }

    // ── Points & Badges ──
    function drawPoints() {
      const pts = store.points;
      const ptsEl = container.querySelector('#civic-points');
      if (ptsEl) ptsEl.textContent = pts;

      const barEl = container.querySelector('#points-bar');
      const nextEl = container.querySelector('#points-next');
      const badgesEl = container.querySelector('#badges-container');

      const nextBadge = BADGES.find(b => pts < b[1]);
      if (barEl) {
        barEl.style.width = Math.min(100, pts / (nextBadge ? nextBadge[1] : pts) * 100) + '%';
      }
      if (nextEl) {
        nextEl.textContent = nextBadge
          ? `${nextBadge[1] - pts} points to unlock ${nextBadge[0]}`
          : 'All badges unlocked. Thank you! 🎉';
      }
      if (badgesEl) {
        badgesEl.innerHTML = BADGES.map(b =>
          `<span class="badge ${pts >= b[1] ? 'earned' : ''}">${b[0]}</span>`
        ).join('');
      }
    }

    // ── Smart Bins ──
    function drawBins() {
      const binsEl = container.querySelector('#smart-bins');
      if (!binsEl) return;

      binsEl.innerHTML = bins.map(b => {
        const color = b.l > 85 ? 'var(--danger)' : b.l > 65 ? 'var(--warning)' : 'var(--success)';
        return `
          <div style="margin:var(--space-sm) 0">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <small><b>${b.n}</b></small>
              <small style="color:var(--text-muted)">${b.l}% ${b.l > 85 ? t('community.dispatched') : ''}</small>
            </div>
            <div class="progress-bar" style="margin-top:4px">
              <span class="progress-bar__fill" style="width:${b.l}%;background:${color}"></span>
            </div>
          </div>
        `;
      }).join('');
    }

    // ── Initialize ──
    drawFeed();
    drawPoints();
    drawBins();

    // Live bin updates
    timers.push(setInterval(() => {
      bins.forEach(b => {
        b.l = b.l >= 100 ? 8 : Math.min(100, b.l + Math.floor(Math.random() * 4));
      });
      drawBins();
    }, 3000));

    // Listen for points changes from other pages
    const unsub = subscribe('points', () => drawPoints());

    observeReveal(container);

    return () => {
      timers.forEach(clearInterval);
      unsub();
    };
  }
};
