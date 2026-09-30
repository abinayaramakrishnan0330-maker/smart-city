/* ═══════════════════════════════════════════════════════
   Smart City – Civic Copilot Component
   ═══════════════════════════════════════════════════════ */

import { $, el } from '../utils/dom.js';
import store from '../store.js';
import t from '../i18n.js';

// Complaint category keywords
const CAT_KW = {
  'Pothole': /pothole|hole|crater|dangerous.*(road|vehicle)/i,
  'Garbage': /garbage|trash|waste|bin|dump|smell/i,
  'Broken streetlight': /light|lamp|dark|street\s?light/i,
  'Water leakage': /water|leak|pipe|burst|sewage/i,
  'Damaged road': /road|crack|damaged road|broken road/i
};

// Feature navigation keywords
const FEAT_KW = [
  [/dashboard|stat(s|istics)|kpi/, 'dashboard', 'the City Dashboard, showing live complaint counts, waste, traffic and utility status'],
  [/map|hospital|police station|nearby|facilit/, 'map', 'the Smart City Map with hospitals, police, EV points and more'],
  [/tax/, 'services', 'Citizen Services under Smart Services, where property tax payment is listed'],
  [/traffic|parking|bus/, 'services', 'the Traffic & Transport card under Smart Services'],
  [/garbage.*schedule|collection time/, 'services', 'the Smart Waste Management card'],
  [/feedback|rate/, 'services', 'the Citizen Feedback card'],
  [/emergency|police|ambulance|fire/, 'services', 'Emergency Services — or tap the red SOS button anytime'],
  [/profile|account|login/, 'profile', 'your Profile page'],
  [/weather|temperature/, 'home', 'the Home page where weather data is displayed'],
  [/report|complain/, 'report', 'the Report Issue page']
];

// Complaint timeline steps
const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

function timelineHTML(step) {
  return `<div class="timeline">${STEPS.map((s, i) =>
    `<div class="timeline__step ${i <= step ? 'active' : ''}">${t('step.' + s.replace(/ /g, '').charAt(0).toLowerCase() + s.replace(/ /g, '').slice(1)) || s}</div>`
  ).join('')}</div>`;
}

function copilotReply(qRaw) {
  const q = qRaw.toLowerCase();

  // Complaint ID lookup
  const idm = qRaw.match(/CL-?\s?\d{3,4}/i);
  if (idm) {
    const id = idm[0].toUpperCase().replace(/\s/g, '').replace('CL', 'CL-').replace('CL--', 'CL-');
    const db = store.complaints;
    const d = db[id];
    if (d) return { html: `Complaint <b>${id}</b> · ${d.cat}${timelineHTML(d.step)}` };
    return { text: `I couldn't find ${id}. Double-check the ID, or ask me to report a new issue.` };
  }

  // Category detection
  const cat = Object.keys(CAT_KW).find(k => CAT_KW[k].test(q));
  if (cat) {
    return {
      text: `I understand this is a civic issue (${cat}). Would you like to report it? I can guide you through location, photo upload and complaint submission.`,
      cta: ['Report this issue', () => {
        window.location.hash = '#/report';
        setTimeout(() => {
          const sel = document.querySelector('#issue-category');
          if (sel) sel.value = cat;
        }, 500);
      }]
    };
  }

  // Report intent
  if (/report|complain|file|submit/.test(q)) {
    return {
      text: 'Sure — tell me what the problem is (like "garbage not collected" or "streetlight broken") and I\'ll pick the right category, or open the form directly for you.',
      cta: ['Open report form', () => { window.location.hash = '#/report'; }]
    };
  }

  // Status tracking
  if (/status|track|progress/.test(q)) {
    return { text: 'Share your complaint ID (e.g. CL-1042) and I\'ll pull up its live status.' };
  }

  // Feature navigation
  const feat = FEAT_KW.find(f => f[0].test(q));
  if (feat) {
    return {
      text: `That's covered in ${feat[2]}.`,
      cta: ['Take me there', () => { window.location.hash = '#/' + feat[1]; }]
    };
  }

  // Greeting
  if (/^(hi|hello|hey|namaste|vanakkam)/i.test(q)) {
    return { text: "Hi! I'm Civic Copilot. Describe a problem, ask about a service, or give me a complaint ID to track." };
  }

  // Default
  return {
    text: "I can understand a civic complaint, check a complaint's status, guide you to any app feature, or start the report workflow. Try describing an issue, or ask 'where is the dashboard?'"
  };
}

/**
 * Create a chat interface (used in both CivicAI section and Copilot dialog).
 * @param {object} opts
 * @param {string} opts.greeting - initial message
 * @param {string[]} opts.suggestions
 * @returns {{ container, chatEl, inputEl, suggestEl, ask, cleanup }}
 */
