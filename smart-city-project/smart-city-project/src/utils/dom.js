/* ═══════════════════════════════════════════════════════
   Smart City – DOM Utility Helpers
   ═══════════════════════════════════════════════════════ */

/** Query one element */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** Query all elements */
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Create an element with optional class, innerHTML, and attributes.
 * @param {string} tag
 * @param {object} opts - { className, html, text, attrs, children, events }
 * @returns {HTMLElement}
 */
export function el(tag, opts = {}) {
  const e = document.createElement(tag);
  if (opts.className) e.className = opts.className;
  if (opts.html != null) e.innerHTML = opts.html;
  if (opts.text != null) e.textContent = opts.text;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (opts.style) Object.assign(e.style, opts.style);
  if (opts.children) opts.children.forEach(c => { if (c) e.append(c); });
  if (opts.events) Object.entries(opts.events).forEach(([k, v]) => e.addEventListener(k, v));
  return e;
}

/**
 * Clears a container and appends children.
 */
export function render(container, ...children) {
  container.innerHTML = '';
  children.flat().forEach(c => {
    if (typeof c === 'string') container.insertAdjacentHTML('beforeend', c);
    else if (c) container.append(c);
  });
}

/**
 * Animate a number counting up.
 * @param {HTMLElement} elem
 * @param {number} target
 * @param {number} duration - ms
 * @param {string} prefix
 * @param {string} suffix
 */
export function countUp(elem, target, duration = 1200, prefix = '', suffix = '') {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start = Math.min(target, start + step);
    elem.textContent = prefix + start.toLocaleString() + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
  return timer;
}

/**
 * Debounce a function.
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Add a ripple effect to a button on click.
 */
export function addRipple(btn) {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const ripple = el('span', { className: 'ripple' });
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/**
 * Intersection Observer helper for reveal animations.
 */
export function observeReveal(root = document) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  root.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  return observer;
}

/**
 * Format a date nicely.
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
}
