/* ═══════════════════════════════════════════════════════
   Smart City – Smart Services Page
   ═══════════════════════════════════════════════════════ */

import { $, el, debounce, observeReveal } from '../utils/dom.js';
import t from '../i18n.js';

const SERVICES = [
  ['🛠️', 'Report Civic Issues', 'Report potholes, garbage, streetlights, water leaks and damaged roads with a photo and location. Status: Reported → In Progress → Resolved.', 'Issues'],
  ['🔎', 'Smart Complaint Tracking', 'Enter a complaint ID and follow every step on a live timeline.', 'Issues'],
  ['🚨', 'Emergency Services', 'Police 100 · Ambulance 108 · Fire 101 · Disaster Management 1070. One tap to call.', 'Safety'],
  ['🗑️', 'Smart Waste Management', 'Collection schedule: Zones 1–2 at 8:00 AM, Zones 3–4 at 10:30 AM. Report overflowing bins and find smart bins on the map.', 'Utilities'],
  ['🚦', 'Traffic & Transport', 'Live traffic: Main Road heavy. 14 bus routes running. 312 parking slots free. Bridge Road closed till 6 PM.', 'Mobility'],
  ['💧', 'Water & Electricity', 'Water supply normal in Zones 1, 2, 4. Maintenance in Zone 3 (10 AM–2 PM). Outage in Old Town Block C until 4 PM.', 'Utilities'],
  ['🏥', 'Public Facilities', 'Hospitals, schools, parks, libraries, toilets, bus stops and government offices on one map.', 'Facilities'],
  ['⭐', 'Citizen Feedback', 'Rate city services and tell us how we can improve.', 'Feedback'],
  ['🤖', 'AI Civic Assistant', 'CivicAI answers questions on services, tax payments, and nearby facilities.', 'Assistant'],
  ['💳', 'Property Tax Payment', 'Pay property tax online with your property ID. Due date: 31 March, with a 5% early-payment rebate.', 'Payments'],
  ['🅿️', 'Smart Parking', 'Find available parking spots in real-time. 312 slots currently free. Pre-book your spot.', 'Mobility'],
  ['🌳', 'Green Initiatives', 'Tree plantation drives, solar panel subsidies, and eco-friendly transport options.', 'Environment']
];

export default {
  title: 'Smart Services',

  render(container) {
    const categories = ['All', ...new Set(SERVICES.map(s => s[3]))];
    let activeCategory = 'All';
    let starRating = 0;

    container.innerHTML = `
      <section id="services">
        <div class="wrapper">
          <div class="section-header reveal">
            <h2>${t('services.title')}</h2>
            <p class="section-subtitle">${t('services.subtitle')}</p>
          </div>

          <div class="input-row" style="margin-bottom:var(--space-md)">
            <input id="service-search" placeholder="${t('services.search')}" aria-label="${t('services.search')}">
          </div>

          <div class="chips-container" id="service-cats"></div>
          <div class="grid-auto stagger-in" id="service-cards"></div>
        </div>
      </section>
    `;

    const catsEl = container.querySelector('#service-cats');
    const cardsEl = container.querySelector('#service-cards');
    const searchEl = container.querySelector('#service-search');

    // Build category chips
    categories.forEach(cat => {
      const chip = el('button', {
        className: 'chip' + (cat === 'All' ? ' active' : ''),
        text: cat === 'All' ? t('all') : cat,
        attrs: { 'aria-pressed': cat === 'All' ? 'true' : 'false' }
      });
      chip.onclick = () => {
        activeCategory = cat;
        catsEl.querySelectorAll('.chip').forEach(c => {
          c.classList.toggle('active', c === chip);
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });
        drawCards();
      };
      catsEl.append(chip);
    });

    function drawCards() {
      const query = searchEl.value.toLowerCase();
      cardsEl.innerHTML = '';

      const filtered = SERVICES.filter(s =>
        (activeCategory === 'All' || s[3] === activeCategory) &&
        (s[1] + s[2]).toLowerCase().includes(query)
      );

      if (!filtered.length) {
        cardsEl.append(el('p', {
          className: 'section-subtitle',
          text: t('services.noMatch')
        }));
        return;
      }

      filtered.forEach(s => {
        const card = el('article', {
          className: 'glass',
          html: `
            <div class="icon-circle" style="margin-bottom:var(--space-sm)">${s[0]}</div>
            <div class="card__title">${s[1]}</div>
            <p class="card__text">${s[2]}</p>
            <span class="tag">${s[3]}</span>
          `
        });

        // Special: Citizen Feedback gets star rating
        if (s[1] === 'Citizen Feedback') {
          const starsDiv = el('div', {
            attrs: { role: 'group', 'aria-label': 'Rate service' },
            style: { fontSize: '1.6rem', marginTop: 'var(--space-sm)' }
          });

          for (let i = 1; i <= 5; i++) {
            const star = el('button', {
              text: '☆',
              style: {
                background: 'none', border: '0', cursor: 'pointer',
                fontSize: 'inherit', color: 'var(--warning)', transition: 'transform 0.15s'
              },
              attrs: { 'aria-label': i + ' stars' }
            });
            star.onmouseenter = () => { star.style.transform = 'scale(1.3)'; };
            star.onmouseleave = () => { star.style.transform = 'scale(1)'; };
            star.onclick = () => {
              starRating = i;
              starsDiv.querySelectorAll('button').forEach((b, j) => {
                b.textContent = j < i ? '★' : '☆';
              });
              // Add feedback text
              if (!starsDiv.nextElementSibling?.classList?.contains('hint-msg')) {
                starsDiv.after(el('p', {
                  className: 'hint-msg',
                  text: `Thanks! You rated ${i}/5. ✨`
                }));
              } else {
                starsDiv.nextElementSibling.textContent = `Thanks! You rated ${i}/5. ✨`;
              }
            };
            starsDiv.append(star);
          }
          card.append(starsDiv);
        }

        // Special: Emergency Services gets call buttons
        if (s[1] === 'Emergency Services') {
          const callBtns = el('div', {
            className: 'flex flex-wrap gap-sm',
            style: { marginTop: 'var(--space-sm)' },
            html: `
              <a class="btn btn-sm btn-danger" href="tel:100" style="color:#fff">🛡️ 100</a>
              <a class="btn btn-sm" href="tel:108" style="color:#fff">🚑 108</a>
              <a class="btn btn-sm" href="tel:101" style="color:#fff;background:var(--warning)">🔥 101</a>
            `
          });
          card.append(callBtns);
        }

        cardsEl.append(card);
      });
    }

    searchEl.oninput = debounce(drawCards, 200);
    drawCards();
    observeReveal(container);
  }
};
