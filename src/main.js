/* ═══════════════════════════════════════════════════════
   Smart City – Main Entry Point
   ═══════════════════════════════════════════════════════ */

import { $, el } from './utils/dom.js';
import { route, initRouter } from './router.js';
import store from './store.js';
import { renderNav } from './components/nav.js';
import { renderFooter } from './components/footer.js';
import { renderCopilot } from './components/copilot.js';

// ── Pages ──
import homePage from './pages/home.js';
import servicesPage from './pages/services.js';
import reportPage from './pages/report.js';
import communityPage from './pages/community.js';
import dashboardPage from './pages/dashboard.js';
import mapPage from './pages/map.js';
import aiPage from './pages/ai.js';
import profilePage from './pages/profile.js';
import aboutPage from './pages/about.js';

// ── Initialize App ──
function init() {
  const app = $('#app');
  if (!app) return;

  // ── Skip Link ──
  const skipLink = el('a', {
    className: 'skip-link',
    text: 'Skip to main content',
    attrs: { href: '#page-content' }
  });
  app.prepend(skipLink);

  // ── Navigation ──
  const { element: nav, cleanup: navCleanup } = renderNav();
  app.prepend(nav);
  // Move skip link before nav
  app.prepend(skipLink);

  // ── Theme Transition Overlay ──
  const themeOverlay = el('div', { className: 'theme-transition' });
  document.body.append(themeOverlay);

  // ── Page Content Container ──
  const pageContent = el('main', {
    attrs: { id: 'page-content', role: 'main', 'aria-label': 'Page content' }
  });
  app.append(pageContent);

  // ── Footer ──
  app.append(renderFooter());

  // ── SOS Button & Dialog ──
  const sosBtn = el('button', {
    className: 'sos-btn sos-pulse',
    text: 'SOS',
    attrs: { id: 'sos-btn', 'aria-label': 'Emergency SOS' }
  });

  const sosDialog = el('dialog', {
    attrs: { id: 'sos-dialog', 'aria-labelledby': 'sos-title' },
    html: `
      <h3 id="sos-title">🚨 Emergency Help</h3>
      <p style="color:var(--text-muted);margin-top:0;font-size:var(--fs-sm)">
        Tap a service to call. Share your location so responders can find you.
      </p>
      <a class="btn btn-lg" href="tel:100" style="display:block;text-align:center;margin:8px 0;color:#fff;background:var(--danger)">🛡️ Police · 100</a>
      <a class="btn btn-lg" href="tel:108" style="display:block;text-align:center;margin:8px 0;color:#fff">🚑 Ambulance · 108</a>
      <a class="btn btn-lg" href="tel:101" style="display:block;text-align:center;margin:8px 0;color:#fff;background:var(--warning)">🔥 Fire · 101</a>
      <a class="btn btn-lg" href="tel:1070" style="display:block;text-align:center;margin:8px 0;color:#fff;background:var(--accent)">🌊 Disaster · 1070</a>
      <button class="btn btn-lg btn-outline" id="share-location" style="width:100%;margin:8px 0">📍 Share my location</button>
      <p id="location-result" role="status" style="font-size:var(--fs-sm);color:var(--text-muted);min-height:1.5em"></p>
      <button class="chip" id="sos-close" style="margin-top:6px">Close</button>
    `
  });

  document.body.append(sosBtn, sosDialog);

  sosBtn.onclick = () => sosDialog.showModal();
  sosDialog.querySelector('#sos-close').onclick = () => sosDialog.close();
  sosDialog.querySelector('#share-location').onclick = () => {
    const resultEl = sosDialog.querySelector('#location-result');
    resultEl.textContent = 'Finding your location…';
    const done = (lat, lon) => {
      resultEl.textContent = `Location ready: ${lat.toFixed(4)}, ${lon.toFixed(4)}. In a live system this is sent to the control room.`;
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => done(p.coords.latitude, p.coords.longitude),
        () => done(13.0827, 80.2707)
      );
    } else {
      done(13.0827, 80.2707);
    }
  };

  // ── Civic Copilot ──
  const { fab, dialog } = renderCopilot();
  document.body.append(fab, dialog);

  // ── Register Routes ──
  route('home', homePage);
  route('services', servicesPage);
  route('report', reportPage);
  route('community', communityPage);
  route('dashboard', dashboardPage);
  route('map', mapPage);
  route('ai', aiPage);
  route('profile', profilePage);
  route('about', aboutPage);

  // ── Start Router ──
  initRouter();

  // ── PWA Install Prompt ──
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button in nav or as toast
    const installBtn = el('button', {
      className: 'chip',
      text: '📲 Install App',
      style: { position: 'fixed', bottom: '90px', right: '16px', zIndex: '60', boxShadow: 'var(--shadow-lg)' }
    });

    installBtn.onclick = async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') installBtn.remove();
      deferredPrompt = null;
    };

    document.body.append(installBtn);

    // Auto-remove after 15 seconds
    setTimeout(() => installBtn.remove(), 15000);
  });

  // ── Register Service Worker ──
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.log('SW registration failed:', err));
    });
  }

  console.log('🏙️ Smart City – Civic Life initialized');
}

// ── Boot ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
