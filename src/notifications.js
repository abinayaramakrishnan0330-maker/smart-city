/* ═══════════════════════════════════════════════════════
   Smart City – Toast Notification System
   ═══════════════════════════════════════════════════════ */

import { $, el } from './utils/dom.js';
import t from './i18n.js';

let container = null;

const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

function ensureContainer() {
  if (!container) {
    container = el('div', { className: 'toast-container', attrs: { 'aria-live': 'polite', role: 'status' } });
    document.body.append(container);
  }
}

/**
 * Show a toast notification.
 * @param {object} opts
 * @param {'success'|'error'|'warning'|'info'} opts.type
 * @param {string} opts.title
 * @param {string} opts.message
 * @param {number} opts.duration - ms, default 4000
 */
export function showToast({ type = 'info', title, message, duration = 4000 }) {
  ensureContainer();

  const titleText = title || t(`toast.${type}`);

  const toast = el('div', {
    className: `toast toast--${type} toast-enter`,
    attrs: { role: 'alert' }
  });

  toast.innerHTML = `
    <span class="toast__icon">${ICONS[type]}</span>
    <div class="toast__content">
      <div class="toast__title">${titleText}</div>
      ${message ? `<div class="toast__message">${message}</div>` : ''}
    </div>
    <button class="toast__close" aria-label="Dismiss">✕</button>
    <div class="toast__progress" style="width:100%"></div>
  `;

  container.prepend(toast);

  const progress = toast.querySelector('.toast__progress');
  const close = toast.querySelector('.toast__close');

  // Animate progress bar
  requestAnimationFrame(() => {
    progress.style.transition = `width ${duration}ms linear`;
    progress.style.width = '0%';
  });

  const dismiss = () => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  };

  close.onclick = dismiss;

  const timer = setTimeout(dismiss, duration);

  // Pause on hover
  toast.addEventListener('mouseenter', () => {
    clearTimeout(timer);
    progress.style.transition = 'none';
  });

  toast.addEventListener('mouseleave', () => {
    const remaining = (parseFloat(getComputedStyle(progress).width) / toast.offsetWidth) * duration;
    progress.style.transition = `width ${remaining}ms linear`;
    progress.style.width = '0%';
    setTimeout(dismiss, remaining);
  });
}

// Convenience methods
export const toastSuccess = (msg, title) => showToast({ type: 'success', title, message: msg });
export const toastError = (msg, title) => showToast({ type: 'error', title, message: msg });
export const toastWarning = (msg, title) => showToast({ type: 'warning', title, message: msg });
export const toastInfo = (msg, title) => showToast({ type: 'info', title, message: msg });

export default showToast;
