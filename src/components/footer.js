/* ═══════════════════════════════════════════════════════
   Smart City – Footer Component
   ═══════════════════════════════════════════════════════ */

import { el } from '../utils/dom.js';
import t from '../i18n.js';

export function renderFooter() {
  const footer = el('footer', { className: 'footer' });

  footer.innerHTML = `
    <div class="wrapper">
      <div class="footer__grid">
        <div>
          <h4>Smart City – Civic Life</h4>
          <p>${t('footer.tagline')}</p>
          <div class="footer__social">
            <span title="Twitter">🐦</span>
            <span title="Facebook">📘</span>
            <span title="Instagram">📸</span>
            <span title="YouTube">▶️</span>
          </div>
        </div>
        <div>
          <h4>${t('footer.quickLinks')}</h4>
          <a href="#/services">${t('nav.services')}</a>
          <a href="#/report">${t('nav.report')}</a>
          <a href="#/dashboard">${t('nav.dashboard')}</a>
          <a href="#/ai">${t('nav.ai')}</a>
        </div>
        <div>
          <h4>${t('footer.emergency')}</h4>
          <a href="tel:100">Police 100</a>
          <a href="tel:108">Ambulance 108</a>
          <a href="tel:101">Fire 101</a>
          <a href="tel:1070">Disaster Mgmt 1070</a>
        </div>
        <div>
          <h4>${t('footer.citizenSvcs')}</h4>
          <a href="#/services">Property tax</a>
          <a href="#/services">Waste schedule</a>
          <a href="#/services">Feedback</a>
          <a href="#/profile">${t('nav.profile')}</a>
        </div>
      </div>
      <div class="footer__bottom">
        © 2026 Smart City – Civic Life ·
        <a href="#">${t('footer.privacy')}</a> ·
        <a href="#">${t('footer.terms')}</a>
      </div>
    </div>
  `;

  return footer;
}

export default renderFooter;
