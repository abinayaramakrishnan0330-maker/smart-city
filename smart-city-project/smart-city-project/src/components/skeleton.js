/* ═══════════════════════════════════════════════════════
   Smart City – Skeleton Loader Components
   ═══════════════════════════════════════════════════════ */

import { el } from '../utils/dom.js';

/**
 * Create a skeleton loader element.
 */
export function skeleton(type = 'text', opts = {}) {
  const map = {
    text: () => {
      const div = el('div');
      for (let i = 0; i < (opts.lines || 3); i++) {
        div.append(el('div', {
          className: 'skeleton skeleton-text',
          style: { width: i === (opts.lines || 3) - 1 ? '70%' : '100%' }
        }));
      }
      return div;
    },
    title: () => el('div', { className: 'skeleton skeleton-title' }),
    card: () => el('div', { className: 'skeleton skeleton-card' }),
    avatar: () => el('div', { className: 'skeleton skeleton-avatar' }),
    kpi: () => el('div', { className: 'skeleton skeleton-kpi' }),
    chart: () => el('div', { className: 'skeleton skeleton-chart' }),
    circle: () => el('div', {
      className: 'skeleton skeleton-circle',
      style: { width: (opts.size || 48) + 'px', height: (opts.size || 48) + 'px' }
    }),
    custom: () => el('div', {
      className: 'skeleton',
      style: { width: opts.width || '100%', height: opts.height || '40px' }
    })
  };

  return (map[type] || map.text)();
}

/**
 * Create a skeleton page for a specific page type.
 */
export function skeletonPage(type = 'default') {
  const container = el('div', { className: 'skeleton-page wrapper' });

  const templates = {
    default: () => {
      container.append(
        skeleton('title'),
        skeleton('text', { lines: 2 }),
        el('div', {
          className: 'skeleton-grid',
          style: { marginTop: '24px' },
          children: Array.from({ length: 6 }, () => skeleton('card'))
        })
      );
    },
    dashboard: () => {
      container.append(
        skeleton('title'),
        skeleton('text', { lines: 1 }),
        el('div', {
          className: 'kpi-grid',
          style: { marginTop: '24px' },
          children: Array.from({ length: 4 }, () => skeleton('kpi'))
        }),
        el('div', {
          className: 'skeleton-two-col',
          style: { marginTop: '24px' },
          children: [skeleton('chart'), skeleton('chart')]
        })
      );
    },
    form: () => {
      container.append(
        skeleton('title'),
        skeleton('text', { lines: 1 }),
        el('div', {
          className: 'skeleton-two-col',
          style: { marginTop: '24px' },
          children: [
            el('div', { children: [
              skeleton('custom', { height: '300px' })
            ]}),
            el('div', { children: [
              skeleton('custom', { height: '300px' })
            ]})
          ]
        })
      );
    },
    profile: () => {
      container.append(
        el('div', {
          className: 'flex gap-lg',
          style: { marginBottom: '24px', alignItems: 'center' },
          children: [
            skeleton('circle', { size: 80 }),
            el('div', { style: { flex: '1' }, children: [
              skeleton('title'),
              skeleton('text', { lines: 1 })
            ]})
          ]
        }),
        el('div', {
          className: 'grid-3',
          style: { marginBottom: '24px' },
          children: Array.from({ length: 3 }, () => skeleton('kpi'))
        }),
        skeleton('chart')
      );
    }
  };

  (templates[type] || templates.default)();
  return container;
}

/**
 * Show skeleton in a container, then swap with real content after delay.
 * @param {HTMLElement} container
 * @param {string} type - skeleton page type
 * @param {Function} renderFn - function that returns content
 * @param {number} delay - ms
 */
export async function withSkeleton(container, type, renderFn, delay = 400) {
  const skel = skeletonPage(type);
  container.append(skel);

  await new Promise(r => setTimeout(r, delay));

  skel.remove();
  return renderFn(container);
}

export default { skeleton, skeletonPage, withSkeleton };
