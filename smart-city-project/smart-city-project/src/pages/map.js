/* ═══════════════════════════════════════════════════════
   Smart City – Interactive Map Page
   ═══════════════════════════════════════════════════════ */

import { $, el, observeReveal } from '../utils/dom.js';
import t from '../i18n.js';

const NS = 'http://www.w3.org/2000/svg';

const FACILITY_TYPES = {
  'Hospital':     ['🏥', '#e5484d'],
  'Police':       ['🛡️', '#1d6fe8'],
  'Fire':         ['🔥', '#f5a524'],
  'School':       ['🏫', '#8b5cf6'],
  'Park':         ['🌳', '#2fbf71'],
  'Bus stop':     ['🚌', '#12b8d0'],
  'EV charging':  ['⚡', '#84cc16'],
  'Garbage bin':  ['🗑️', '#94a3b8'],
  'Parking':      ['🅿️', '#3b82f6']
};

// Generate deterministic marker positions
const MARKERS = [];
Object.keys(FACILITY_TYPES).forEach((type, i) => {
  for (let j = 0; j < 3; j++) {
    MARKERS.push({
      type,
      x: 60 + ((i * 137 + j * 251) % 680),
      y: 50 + ((i * 89 + j * 173) % 320),
      name: `${type} #${j + 1}`,
      info: ['Open 24/7', 'Open 8 AM–8 PM', 'Status: available', 'Updated 2 min ago'][(i + j) % 4]
    });
  }
});

const NOTIFICATIONS = [
  ['🚦', 'Heavy traffic reported on Main Road.', '5 min ago'],
  ['🗑️', 'Garbage collection scheduled for 8:00 AM.', '30 min ago'],
  ['💧', 'Water maintenance planned in Zone 3.', '1 hr ago'],
  ['📢', 'New public service announcement available.', '2 hr ago'],
  ['⚡', 'EV charger at Tech Park now available.', '3 hr ago']
];

