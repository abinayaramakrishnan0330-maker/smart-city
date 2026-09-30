/* ═══════════════════════════════════════════════════════
   Smart City – Hash-Based SPA Router
   ═══════════════════════════════════════════════════════ */

import { $ } from './utils/dom.js';

const routes = {};
let currentCleanup = null;
let currentRoute = null;

/**
 * Register a route.
 * @param {string} path - Hash path, e.g. 'home', 'services'
 * @param {object} handler - { title, render(container), cleanup?() }
 */
export function route(path, handler) {
  routes[path] = handler;
}

/**
 * Navigate to a hash route.
 */
export function navigate(path) {
  window.location.hash = '#/' + path;
}

/**
 * Get current route name.
 */
export function getCurrentRoute() {
  return currentRoute;
}

/**
 * Initialize the router. Call once after all routes are registered.
 */
export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

async function handleRoute() {
  const hash = window.location.hash.replace('#/', '') || 'home';
  const handler = routes[hash] || routes['home'];

  if (!handler) return;

  const container = $('#page-content');
  if (!container) return;

  // Cleanup previous page
  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { console.warn('Cleanup error:', e); }
    currentCleanup = null;
  }

  // Exit animation
  container.classList.remove('page-enter');
  container.classList.add('page-exit');

  await new Promise(r => setTimeout(r, 150));

  // Update title
  if (handler.title) {
    document.title = `${handler.title} – Smart City`;
  }

  // Render new page
  container.innerHTML = '';
  container.classList.remove('page-exit');

  try {
    const cleanup = await handler.render(container);
    if (typeof cleanup === 'function') {
      currentCleanup = cleanup;
    }
  } catch (e) {
    console.error('Page render error:', e);
    container.innerHTML = `<div class="wrapper" style="padding:80px 20px;text-align:center;">
      <h2>Something went wrong</h2>
      <p style="color:var(--text-muted)">Please try refreshing the page.</p>
    </div>`;
  }

  container.classList.add('page-enter');
  currentRoute = hash;

  // Update active nav link
  updateNavLinks(hash);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Focus management for accessibility
  container.setAttribute('tabindex', '-1');
  container.focus({ preventScroll: true });
  container.removeAttribute('tabindex');
}

function updateNavLinks(hash) {
  const links = document.querySelectorAll('.nav__link');
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkHash = href.replace('#/', '');
    link.classList.toggle('active', linkHash === hash);
  });
}

export default { route, navigate, initRouter, getCurrentRoute };
