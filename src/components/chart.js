/* ═══════════════════════════════════════════════════════
   Smart City – SVG Chart Components
   ═══════════════════════════════════════════════════════ */

/**
 * Create an animated bar chart SVG.
 * @param {object} opts
 * @param {Array<{label:string, value:number, value2?:number}>} opts.data
 * @param {string} opts.color1
 * @param {string} opts.color2
 * @param {string} opts.legend1
 * @param {string} opts.legend2
 * @returns {string} SVG innerHTML
 */
export function barChart({ data, color1 = 'var(--primary)', color2 = 'var(--success)', legend1 = 'Reported', legend2 = 'Resolved' }) {
  const maxVal = Math.max(...data.flatMap(d => [d.value, d.value2 || 0]));
  const scale = 130 / maxVal;
  const barW = 24;
  const gap = 68;

  let svg = '';

  // Legend
  svg += `<text x="20" y="14" font-size="10" fill="${color1}" font-family="Inter,sans-serif">■ ${legend1}</text>`;
  svg += `<text x="${20 + legend1.length * 6 + 30}" y="14" font-size="10" fill="${color2}" font-family="Inter,sans-serif">■ ${legend2}</text>`;

  // Bars
  data.forEach((d, i) => {
    const x = 20 + i * gap;
    const h1 = d.value * scale;
    const h2 = (d.value2 || 0) * scale;

    svg += `<rect x="${x}" y="${150 - h1}" width="${barW}" height="${h1}"
              rx="4" fill="${color1}" opacity="0.85"
              class="bar-animate" style="animation-delay:${i * 0.1}s">
              <title>${legend1}: ${d.value}</title>
            </rect>`;

    if (d.value2 != null) {
      svg += `<rect x="${x + barW + 3}" y="${150 - h2}" width="${barW}" height="${h2}"
                rx="4" fill="${color2}" opacity="0.85"
                class="bar-animate" style="animation-delay:${i * 0.1 + 0.05}s">
                <title>${legend2}: ${d.value2}</title>
              </rect>`;
    }

    svg += `<text x="${x + (d.value2 != null ? barW + 1 : barW / 2)}" y="168"
              text-anchor="middle" font-size="11" fill="var(--text-muted)"
              font-family="Inter,sans-serif">${d.label}</text>`;
  });

  return svg;
}

/**
 * Create an animated ring/donut chart SVG.
 * @param {object} opts
 * @param {number} opts.percentage - 0 to 100
 * @param {string} opts.color
 * @param {string} opts.label
 * @param {number} opts.size - viewBox size
 * @returns {string} SVG innerHTML
 */
export function ringChart({ percentage, color = 'var(--success)', label = '', size = 120 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 15;
  const circumference = 2 * Math.PI * r;
  const filled = circumference * (percentage / 100);

  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="var(--border)" stroke-width="12" />
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="${color}" stroke-width="12"
            stroke-linecap="round"
            stroke-dasharray="${filled} ${circumference}"
            transform="rotate(-90 ${cx} ${cy})"
            class="ring-animate" />
    <text x="${cx}" y="${cy + 2}" text-anchor="middle"
          font-size="22" font-weight="700" fill="var(--text-primary)"
          font-family="Sora,sans-serif">${percentage}%</text>
    ${label ? `<text x="${cx}" y="${cy + 20}" text-anchor="middle"
          font-size="10" fill="var(--text-muted)"
          font-family="Inter,sans-serif">${label}</text>` : ''}
  `;
}

/**
 * Create a gauge/semicircle chart.
 * @param {object} opts
 * @param {number} opts.value - 0 to 100
 * @param {string} opts.label
 * @param {string} opts.color
 * @returns {string} SVG innerHTML
 */
export function gaugeChart({ value, label = '', color = 'var(--success)' }) {
  const r = 60;
  const cx = 75;
  const cy = 75;
  const semiCircumference = Math.PI * r;
  const filled = semiCircumference * (value / 100);

  // Color based on value
  const autoColor = value > 80 ? 'var(--success)' : value > 50 ? 'var(--warning)' : 'var(--danger)';
  const useColor = color === 'auto' ? autoColor : color;

  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="var(--border)" stroke-width="14"
            stroke-dasharray="${semiCircumference} ${semiCircumference}"
            stroke-dashoffset="0"
            transform="rotate(180 ${cx} ${cy})" />
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="${useColor}" stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${filled} ${semiCircumference}"
            stroke-dashoffset="0"
            transform="rotate(180 ${cx} ${cy})"
            class="ring-animate" />
    <text x="${cx}" y="${cy - 4}" text-anchor="middle"
          font-size="28" font-weight="800" fill="var(--text-primary)"
          font-family="Sora,sans-serif">${value}</text>
    ${label ? `<text x="${cx}" y="${cy + 16}" text-anchor="middle"
          font-size="11" fill="var(--text-muted)"
          font-family="Inter,sans-serif">${label}</text>` : ''}
  `;
}

/**
 * Create sparkline mini chart.
 * @param {number[]} values
 * @param {string} color
 * @param {number} width
 * @param {number} height
 * @returns {string} SVG string
 */
export function sparkline(values, color = 'var(--primary)', width = 80, height = 30) {
  if (!values.length) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="overflow:visible">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="${(values.length - 1) * step}" cy="${height - ((values[values.length - 1] - min) / range) * (height - 4) - 2}" r="3" fill="${color}" />
  </svg>`;
}

export default { barChart, ringChart, gaugeChart, sparkline };
