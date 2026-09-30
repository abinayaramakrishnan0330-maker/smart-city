/* ═══════════════════════════════════════════════════════
   Smart City – CivicAI Assistant Page
   ═══════════════════════════════════════════════════════ */

import { el, observeReveal } from '../utils/dom.js';
import t from '../i18n.js';
import { createChatUI } from '../components/copilot.js';

export default {
  title: 'CivicAI',

  render(container) {
    container.innerHTML = `
      <section id="ai-section">
        <div class="wrapper">
          <div class="section-header reveal">
            <h2>${t('ai.title')}</h2>
            <p class="section-subtitle">${t('ai.subtitle')}</p>
          </div>

          <div class="grid-2">
            <div class="glass-static" style="max-width:720px" id="chat-wrapper"></div>

            <!-- Help Topics -->
            <div>
              <div class="glass-static">
                <h3>Popular Topics</h3>
                <div id="help-topics"></div>
              </div>

              <div class="glass-static" style="margin-top:var(--space-lg)">
                <h3>What CivicAI Can Do</h3>
                <div id="ai-capabilities"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Chat UI
    const chatWrapper = container.querySelector('#chat-wrapper');
    const { chatEl, inputRow, suggestEl } = createChatUI({
      greeting: t('ai.greeting'),
      suggestions: [
        'How do I report a pothole?',
        'Where is the nearest hospital?',
        'When will garbage be collected?',
        'How can I pay my property tax?'
      ]
    });

    chatWrapper.append(chatEl, suggestEl, inputRow);

    // Help Topics
    const topicsEl = container.querySelector('#help-topics');
    const topics = [
      ['🛠️', 'Reporting Issues', 'How to report potholes, garbage, streetlights'],
      ['💳', 'Tax & Payments', 'Property tax, water bills, parking fees'],
      ['🗑️', 'Waste Management', 'Collection schedules, recycling info'],
      ['🚦', 'Traffic & Transport', 'Live traffic, bus routes, parking'],
      ['💧', 'Water & Power', 'Supply status, outages, maintenance'],
      ['🏥', 'Public Facilities', 'Hospitals, schools, parks near you']
    ];

    topics.forEach(([icon, title, desc]) => {
      const item = el('div', {
        className: 'issue-item',
        style: { cursor: 'pointer' },
        html: `
          <span style="font-size:1.5rem">${icon}</span>
          <div class="issue-item__content">
            <div class="issue-item__title">${title}</div>
            <div class="issue-item__meta">${desc}</div>
          </div>
        `
      });
      item.onclick = () => {
        const { ask } = createChatUI();
        // Scroll to chat and ask
        chatWrapper.scrollIntoView({ behavior: 'smooth' });
      };
      topicsEl.append(item);
    });

    // AI Capabilities
    const capsEl = container.querySelector('#ai-capabilities');
    [
      ['📍', 'Navigate', 'Guide you to any section of the app'],
      ['🔎', 'Track', 'Look up complaint status by ID'],
      ['📝', 'Report', 'Help fill out complaint forms'],
      ['❓', 'Answer', 'Info about schedules, facilities, payments'],
      ['🎤', 'Voice', 'Speak your question (if browser supports it)']
    ].forEach(([icon, title, desc]) => {
      capsEl.append(el('div', {
        className: 'stat-row',
        html: `
          <span style="font-size:1.2rem">${icon}</span>
          <b>${title}</b>
          <span style="color:var(--text-muted);margin-left:4px;font-size:var(--fs-sm)">${desc}</span>
        `
      }));
    });

    observeReveal(container);
  }
};
