/* ═══════════════════════════════════════════════════════
   Smart City – About Page
   ═══════════════════════════════════════════════════════ */

import { el, observeReveal } from '../utils/dom.js';
import t from '../i18n.js';

const TECH_STACK = [
  ['🧠', 'Artificial Intelligence', 'Chat assistance, complaint routing, and demand forecasting.'],
  ['📡', 'Internet of Things', 'Connected bins, lights, and meters report their own status.'],
  ['☁️', 'Cloud Computing', 'Scalable, secure hosting for city services.'],
  ['📊', 'Data Analytics', 'Dashboards that show where the city needs attention.'],
  ['📍', 'GPS & Maps', 'Exact issue locations and nearby facilities.'],
  ['🌡️', 'Smart Sensors', 'Air, water, noise and traffic monitoring.'],
  ['📱', 'Mobile/Web Apps', 'One platform on every phone, tablet and desktop.'],
  ['🔒', 'Cybersecurity', 'End-to-end encryption and privacy-first architecture.'],
  ['♻️', 'Sustainability', 'Smart energy grids, green buildings, EV infrastructure.']
];

const TEAM = [
  ['👩‍💻', 'Priya Sharma', 'Lead Developer', 'Full-stack architecture and AI integration'],
  ['👨‍🔬', 'Arjun Patel', 'IoT Engineer', 'Sensor networks and real-time data pipelines'],
  ['👩‍🎨', 'Meera Krishnan', 'UX Designer', 'Citizen-first design and accessibility'],
  ['👨‍💼', 'Rahul Gupta', 'Project Lead', 'Strategy, partnerships, and city coordination']
];

export default {
  title: 'About',

  render(container) {
    container.innerHTML = `
      <section class="section-alt" id="about-section">
        <div class="wrapper">
          <div class="section-header reveal">
            <h2>${t('about.title')}</h2>
            <p class="section-subtitle">${t('about.subtitle')}</p>
          </div>

          <!-- Mission -->
          <div class="glass-static reveal" style="margin-bottom:var(--space-xl)">
            <h3>Our Mission</h3>
            <p style="font-size:var(--fs-md);line-height:1.8;max-width:none">
              We envision a city where every citizen has a voice, every issue gets resolved swiftly,
              and technology bridges the gap between people and government. Smart City – Civic Life
              is our step towards building transparent, responsive, and efficient urban governance.
            </p>
          </div>

          <!-- Tech Stack -->
          <h3 class="reveal" style="margin-bottom:var(--space-lg)">Technology Stack</h3>
          <div class="grid-auto stagger-in" id="tech-grid"></div>

          <!-- Team -->
          <h3 class="reveal" style="margin:var(--space-2xl) 0 var(--space-lg)">The Team</h3>
          <div class="grid-4 stagger-in" id="team-grid"></div>

          <!-- Impact Numbers -->
          <div class="glass-static reveal" style="margin-top:var(--space-2xl)">
            <h3 style="text-align:center;margin-bottom:var(--space-lg)">Our Impact</h3>
            <div class="grid-4" style="text-align:center">
              <div>
                <span class="kpi-value gradient-text">50+</span>
                <div class="kpi-label">Smart Services</div>
              </div>
              <div>
                <span class="kpi-value" style="color:var(--success)">1200+</span>
                <div class="kpi-label">Issues Resolved</div>
              </div>
              <div>
                <span class="kpi-value" style="color:var(--accent)">4</span>
                <div class="kpi-label">City Zones Covered</div>
              </div>
              <div>
                <span class="kpi-value" style="color:var(--warning)">24/7</span>
                <div class="kpi-label">Citizen Support</div>
              </div>
            </div>
          </div>

          <!-- Open Source Note -->
          <div class="glass-static reveal" style="margin-top:var(--space-xl);text-align:center">
            <p style="font-size:var(--fs-md);margin-bottom:var(--space-md)">
              🌟 Built with ❤️ for smarter, happier cities
            </p>
            <p style="color:var(--text-muted);font-size:var(--fs-sm);max-width:none">
              This project demonstrates how modern web technologies — glassmorphism design,
              real-time IoT data, AI assistants, and progressive web apps — can transform
              civic governance for millions of citizens.
            </p>
          </div>
        </div>
      </section>
    `;

    // Tech Stack Grid
    const techGrid = container.querySelector('#tech-grid');
    TECH_STACK.forEach(([icon, title, desc]) => {
      techGrid.append(el('div', {
        className: 'glass',
        html: `
          <div class="icon-circle" style="margin-bottom:var(--space-sm)">${icon}</div>
          <div class="card__title">${title}</div>
          <p class="card__text">${desc}</p>
        `
      }));
    });

    // Team Grid
    const teamGrid = container.querySelector('#team-grid');
    TEAM.forEach(([avatar, name, role, desc]) => {
      teamGrid.append(el('div', {
        className: 'glass',
        style: { textAlign: 'center' },
        html: `
          <div class="avatar" style="margin:0 auto var(--space-md);font-size:1.5rem;width:56px;height:56px">${avatar}</div>
          <div class="card__title">${name}</div>
          <div class="tag" style="margin-bottom:var(--space-sm)">${role}</div>
          <p class="card__text" style="text-align:center">${desc}</p>
        `
      }));
    });

    observeReveal(container);
  }
};
