/* ═══════════════════════════════════════════════════════
   Smart City – Navigation Component
   ═══════════════════════════════════════════════════════ */

import { $, el } from '../utils/dom.js';
import store, { subscribe } from '../store.js';
import t from '../i18n.js';
import { supportedLangs } from '../i18n.js';
import { navigate } from '../router.js';

export function renderNav() {
  const nav = el('nav', { className: 'nav', attrs: { id: 'main-nav' } });

  function buildNav() {
    const user = store.user;
    const langs = supportedLangs();

    nav.innerHTML = `
      <div class="wrapper nav__inner">
        <a class="nav__logo" href="#/home" aria-label="Smart City Home">
          <span class="nav__logo-icon"></span>
          Smart City
        </a>

        <button class="nav__burger" id="burger" aria-label="Toggle menu" aria-expanded="false">☰</button>

        <div class="nav__links" id="nav-links">
          <a class="nav__link" href="#/home">${t('nav.home')}</a>
          <a class="nav__link" href="#/services">${t('nav.services')}</a>
          <a class="nav__link" href="#/report">${t('nav.report')}</a>
          <a class="nav__link" href="#/community">${t('nav.community')}</a>
          <a class="nav__link" href="#/dashboard">${t('nav.dashboard')}</a>
          <a class="nav__link" href="#/map">${t('nav.map')}</a>
          <a class="nav__link" href="#/ai">${t('nav.ai')}</a>
          <a class="nav__link" href="#/about">${t('nav.about')}</a>

          <div class="nav__actions">
            <div class="lang-picker">
              ${langs.map(l => `
                <button class="lang-picker__btn ${store.lang === l.code ? 'active' : ''}"
                        data-lang="${l.code}" aria-label="Switch to ${l.label}">
                  ${l.label}
                </button>
              `).join('')}
            </div>

            <button class="btn-icon btn-ghost" id="theme-toggle"
                    aria-label="Toggle dark/light theme" title="Toggle theme">
              ${store.theme === 'dark' ? '☀️' : store.theme === 'light' ? '🌙' : '◐'}
            </button>

            ${user
              ? `<a class="chip active" href="#/profile" style="color:#fff;text-decoration:none">
                   <span class="avatar" style="width:26px;height:26px;font-size:.7rem">${user.name.charAt(0).toUpperCase()}</span>
                   ${user.name.split(' ')[0]}
                 </a>`
              : `<a class="btn btn-sm" href="#/profile" style="color:#fff;text-decoration:none">${t('nav.login')}</a>`
            }
          </div>
        </div>
      </div>
    `;

    // Burger menu
    const burger = nav.querySelector('#burger');
    const links = nav.querySelector('#nav-links');
    burger.onclick = () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      burger.textContent = open ? '✕' : '☰';
    };

    // Close menu on link click
    links.addEventListener('click', e => {
      if (e.target.classList.contains('nav__link')) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.textContent = '☰';
      }
    });

    // Theme toggle
    const themeBtn = nav.querySelector('#theme-toggle');
    themeBtn.onclick = () => {
      const current = store.theme;
      if (current === 'dark') store.theme = 'light';
      else if (current === 'light') store.theme = 'system';
      else store.theme = 'dark';

      // Flash overlay
      const overlay = document.querySelector('.theme-transition');
      if (overlay) {
        overlay.classList.remove('active');
        void overlay.offsetWidth;
        overlay.classList.add('active');
      }
      buildNav();
    };

    // Language switcher
    nav.querySelectorAll('.lang-picker__btn').forEach(btn => {
      btn.onclick = () => {
        store.lang = btn.dataset.lang;
        buildNav();
        // Re-render current page
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      };
    });
  }

  buildNav();

  // Scroll shadow
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Re-build on user change
  const unsub = subscribe('user', () => buildNav());

  return { element: nav, cleanup: () => {
    window.removeEventListener('scroll', onScroll);
    unsub();
  }};
}

export default renderNav;