export default {
  title: 'Map',

  render(container) {
    const visibleTypes = new Set(Object.keys(FACILITY_TYPES));
    const layers = { traffic: true, air: false };
    let zoom = 1;
    let panX = 0, panY = 0;
    let isPanning = false, startX = 0, startY = 0;

    container.innerHTML = `
      <section class="section-alt" id="map-section">
        <div class="wrapper">
          <div class="section-header reveal">
            <h2>${t('map.title')}</h2>
            <p class="section-subtitle">${t('map.subtitle')}</p>
          </div>

          <!-- Layer toggles -->
          <div class="chips-container" id="layer-chips"></div>

          <!-- Facility filter chips -->
          <div class="chips-container" id="facility-chips"></div>

          <!-- Map Container -->
          <div class="map-container" style="position:relative">
            <svg id="city-map" class="map-svg" viewBox="0 0 800 420" role="img"
                 aria-label="Interactive city map"></svg>

            <!-- Zoom Controls -->
            <div class="map-controls">
              <button class="map-zoom-btn" id="zoom-in" aria-label="Zoom in">+</button>
              <button class="map-zoom-btn" id="zoom-out" aria-label="Zoom out">−</button>
              <button class="map-zoom-btn" id="zoom-reset" aria-label="Reset view" style="font-size:.8rem">⟲</button>
            </div>
          </div>

          <!-- Info Panel -->
          <div class="glass-static" id="map-info" style="margin-top:var(--space-md)">
            ${t('map.selectMarker')}
          </div>

          <!-- Notifications -->
          <div class="glass-static" style="margin-top:var(--space-lg)">
            <h3>${t('map.notifications')}</h3>
            <div id="map-notifications"></div>
          </div>
        </div>
      </section>
    `;

    // ── Layer Chips ──
    const layerChips = container.querySelector('#layer-chips');
    [['traffic', t('map.traffic')], ['air', t('map.air')]].forEach(([key, label]) => {
      const chip = el('button', {
        className: 'chip' + (layers[key] ? ' active' : ''),
        text: label,
        attrs: { 'aria-pressed': String(layers[key]) }
      });
      chip.onclick = () => {
        layers[key] = !layers[key];
        chip.classList.toggle('active', layers[key]);
        chip.setAttribute('aria-pressed', String(layers[key]));
        drawMap();
      };
      layerChips.append(chip);
    });

    // ── Facility Filter Chips ──
    const facilityChips = container.querySelector('#facility-chips');
    Object.keys(FACILITY_TYPES).forEach(type => {
      const [emoji, color] = FACILITY_TYPES[type];
      const chip = el('button', {
        className: 'chip active',
        text: `${emoji} ${type}`,
        attrs: { 'aria-pressed': 'true' }
      });
      chip.onclick = () => {
        if (visibleTypes.has(type)) visibleTypes.delete(type);
        else visibleTypes.add(type);
        chip.classList.toggle('active', visibleTypes.has(type));
        chip.setAttribute('aria-pressed', String(visibleTypes.has(type)));
        drawMap();
      };
      facilityChips.append(chip);
    });

    // ── Map Drawing ──
    function drawMap() {
      const mapEl = container.querySelector('#city-map');
      if (!mapEl) return;

      // Calculate viewBox with zoom and pan
      const vw = 800 / zoom;
      const vh = 420 / zoom;
      const vx = Math.max(0, Math.min(800 - vw, panX));
      const vy = Math.max(0, Math.min(420 - vh, panY));
      mapEl.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);

      mapEl.innerHTML = '';

      // Roads
      const roads = document.createElementNS(NS, 'g');
      roads.setAttribute('stroke', '#ffffff22');
      roads.setAttribute('stroke-width', '10');
      roads.setAttribute('fill', 'none');
      roads.innerHTML = '<path d="M0 200H800"/><path d="M400 0V420"/><path d="M0 60L800 340"/><path d="M120 0L300 420"/>';
      mapEl.append(roads);

      // Water
      const water = document.createElementNS(NS, 'path');
      water.setAttribute('d', 'M0 330Q200 280 400 340T800 300V420H0Z');
      water.setAttribute('fill', '#19c6d955');
      mapEl.append(water);

      // Layers
      const layerG = document.createElementNS(NS, 'g');
      let layerHTML = '';

      if (layers.traffic) {
        layerHTML += `<g stroke-width="6" fill="none" stroke-linecap="round">
          <path d="M0 200H400" stroke="#e5484d"/>
          <path d="M400 200H800" stroke="#f5a524"/>
          <path d="M400 0V420" stroke="#2fbf71"/>
          <path d="M0 60L800 340" stroke="#f5a524" stroke-dasharray="14 10">
            <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="2s" repeatCount="indefinite"/>
          </path>
        </g>`;
      }

      if (layers.air) {
        [[150, 110, 42, '#2fbf71'], [600, 120, 88, '#f5a524'], [450, 320, 135, '#e5484d'], [130, 320, 55, '#2fbf71']]
          .forEach(([cx, cy, aqi, color]) => {
            layerHTML += `<circle cx="${cx}" cy="${cy}" r="70" fill="${color}" opacity=".3" style="pointer-events:none"/>
              <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Inter,sans-serif">AQI ${aqi}</text>`;
          });
      }

      layerG.innerHTML = layerHTML;
      mapEl.append(layerG);

      // Markers
      MARKERS.filter(m => visibleTypes.has(m.type)).forEach(m => {
        const [emoji, color] = FACILITY_TYPES[m.type];
        const g = document.createElementNS(NS, 'g');
        g.innerHTML = `
          <circle cx="${m.x}" cy="${m.y}" r="11" fill="${color}" stroke="#fff" stroke-width="2"
                  tabindex="0" role="button" aria-label="${m.name}"/>
          <text x="${m.x}" y="${m.y + 4}" font-size="11" text-anchor="middle" pointer-events="none">${emoji}</text>
        `;

        const select = () => {
          const infoEl = container.querySelector('#map-info');
          if (infoEl) {
            infoEl.innerHTML = `
              <div style="display:flex;gap:var(--space-md);align-items:center">
                <div class="icon-circle" style="background:${color}30">${emoji}</div>
                <div>
                  <b>${m.name}</b><br>
                  <span style="color:var(--text-muted);font-size:var(--fs-sm)">${m.info} · Zone ${1 + (m.x % 4)}</span>
                </div>
              </div>
            `;
          }
        };

        g.onclick = select;
        g.onkeydown = e => { if (e.key === 'Enter') select(); };
        mapEl.append(g);
      });
    }

    // ── Zoom Controls ──
    container.querySelector('#zoom-in').onclick = () => {
      zoom = Math.min(3, zoom + 0.3);
      drawMap();
    };
    container.querySelector('#zoom-out').onclick = () => {
      zoom = Math.max(0.5, zoom - 0.3);
      drawMap();
    };
    container.querySelector('#zoom-reset').onclick = () => {
      zoom = 1; panX = 0; panY = 0;
      drawMap();
    };

    // ── Pan Support ──
    const mapSvg = container.querySelector('#city-map');
    mapSvg.addEventListener('mousedown', e => {
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      mapSvg.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', handlePanMove);
    document.addEventListener('mouseup', handlePanEnd);

    function handlePanMove(e) {
      if (!isPanning) return;
      const dx = (startX - e.clientX) / zoom;
      const dy = (startY - e.clientY) / zoom;
      panX += dx;
      panY += dy;
      startX = e.clientX;
      startY = e.clientY;
      drawMap();
    }

    function handlePanEnd() {
      isPanning = false;
      if (mapSvg) mapSvg.style.cursor = 'grab';
    }

    // Mouse wheel zoom
    mapSvg.addEventListener('wheel', e => {
      e.preventDefault();
      zoom = Math.max(0.5, Math.min(3, zoom + (e.deltaY > 0 ? -0.15 : 0.15)));
      drawMap();
    }, { passive: false });

    // ── Notifications ──
    const notifsEl = container.querySelector('#map-notifications');
    NOTIFICATIONS.forEach(([icon, text, time]) => {
      notifsEl.append(el('div', {
        className: 'notif-item',
        html: `
          <span class="notif-item__icon">${icon}</span>
          <div>
            <b>${text}</b><br>
            <span class="notif-item__time">${time}</span>
          </div>
        `
      }));
    });

    drawMap();
    observeReveal(container);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    };
  }
};