export function createChatUI(opts = {}) {
  const {
    greeting = t('copilot.greeting'),
    suggestions = ['Track CL-1042', 'Where is the dashboard?', 'I found a pothole on Main Road']
  } = opts;

  const chatEl = el('div', { className: 'chat-container', attrs: { 'aria-live': 'polite' } });
  const suggestEl = el('div', { className: 'chips-container', style: { marginTop: '10px' } });
  const inputEl = el('input', { attrs: { placeholder: t('ai.placeholder'), 'aria-label': t('ai.placeholder') } });
  const sendBtn = el('button', { className: 'btn', text: t('ai.send') });
  const inputRow = el('div', { className: 'input-row', style: { marginTop: '10px' }, children: [inputEl, sendBtn] });

  // Add voice button if supported
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let micBtn = null;
  if (SpeechRecognition) {
    micBtn = el('button', { className: 'chip', text: '🎤', attrs: { 'aria-label': 'Speak your question' } });
    inputRow.insertBefore(micBtn, sendBtn);
    micBtn.onclick = () => {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      micBtn.textContent = '🔴';
      recognition.onresult = e => ask(e.results[0][0].transcript);
      recognition.onend = () => { micBtn.textContent = '🎤'; };
      try { recognition.start(); } catch (e) { /* already started */ }
    };
  }

  function addMsg(text, cls, isHtml = false) {
    const msg = el('div', { className: 'chat-msg ' + cls });
    if (isHtml) msg.innerHTML = text;
    else msg.textContent = text;
    chatEl.append(msg);
    chatEl.scrollTop = 1e9;
    return msg;
  }

  // Show typing indicator
  function showTyping() {
    const typing = el('div', {
      className: 'chat-msg assistant typing',
      html: '<span></span><span></span><span></span>'
    });
    chatEl.append(typing);
    chatEl.scrollTop = 1e9;
    return typing;
  }

  function ask(q) {
    if (!q || !q.trim()) return;
    addMsg(q, 'user');
    inputEl.value = '';

    const typing = showTyping();

    setTimeout(() => {
      typing.remove();
      const reply = copilotReply(q);
      addMsg(reply.html || reply.text, 'assistant', !!reply.html);

      if (reply.cta) {
        const btn = el('button', { className: 'btn btn-sm', text: reply.cta[0], style: { marginTop: '8px' } });
        btn.onclick = reply.cta[1];
        chatEl.append(btn);
        chatEl.scrollTop = 1e9;
      }

      // Update suggestions
      updateSuggestions();
    }, 600);
  }

  function updateSuggestions() {
    suggestEl.innerHTML = '';
    ['Track CL-1042', 'Where is the dashboard?', 'I found a pothole on Main Road', 'How do I pay property tax?']
      .forEach(s => {
        const chip = el('button', { className: 'chip', text: s });
        chip.onclick = () => ask(s);
        suggestEl.append(chip);
      });
  }

  // Wire up events
  sendBtn.onclick = () => ask(inputEl.value);
  inputEl.onkeydown = e => { if (e.key === 'Enter') ask(inputEl.value); };

  // Greeting
  addMsg(greeting, 'assistant');

  // Initial suggestions
  suggestions.forEach(s => {
    const chip = el('button', { className: 'chip', text: s });
    chip.onclick = () => ask(s);
    suggestEl.append(chip);
  });

  return { chatEl, inputEl, suggestEl, inputRow, ask };
}

/**
 * Render the floating Civic Copilot button and dialog.
 */
export function renderCopilot() {
  // Copilot FAB
  const fab = el('button', {
    className: 'copilot-btn pulse-glow',
    html: '🤖 ' + t('copilot'),
    attrs: { 'aria-label': 'Open Civic Copilot', id: 'copilot-fab' }
  });

  // Dialog
  const dialog = el('dialog', {
    className: 'copilot-dialog',
    attrs: { id: 'copilot-dialog', 'aria-labelledby': 'copilot-title' }
  });

  const { chatEl, inputRow, suggestEl } = createChatUI({
    greeting: t('copilot.greeting'),
    suggestions: ['Track CL-1042', 'Where is the dashboard?', 'I found a pothole on Main Road']
  });

  const closeBtn = el('button', { className: 'chip', text: '✕' });
  closeBtn.onclick = () => dialog.close();

  dialog.innerHTML = '';
  const header = el('div', {
    className: 'copilot-dialog__header',
    children: [
      el('h3', { text: '🤖 Civic Copilot', attrs: { id: 'copilot-title' }, style: { margin: '0' } }),
      closeBtn
    ]
  });

  const desc = el('p', {
    text: t('copilot.desc'),
    style: { color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: '0', padding: '0 0 10px' }
  });

  const body = el('div', { className: 'copilot-dialog__body', children: [chatEl, suggestEl] });
  const footer = el('div', { className: 'copilot-dialog__footer', children: [inputRow] });

  dialog.append(header, desc, body, footer);

  fab.onclick = () => dialog.showModal();

  return { fab, dialog };
}

export default { createChatUI, renderCopilot };
