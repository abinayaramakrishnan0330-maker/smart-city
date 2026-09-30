/* ═══════════════════════════════════════════════════════
   Smart City – Home Page
   ═══════════════════════════════════════════════════════ */

import { $, el, countUp, observeReveal } from '../utils/dom.js';
import t from '../i18n.js';
import { createWeatherWidget } from '../components/weather.js';
import { withSkeleton } from '../components/skeleton.js';

export default {
  title: 'Home',

  async render(container) {
    const timers = [];

    // Ticker messages
    const TICKERS = [
      '🚦 Main Road congestion easing: avg speed up 12%',
      '🗑️ Truck 4 emptied 6 bins in Zone 2',
      '💧 Zone 3 water pressure back to normal',
      '🌳 Air quality good in Riverside Park (AQI 42)',
      '⚡ 3 EV chargers just became free near Tech Park',
      '✅ Streetlight on 5th Ave fixed in 3 hours'
    ];

    container.innerHTML = `
      <!-- Hero Section -->
      <header class="hero" id="home">
        <div class="wrapper hero__content">
          <h1 class="hero__title">${t('hero.title')}</h1>
          <p class="hero__subtitle">${t('hero.subtitle')}</p>

          <div id="weather-slot"></div>

          <div class="hero__buttons">
            <a class="btn btn-lg" href="#/report" style="color:#fff">${t('hero.cta1')}</a>
            <a class="btn btn-lg btn-outline" href="#/services" style="color:#fff;border-color:rgba(255,255,255,.35)">${t('hero.cta2')}</a>
          </div>

          <div class="hero__health glass-static" role="status">
            <div>
              <span class="hero__score" id="health-score">87</span>
              <span class="hero__score-label">${t('hero.healthScore')}</span>
            </div>
            <span class="hero__ticker" id="ticker">${t('hero.connecting')}</span>
          </div>
        </div>

        <svg class="hero__skyline" viewBox="0 0 1200 260" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#19c6d9" stop-opacity=".55"/>
              <stop offset="1" stop-color="#0a2f52"/>
            </linearGradient>
          </defs>
          <g fill="url(#gb)">
            <rect x="20" y="150" width="70" height="110" rx="2"/>
            <rect x="100" y="90" width="60" height="170" rx="2"/>
            <rect x="170" y="130" width="80" height="130" rx="2"/>
            <rect x="270" y="50" width="70" height="210" rx="2"/>
            <rect x="350" y="110" width="90" height="150" rx="2"/>
            <rect x="460" y="70" width="60" height="190" rx="2"/>
            <rect x="530" y="140" width="100" height="120" rx="2"/>
            <rect x="650" y="30" width="64" height="230" rx="2"/>
            <rect x="725" y="100" width="80" height="160" rx="2"/>
            <rect x="820" y="60" width="70" height="200" rx="2"/>
            <rect x="900" y="130" width="90" height="130" rx="2"/>
            <rect x="1000" y="80" width="60" height="180" rx="2"/>
            <rect x="1070" y="140" width="110" height="120" rx="2"/>
          </g>
          <g stroke="#2fbf71" stroke-width="1.5" fill="none" opacity=".8">
            <path d="M135 90L302 50L492 70L682 30L855 60L1030 80"/>
          </g>
          <g fill="#7fffd4">
            <circle class="pulse" cx="135" cy="90" r="6"/>
            <circle class="pulse" style="animation-delay:.4s" cx="302" cy="50" r="6"/>
            <circle class="pulse" style="animation-delay:.8s" cx="492" cy="70" r="6"/>
            <circle class="pulse" style="animation-delay:1.2s" cx="682" cy="30" r="6"/>
            <circle class="pulse" style="animation-delay:1.6s" cx="855" cy="60" r="6"/>
            <circle class="pulse" style="animation-delay:2s" cx="1030" cy="80" r="6"/>
          </g>
        </svg>
      </header>

      <!-- Stats Bar -->
      <div class="wrapper">
        <div class="stats-bar stagger-in" id="stats-bar"></div>
      </div>

      <!-- Quick Access Section -->
      <section class="section-alt">
        <div class="wrapper">
          <div class="section-header reveal">
            <h2>Quick Access</h2>
            <p class="section-subtitle">Jump to the most-used city services</p>
          </div>
          <div class="grid-auto stagger-in" id="quick-access"></div>
        </div>
      </section>
    `;

    // Weather widget
    const weatherSlot = container.querySelector('#weather-slot');
    weatherSlot.append(createWeatherWidget());

    // Stats
    const statsData = [
      ['24/7', t('stats.support')],
      ['500+', t('stats.resolved')],
      ['50+', t('stats.services')],
      ['Live', t('stats.updates')]
    ];

    const statsBar = container.querySelector('#stats-bar');
    statsData.forEach(([value, label]) => {
      const card = el('div', {
        className: 'glass',
        style: { textAlign: 'center' },
        html: `<span class="stats-bar__value gradient-text">${value}</span><span style="font-size:var(--fs-sm);color:var(--text-muted)">${label}</span>`
      });
      statsBar.append(card);
    });

    // Quick access
    const quickItems = [
      ['🛠️', t('nav.report'), 'Report potholes, garbage, and more', '#/report'],
      ['📊', t('nav.dashboard'), 'Live city operational data', '#/dashboard'],
      ['🗺️', t('nav.map'), 'Find hospitals, police, EV points', '#/map'],
      ['🤖', t('nav.ai'), 'Ask about any city service', '#/ai'],
      ['👤', t('nav.profile'), 'Track your complaints & points', '#/profile'],
      ['🚨', 'Emergency', 'Police, Fire, Ambulance', '#/services']
    ];

    const quickGrid = container.querySelector('#quick-access');
    quickItems.forEach(([icon, title, desc, href]) => {
      const card = el('a', {
        className: 'glass',
        attrs: { href, style: 'text-decoration:none;display:block' },
        html: `
          <div class="icon-circle" style="margin-bottom:var(--space-md)">${icon}</div>
          <div class="card__title">${title}</div>
          <div class="card__text">${desc}</div>
        `
      });
      quickGrid.append(card);
    });

    // Live ticker
    let tickerIdx = 0;
    const tickerEl = container.querySelector('#ticker');
    function tick() {
      tickerEl.style.opacity = '0';
      setTimeout(() => {
        tickerEl.textContent = TICKERS[tickerIdx++ % TICKERS.length];
        tickerEl.style.opacity = '1';
      }, 350);
    }
    tick();
    timers.push(setInterval(tick, 3600));

    // Health score fluctuation
    timers.push(setInterval(() => {
      const scoreEl = container.querySelector('#health-score');
      if (scoreEl) scoreEl.textContent = 85 + Math.floor(Math.random() * 6);
    }, 4000));

    // Reveal animations
    observeReveal(container);

    // Cleanup
    return () => {
      timers.forEach(clearInterval);
    };
  }
};
