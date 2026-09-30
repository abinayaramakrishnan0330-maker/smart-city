/* ═══════════════════════════════════════════════════════
   Smart City – Left-Side Step-by-Step City Dashboard Page
   ═══════════════════════════════════════════════════════ */

import { $, el, countUp, observeReveal } from '../utils/dom.js';
import t from '../i18n.js';
import { barChart, ringChart, sparkline } from '../components/chart.js';
import store from '../store.js';
import { toastSuccess, toastWarning, toastInfo } from '../notifications.js';

const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep'];
const REPORTED = [180, 220, 260, 240, 300];
const RESOLVED = [150, 190, 230, 210, 262];
const RES_RATE = Math.round((1042 / 1284) * 100);

const STATUS_DATA = [
  ['Smart Waste Collection', 'On schedule (4 trucks active)', 'var(--success)'],
  ['Traffic Management', 'Heavy on Main Road; Bridge Road clear', 'var(--warning)'],
  ['Water Supply Network', 'Normal across Zones 1,2,4; Zone 3 maintenance', 'var(--success)'],
  ['Electric Power Grid', '1 outage in Old Town restored', 'var(--success)'],
  ['Environmental Quality', 'AQI 42 (Good) · PM2.5 within limits', 'var(--success)'],
  ['Bus Fleet & Transit', '14 municipal routes operating on time', 'var(--success)']
];

const DASH_STEPS = [
  { id: 'step-overview', num: 1, title: 'Overview & Macro KPIs', icon: '📊', desc: 'City KPIs, charts & resolution', tag: 'Live' },
  { id: 'step-zones', num: 2, title: 'Zone Health & Sectors', icon: '🌐', desc: '4-Zone telemetry & efficiency', tag: '4 Zones' },
  { id: 'step-incidents', num: 3, title: 'Incident Live Triage', icon: '📋', desc: 'Workflow & stage progression', tag: 'Action' },
  { id: 'step-telemetry', num: 4, title: 'Smart IoT Sensor Grid', icon: '📡', desc: 'Water, power, AQI, waste, traffic', tag: 'Telemetry' },
  { id: 'step-dispatch', num: 5, title: 'Fleet & Audit Dispatch', icon: '🚛', desc: 'Resource units & readiness score', tag: 'Dispatch' }
];

const STEPS_NAMES = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

export default {
  title: 'Dashboard',

  render(container) {
    const timers = [];
    let currentStep = 0;
    let activeZoneFilter = 'all';
    let activeIncidentFilter = 'all';

    container.innerHTML = `
      <section id="dashboard" class="dashboard-hub">
        <div class="dash-layout">
          <!-- ════════ LEFT SIDEBAR ════════ -->
          <aside class="dash-sidebar" id="dash-sidebar" aria-label="Dashboard Steps & Navigation">
            <div class="dash-sidebar__header">
              <div class="dash-sidebar__title-row">
                <span class="dash-sidebar__brand">🏙️ Command Hub</span>
                <span class="dash-sidebar__badge" id="dash-live-badge"><span class="dash-pulse-dot"></span> Online</span>
              </div>
              <p class="dash-sidebar__subtitle">Step-by-step municipal control, real-time sensor feeds & field triage.</p>
              
              <!-- Step Progress Card -->
              <div class="dash-progress-card">
                <div class="dash-progress-card__header">
                  <span id="dash-progress-text">Step 1 of 5</span>
                  <span id="dash-progress-pct" style="color:var(--primary);font-weight:700">20%</span>
                </div>
                <div class="dash-progress-bar">
                  <div class="dash-progress-fill" id="dash-progress-fill" style="width:20%"></div>
                </div>
              </div>
            </div>

            <!-- Step Navigation Buttons -->
            <ul class="dash-steps-nav" id="dash-steps-nav" role="tablist">
              ${DASH_STEPS.map((s, idx) => `
                <li role="presentation">
                  <button class="dash-step-btn ${idx === 0 ? 'active' : ''}" data-step="${idx}" role="tab" aria-selected="${idx === 0}">
                    <span class="dash-step-number">${s.num}</span>
                    <div class="dash-step-info">
                      <span class="dash-step-title">${s.icon} ${s.title}</span>
                      <span class="dash-step-desc">${s.desc}</span>
                    </div>
                    <span class="dash-step-tag">${s.tag}</span>
                  </button>
                </li>
              `).join('')}
            </ul>

            <!-- Sidebar Quick Actions & Controls -->
            <div class="dash-sidebar__footer">
              <small style="color:var(--text-muted);font-weight:600;text-transform:uppercase;font-size:10px;letter-spacing:0.04em">Quick Commands</small>
              <div class="dash-quick-actions">
                <button class="dash-btn-mini" id="dash-quick-sync" title="Sync live sensor feeds">🔄 Sync Feeds</button>
                <button class="dash-btn-mini" id="dash-quick-alert" title="Test emergency sensor broadcast">🚨 Test Alert</button>
                <button class="dash-btn-mini" id="dash-quick-csv" title="Download operational CSV">📥 Export CSV</button>
                <button class="dash-btn-mini" id="dash-quick-print" title="Print City Report">🖨️ Print</button>
              </div>
              <div style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;justify-content:space-between;margin-top:6px;padding:4px 6px;background:var(--surface-inner);border-radius:var(--radius-sm)">
                <span>🛡️ Municipal SLA</span>
                <b style="color:var(--success)">99.8% Nominal</b>
              </div>
            </div>
          </aside>

          <!-- ════════ RIGHT MAIN VIEWPORT ════════ -->
          <div class="dash-main" id="dash-main">

            <!-- ── PANEL 1: OVERVIEW & MACRO KPIS ── -->
            <div class="dash-panel active" data-panel="0">
              <div class="dash-panel-header">
                <div>
                  <span class="chip" style="font-size:11px;margin-bottom:6px">Step 1 of 5 · Macro Intelligence</span>
                  <h2 class="dash-panel-title">City Operations & Macro KPIs</h2>
                  <p class="dash-panel-sub">Real-time municipal performance snapshot, resolution metrics, and citizen volume.</p>
                </div>
                <div class="dash-panel-actions">
                  <div class="chips-container" style="margin:0">
                    <button class="chip active">Today</button>
                    <button class="chip">7 Days</button>
                    <button class="chip">30 Days</button>
                  </div>
                </div>
              </div>

              <!-- KPI Cards Grid -->
              <div class="kpi-grid stagger-in" id="kpi-grid"></div>

              <!-- Additional Highlight Metrics -->
              <div class="grid-3" style="margin-top:var(--space-md)">
                <div class="glass" style="padding:var(--space-md)">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <small style="color:var(--text-muted);font-weight:600">Citizen Satisfaction</small>
                    <span style="color:var(--warning)">⭐⭐⭐⭐⭐</span>
                  </div>
                  <div style="font-size:1.6rem;font-weight:800;font-family:var(--font-display);color:var(--text-primary);margin-top:4px">94.2%</div>
                  <small style="color:var(--success)">↑ 2.8% from last quarter</small>
                </div>
                <div class="glass" style="padding:var(--space-md)">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <small style="color:var(--text-muted);font-weight:600">Clean Energy Ratio</small>
                    <span>☀️ 🍃</span>
                  </div>
                  <div style="font-size:1.6rem;font-weight:800;font-family:var(--font-display);color:var(--primary);margin-top:4px">34.8%</div>
                  <small style="color:var(--text-muted)">142 MW Solar & Wind active</small>
                </div>
                <div class="glass" style="padding:var(--space-md)">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <small style="color:var(--text-muted);font-weight:600">Cleanliness Rating</small>
                    <span>🧹 🏙️</span>
                  </div>
                  <div style="font-size:1.6rem;font-weight:800;font-family:var(--font-display);color:var(--success);margin-top:4px">Grade A+</div>
                  <small style="color:var(--text-muted)">All 4 zones audited</small>
                </div>
              </div>

              <!-- Visual Charts -->
              <div class="grid-2" style="margin-top:var(--space-lg)">
                <div class="glass-static reveal">
                  <h3>Monthly Complaints vs Resolutions</h3>
                  <svg id="dash-bars" viewBox="0 0 360 180" style="width:100%;height:auto" role="img" aria-label="Bar chart"></svg>
                </div>
                <div class="glass-static reveal">
                  <h3>City Infrastructure Status</h3>
                  <div id="city-status"></div>
                  <hr class="divider">
                  <h3>Overall Resolution Rate</h3>
                  <div style="text-align:center">
                    <svg id="dash-ring" viewBox="0 0 120 120" width="140" role="img" aria-label="Ring chart"></svg>
                  </div>
                </div>
              </div>

              <div class="grid-2" style="margin-top:var(--space-lg)">
                <div class="glass-static reveal">
                  <h3>Response Time Velocity</h3>
                  <div style="display:flex;align-items:center;gap:var(--space-lg);padding:var(--space-md) 0">
                    <div><span class="kpi-value gradient-text">3.2h</span><div class="kpi-label">Average Response Time</div></div>
                    <div id="response-sparkline"></div>
                  </div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted)">↓ 18% improvement compared to last month due to automated dispatching.</p>
                </div>
                <div class="glass-static reveal">
                  <h3>Quick Zone Summary</h3>
                  <div id="zone-summary-list"></div>
                </div>
              </div>

              <!-- Panel 1 Footer Navigation -->
              <div class="dash-step-footer">
                <span style="font-size:var(--fs-xs);color:var(--text-muted)">Step 1 of 5: City Overview & KPIs</span>
                <button class="btn btn-step-next" data-next="1">Proceed to Step 2: Zone Health →</button>
              </div>
            </div>

            <!-- ── PANEL 2: ZONE HEALTH & SECTOR BREAKDOWN ── -->
            <div class="dash-panel" data-panel="1">
              <div class="dash-panel-header">
                <div>
                  <span class="chip" style="font-size:11px;margin-bottom:6px">Step 2 of 5 · Regional Analytics</span>
                  <h2 class="dash-panel-title">Zone Health & Sector Diagnostics</h2>
                  <p class="dash-panel-sub">Granular sector performance, zone resolution efficiency, and active municipal patrol units.</p>
                </div>
                <div class="dash-panel-actions">
                  <button class="btn btn-sm btn-outline" id="zone-run-diagnostics">⚡ Run Sector Diagnostics</button>
                  <button class="btn btn-sm btn-outline" id="zone-broadcast-alert">📢 Broadcast Zone Advisory</button>
                </div>
              </div>

              <!-- Zone Filter Tabs -->
              <div class="chips-container" id="zone-filter-chips" style="margin-bottom:var(--space-md)">
                <button class="chip active" data-zone="all">All Zones (4)</button>
                <button class="chip" data-zone="Zone 1 – Central">Zone 1 – Central</button>
                <button class="chip" data-zone="Zone 2 – Riverside">Zone 2 – Riverside</button>
                <button class="chip" data-zone="Zone 3 – Tech Park">Zone 3 – Tech Park</button>
                <button class="chip" data-zone="Zone 4 – Old Town">Zone 4 – Old Town</button>
              </div>

              <!-- Detailed Zone Cards Grid -->
              <div class="zone-grid" id="zone-cards-grid"></div>

              <!-- Zone Live Diagnostics Console -->
              <div class="glass-static" style="margin-top:var(--space-lg)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
                  <h3 style="margin:0">🔍 Zone Microgrid & Utilities Telemetry</h3>
                  <span id="zone-scan-status" style="font-size:var(--fs-xs);color:var(--success);font-weight:600">● Diagnostics Normal</span>
                </div>
                <div class="grid-4" style="gap:var(--space-sm);font-size:var(--fs-sm)" id="zone-telemetry-strip">
                  <div style="padding:10px;background:var(--surface-inner);border-radius:var(--radius-sm)">
                    <span style="color:var(--text-muted);font-size:var(--fs-xs)">Zone 1 Water Flow</span>
                    <div style="font-weight:700;font-size:1.1rem">64 PSI · Stable</div>
                  </div>
                  <div style="padding:10px;background:var(--surface-inner);border-radius:var(--radius-sm)">
                    <span style="color:var(--text-muted);font-size:var(--fs-xs)">Zone 2 Air Quality</span>
                    <div style="font-weight:700;font-size:1.1rem;color:var(--success)">AQI 42 · Good</div>
                  </div>
                  <div style="padding:10px;background:var(--surface-inner);border-radius:var(--radius-sm)">
                    <span style="color:var(--text-muted);font-size:var(--fs-xs)">Zone 3 Power Load</span>
                    <div style="font-weight:700;font-size:1.1rem;color:var(--warning)">140 MW · Heavy</div>
                  </div>
                  <div style="padding:10px;background:var(--surface-inner);border-radius:var(--radius-sm)">
                    <span style="color:var(--text-muted);font-size:var(--fs-xs)">Zone 4 Waste Fill</span>
                    <div style="font-weight:700;font-size:1.1rem">68% · Collection On Duty</div>
                  </div>
                </div>
              </div>

              <!-- Panel 2 Footer Navigation -->
              <div class="dash-step-footer">
                <button class="btn btn-outline btn-step-prev" data-prev="0">← Back to Step 1: Overview</button>
                <button class="btn btn-step-next" data-next="2">Proceed to Step 3: Incident Management →</button>
              </div>
            </div>

            <!-- ── PANEL 3: INCIDENT MANAGEMENT & LIVE TRIAGE ── -->
            <div class="dash-panel" data-panel="2">
              <div class="dash-panel-header">
                <div>
                  <span class="chip" style="font-size:11px;margin-bottom:6px">Step 3 of 5 · Action Pipeline</span>
                  <h2 class="dash-panel-title">Incident Management & Live Stage Progression</h2>
                  <p class="dash-panel-sub">Step citizen complaints through the 4-phase municipal resolution pipeline: Submitted → Assigned → In Progress → Resolved.</p>
                </div>
                <div class="dash-panel-actions">
                  <button class="btn btn-sm" id="btn-add-test-incident">➕ Simulate New Complaint</button>
                </div>
              </div>

              <!-- Pipeline Visual Banner -->
              <div class="glass" style="padding:var(--space-md);margin-bottom:var(--space-md);display:flex;align-items:center;justify-content:space-around;gap:var(--space-sm);flex-wrap:wrap">
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="stage-pill stage-pill--submitted">1. Submitted</span>
                  <span style="color:var(--text-muted)">➔</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="stage-pill stage-pill--assigned">2. Assigned</span>
                  <span style="color:var(--text-muted)">➔</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="stage-pill stage-pill--in-progress">3. In Progress</span>
                  <span style="color:var(--text-muted)">➔</span>
                </div>
                <div>
                  <span class="stage-pill stage-pill--resolved">4. Resolved ✅</span>
                </div>
              </div>

              <!-- Filter Chips -->
              <div class="chips-container" id="incident-filter-chips" style="margin-bottom:var(--space-md)">
                <button class="chip active" data-filter="all">All Incidents</button>
                <button class="chip" data-filter="0">Stage 1: Submitted</button>
                <button class="chip" data-filter="1">Stage 2: Assigned</button>
                <button class="chip" data-filter="2">Stage 3: In Progress</button>
                <button class="chip" data-filter="3">Stage 4: Resolved</button>
              </div>

              <!-- Triage Interactive Table -->
              <div class="triage-table-wrapper">
                <table class="incident-triage-table" id="incident-table" aria-label="Incident Triage Table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Category</th>
                      <th>Zone</th>
                      <th>Description</th>
                      <th>Current Stage</th>
                      <th style="text-align:right">Action</th>
                    </tr>
                  </thead>
                  <tbody id="incident-table-body"></tbody>
                </table>
              </div>

              <!-- Panel 3 Footer Navigation -->
              <div class="dash-step-footer">
                <button class="btn btn-outline btn-step-prev" data-prev="1">← Back to Step 2: Zone Health</button>
                <button class="btn btn-step-next" data-next="3">Proceed to Step 4: Smart IoT Sensors →</button>
              </div>
            </div>

            <!-- ── PANEL 4: SMART IOT & SENSOR TELEMETRY ── -->
            <div class="dash-panel" data-panel="3">
              <div class="dash-panel-header">
                <div>
                  <span class="chip" style="font-size:11px;margin-bottom:6px">Step 4 of 5 · Hardware Mesh</span>
                  <h2 class="dash-panel-title">Smart IoT & Sensor Telemetry Network</h2>
                  <p class="dash-panel-sub">Live streaming status from 1,450 connected municipal IoT nodes across the city grid.</p>
                </div>
                <div class="dash-panel-actions">
                  <button class="btn btn-sm btn-outline" id="iot-ping-all">🛰️ Ping All 1,450 Nodes</button>
                </div>
              </div>

              <!-- IoT Telemetry Cards -->
              <div class="telemetry-grid">
                <!-- Water Grid -->
                <div class="telemetry-card">
                  <div class="telemetry-header">
                    <span class="telemetry-title">🌊 Water Distribution</span>
                    <span class="dash-pulse-dot" style="background:var(--success)"></span>
                  </div>
                  <div class="telemetry-value" id="iot-val-water" style="color:var(--primary)">62.4 PSI</div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0">Main Reservoir: 84% capacity · 0 active pipe leaks detected.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:84%;background:var(--primary)"></span></div>
                  <button class="dash-btn-mini" id="iot-btn-water" style="align-self:flex-start;margin-top:4px">Simulate Pulse</button>
                </div>

                <!-- Air Quality -->
                <div class="telemetry-card">
                  <div class="telemetry-header">
                    <span class="telemetry-title">💨 Environmental & AQI</span>
                    <span class="dash-pulse-dot" style="background:var(--success)"></span>
                  </div>
                  <div class="telemetry-value" id="iot-val-aqi" style="color:var(--success)">AQI 42</div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0">PM2.5: 11 µg/m³ · Temp: 28°C · Humidity: 64%.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:42%;background:var(--success)"></span></div>
                  <span style="font-size:11px;color:var(--success);font-weight:600">Air Quality: Optimal</span>
                </div>

                <!-- Energy Grid -->
                <div class="telemetry-card">
                  <div class="telemetry-header">
                    <span class="telemetry-title">⚡ Smart Power Grid</span>
                    <span class="dash-pulse-dot" style="background:var(--success)"></span>
                  </div>
                  <div class="telemetry-value" id="iot-val-power" style="color:var(--warning)">412 MW</div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0">Solar/Wind Contribution: 34.8% · Peak load handling stable.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:72%;background:var(--warning)"></span></div>
                  <span style="font-size:11px;color:var(--text-muted)">Substation Reserve: 140 MW</span>
                </div>

                <!-- Smart Waste -->
                <div class="telemetry-card">
                  <div class="telemetry-header">
                    <span class="telemetry-title">🗑️ Smart Waste Bins</span>
                    <span class="dash-pulse-dot" style="background:var(--success)"></span>
                  </div>
                  <div class="telemetry-value" id="iot-val-waste" style="color:var(--accent)">124 Bins</div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0">8 bins > 85% fullness · Automated route optimization active.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:65%;background:var(--accent)"></span></div>
                  <span style="font-size:11px;color:var(--accent);font-weight:600">Truck 4 Dispatched</span>
                </div>

                <!-- Traffic Intelligence -->
                <div class="telemetry-card">
                  <div class="telemetry-header">
                    <span class="telemetry-title">🚦 Traffic AI Sensors</span>
                    <span class="dash-pulse-dot" style="background:var(--warning)"></span>
                  </div>
                  <div class="telemetry-value" id="iot-val-traffic" style="color:var(--text-primary)">38 km/h</div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0">48 AI Junction cameras · Main Road moderate slowdown.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:58%;background:var(--warning)"></span></div>
                  <span style="font-size:11px;color:var(--warning);font-weight:600">Adaptive Signal Timing Active</span>
                </div>

                <!-- Connected Streetlights -->
                <div class="telemetry-card">
                  <div class="telemetry-header">
                    <span class="telemetry-title">💡 Connected Streetlights</span>
                    <span class="dash-pulse-dot" style="background:var(--success)"></span>
                  </div>
                  <div class="telemetry-value" id="iot-val-lights" style="color:var(--primary)">2,840</div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:0">99.4% Uptime · Automated Day/Night dimming saving 42 kWh.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:99%;background:var(--primary)"></span></div>
                  <span style="font-size:11px;color:var(--success);font-weight:600">Daylight Sensor: Standby</span>
                </div>
              </div>

              <!-- Panel 4 Footer Navigation -->
              <div class="dash-step-footer">
                <button class="btn btn-outline btn-step-prev" data-prev="2">← Back to Step 3: Incidents</button>
                <button class="btn btn-step-next" data-next="4">Proceed to Step 5: Resource Dispatch →</button>
              </div>
            </div>

            <!-- ── PANEL 5: RESOURCE DISPATCH & FLEET COMMAND ── -->
            <div class="dash-panel" data-panel="4">
              <div class="dash-panel-header">
                <div>
                  <span class="chip" style="font-size:11px;margin-bottom:6px">Step 5 of 5 · Operational Signoff</span>
                  <h2 class="dash-panel-title">Resource Dispatch & Operational Audit</h2>
                  <p class="dash-panel-sub">Coordinate municipal field crews, emergency response teams, and complete daily operational signoff.</p>
                </div>
                <div class="dash-panel-actions">
                  <button class="btn btn-sm" id="btn-auto-dispatch">🚨 Auto-Dispatch Nearest Unit</button>
                </div>
              </div>

              <!-- Fleet Units Grid -->
              <div class="fleet-grid">
                <div class="fleet-card glass">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <b>🚛 Waste Logistics Fleet</b>
                    <span class="badge" style="background:rgba(47,191,113,0.15);color:var(--success)">4 Active</span>
                  </div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:4px 0">Today's collection route: 78% completed (124 bins cleared). 1 reserve truck in depot.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:78%;background:var(--success)"></span></div>
                </div>

                <div class="fleet-card glass">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <b>🚑 Emergency Response</b>
                    <span class="badge" style="background:rgba(229,72,77,0.15);color:var(--danger)">24/7 Standby</span>
                  </div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:4px 0">4 Police cruisers · 3 Ambulances · 2 Fire tenders ready. Average response: 6.4 minutes.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:92%;background:var(--danger)"></span></div>
                </div>

                <div class="fleet-card glass">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <b>🔧 Mobile Maintenance Vans</b>
                    <span class="badge" style="background:rgba(29,111,232,0.15);color:var(--primary)">6 Units</span>
                  </div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:4px 0">Active across 4 zones: 2 electrical, 2 pipe repair, 2 road resurfacing crews on duty.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:85%;background:var(--primary)"></span></div>
                </div>

                <div class="fleet-card glass">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <b>🤖 Autonomous Sweeper Drones</b>
                    <span class="badge" style="background:rgba(18,184,208,0.15);color:var(--accent)">8 Active</span>
                  </div>
                  <p style="font-size:var(--fs-xs);color:var(--text-muted);margin:4px 0">Patrolling Tech Park walkways & Promenade. 34.2 km swept today with zero incidents.</p>
                  <div class="progress-bar" style="height:6px"><span class="progress-bar__fill" style="width:96%;background:var(--accent)"></span></div>
                </div>
              </div>

              <!-- Dynamic Dispatch Log -->
              <div id="dispatch-live-log" class="glass-static" style="margin-top:var(--space-lg);display:none">
                <h3 style="margin-top:0">🛰️ Live Dispatch Assignment</h3>
                <p id="dispatch-log-text" style="color:var(--text-primary);font-size:var(--fs-sm);margin:0"></p>
              </div>

              <!-- Municipal Audit Checklist & Signoff -->
              <div class="glass-static" style="margin-top:var(--space-lg)">
                <h3>📋 Municipal Operational Readiness Checklist</h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:var(--space-sm);margin:var(--space-md) 0">
                  <label style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);cursor:pointer">
                    <input type="checkbox" checked disabled> All 4 Zones Meeting Safety Protocol
                  </label>
                  <label style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);cursor:pointer">
                    <input type="checkbox" checked disabled> Emergency Units Under 8-min SLA Target
                  </label>
                  <label style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);cursor:pointer">
                    <input type="checkbox" checked disabled> Water Network Above 50 PSI Threshold
                  </label>
                  <label style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);cursor:pointer">
                    <input type="checkbox" checked disabled> IoT Sensor Grid > 99% Connected
                  </label>
                </div>
                <button class="btn btn-lg" id="btn-complete-audit" style="color:#fff;background:var(--grad-success)">🏆 Complete City Operational Audit (+25 Points)</button>
              </div>

              <!-- Panel 5 Footer Navigation -->
              <div class="dash-step-footer">
                <button class="btn btn-outline btn-step-prev" data-prev="3">← Back to Step 4: IoT Sensors</button>
                <button class="btn btn-step-next" data-next="0">🔄 Return to Step 1: City Overview</button>
              </div>
            </div>

          </div>
        </div>
      </section>
    `;

    // ── STEP CONTROLLER ──
    const stepBtns = container.querySelectorAll('.dash-step-btn');
    const panels = container.querySelectorAll('.dash-panel');
    const progressText = container.querySelector('#dash-progress-text');
    const progressPct = container.querySelector('#dash-progress-pct');
    const progressFill = container.querySelector('#dash-progress-fill');

    function goToStep(idx) {
      if (idx < 0 || idx >= DASH_STEPS.length) return;
      currentStep = idx;

      stepBtns.forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
        btn.setAttribute('aria-selected', i === idx);
      });

      panels.forEach((p, i) => {
        p.classList.toggle('active', i === idx);
      });

      const pct = Math.round(((idx + 1) / DASH_STEPS.length) * 100);
      if (progressText) progressText.textContent = `Step ${idx + 1} of ${DASH_STEPS.length}`;
      if (progressPct) progressPct.textContent = `${pct}%`;
      if (progressFill) progressFill.style.width = `${pct}%`;

      if (window.innerWidth <= 960) {
        container.querySelector('#dash-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    stepBtns.forEach((btn, i) => {
      btn.onclick = () => goToStep(i);
    });

    container.querySelectorAll('.btn-step-next').forEach(btn => {
      btn.onclick = () => {
        const nextIdx = parseInt(btn.dataset.next, 10);
        goToStep(nextIdx);
      };
    });

    container.querySelectorAll('.btn-step-prev').forEach(btn => {
      btn.onclick = () => {
        const prevIdx = parseInt(btn.dataset.prev, 10);
        goToStep(prevIdx);
      };
    });

    // ── STEP 1: OVERVIEW & KPIS ──
    const KPI = [
      [t('dash.total') || 'Total complaints', 1284, 'var(--primary)', [1100, 1150, 1200, 1240, 1284]],
      [t('dash.resolved') || 'Resolved cases', 1042, 'var(--success)', [900, 940, 980, 1010, 1042]],
      [t('dash.pending') || 'Pending dispatch', 242, 'var(--warning)', [200, 210, 220, 230, 242]],
      [t('dash.emergency') || 'Emergency alerts', 3, 'var(--danger)', [1, 2, 1, 3, 3]]
    ];

    const kpiGrid = container.querySelector('#kpi-grid');
    if (kpiGrid) {
      KPI.forEach(([label, value, color, trend], i) => {
        const card = el('div', {
          className: 'glass',
          html: `
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <span class="kpi-value" id="kpi-${i}" style="color:${color}">0</span>
                <div class="kpi-label">${label}</div>
              </div>
              <div id="kpi-spark-${i}">${sparkline(trend, color)}</div>
            </div>
          `
        });
        kpiGrid.append(card);
      });

      KPI.forEach(([, value], i) => {
        const elem = container.querySelector(`#kpi-${i}`);
        if (elem) timers.push(countUp(elem, value, 1200));
      });
    }

    const barsEl = container.querySelector('#dash-bars');
    if (barsEl) {
      barsEl.innerHTML = barChart(MONTHS.map((m, i) => ({ label: m, v: REPORTED[i], v2: RESOLVED[i] })));
    }

    const ringEl = container.querySelector('#dash-ring');
    if (ringEl) ringEl.innerHTML = ringChart(RES_RATE);

    const statusEl = container.querySelector('#city-status');
    if (statusEl) {
      statusEl.innerHTML = STATUS_DATA.map(([name, detail, color]) => `
        <div class="stat-row">
          <span class="status-dot" style="background:${color}"></span>
          <b>${name}:</b>
          <span style="color:var(--text-muted);margin-left:4px">${detail}</span>
        </div>
      `).join('');
    }

    const sparkEl = container.querySelector('#response-sparkline');
    if (sparkEl) sparkEl.innerHTML = sparkline([5.1, 4.8, 4.2, 3.8, 3.5, 3.2], 'var(--success)', 120, 40);

    const ZONES_DATA = [
      { name: 'Zone 1 – Central', rate: 92, active: 38, units: 6, status: 'Optimal', color: 'var(--success)' },
      { name: 'Zone 2 – Riverside', rate: 87, active: 54, units: 4, status: 'Stable', color: 'var(--success)' },
      { name: 'Zone 3 – Tech Park', rate: 78, active: 82, units: 5, status: 'Attention', color: 'var(--warning)' },
      { name: 'Zone 4 – Old Town', rate: 71, active: 68, units: 3, status: 'Focus Area', color: 'var(--warning)' }
    ];

    const zoneSummaryList = container.querySelector('#zone-summary-list');
    if (zoneSummaryList) {
      zoneSummaryList.innerHTML = ZONES_DATA.map(z => `
        <div style="margin:var(--space-xs) 0">
          <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)">
            <b>${z.name}</b>
            <span style="color:${z.color};font-weight:700">${z.rate}% resolved (${z.active} active)</span>
          </div>
          <div class="progress-bar" style="margin-top:4px"><span class="progress-bar__fill" style="width:${z.rate}%;background:${z.color}"></span></div>
        </div>
      `).join('');
    }

    // ── STEP 2: ZONES ──
    const zoneGrid = container.querySelector('#zone-cards-grid');
    function renderZoneCards() {
      if (!zoneGrid) return;
      const filtered = activeZoneFilter === 'all' 
        ? ZONES_DATA 
        : ZONES_DATA.filter(z => z.name === activeZoneFilter);

      zoneGrid.innerHTML = filtered.map(z => `
        <div class="zone-card glass">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <h4 style="margin:0;font-size:1.05rem">${z.name}</h4>
            <span class="stage-pill ${z.rate >= 85 ? 'stage-pill--resolved' : 'stage-pill--assigned'}">${z.status}</span>
          </div>
          <div style="margin:var(--space-sm) 0">
            <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)">
              <span style="color:var(--text-muted)">Resolution Efficiency</span>
              <b>${z.rate}%</b>
            </div>
            <div class="progress-bar" style="margin-top:4px"><span class="progress-bar__fill" style="width:${z.rate}%;background:${z.color}"></span></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:var(--fs-xs);color:var(--text-muted);margin-top:var(--space-sm)">
            <div>Active Issues: <b style="color:var(--text-primary)">${z.active}</b></div>
            <div>Field Units: <b style="color:var(--text-primary)">${z.units} Crews</b></div>
          </div>
          <button class="dash-btn-mini btn-zone-patrol" data-zone="${z.name}" style="margin-top:var(--space-md);width:100%">📍 Deploy Zone Patrol</button>
        </div>
      `).join('');

      zoneGrid.querySelectorAll('.btn-zone-patrol').forEach(btn => {
        btn.onclick = () => {
          toastInfo(`Inspection squad assigned to inspect ${btn.dataset.zone} high-density nodes.`, btn.dataset.zone);
        };
      });
    }
    renderZoneCards();

    container.querySelectorAll('#zone-filter-chips .chip').forEach(ch => {
      ch.onclick = () => {
        container.querySelectorAll('#zone-filter-chips .chip').forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        activeZoneFilter = ch.dataset.zone;
        renderZoneCards();
      };
    });

    const zoneDiagBtn = container.querySelector('#zone-run-diagnostics');
    if (zoneDiagBtn) {
      zoneDiagBtn.onclick = () => {
        const statusEl = container.querySelector('#zone-scan-status');
        if (statusEl) statusEl.textContent = '⚡ Scanning All 4 Zones…';
        toastInfo('Pinging microgrid, water valves, and traffic sensors across all zones…', 'Sector Scan Started');
        setTimeout(() => {
          if (statusEl) statusEl.textContent = '● Diagnostics Normal (All 4 Zones)';
          toastSuccess('All municipal infrastructure operating within nominal thresholds.', 'Sector Health Confirmed');
        }, 1200);
      };
    }

    const zoneAlertBtn = container.querySelector('#zone-broadcast-alert');
    if (zoneAlertBtn) {
      zoneAlertBtn.onclick = () => {
        toastWarning('Live notification pushed to 18,400 registered citizens in Zone 3 & 4 regarding scheduled water maintenance.', 'Advisory Broadcast Sent');
      };
    }

    // ── STEP 3: INCIDENT TRIAGE ──
    const incidentTableBody = container.querySelector('#incident-table-body');
    const STAGE_CLASSES = ['stage-pill--submitted', 'stage-pill--assigned', 'stage-pill--in-progress', 'stage-pill--resolved'];

    function renderIncidentTable() {
      if (!incidentTableBody) return;
      const complaints = store.complaints;
      const entries = Object.entries(complaints);

      let filtered = entries;
      if (activeIncidentFilter !== 'all') {
        const targetStep = parseInt(activeIncidentFilter, 10);
        filtered = entries.filter(([, data]) => data.step === targetStep);
      }

      if (!filtered.length) {
        incidentTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;padding:var(--space-xl);color:var(--text-muted)">
              No complaints found in this stage category.
            </td>
          </tr>
        `;
        return;
      }

      incidentTableBody.innerHTML = filtered.map(([id, data]) => {
        const stepIdx = Math.min(Math.max(data.step || 0, 0), 3);
        const stageName = STEPS_NAMES[stepIdx] || 'Submitted';
        const isResolved = stepIdx >= 3;

        return `
          <tr id="row-${id}">
            <td><b style="font-family:var(--font-display);color:var(--primary)">${id}</b></td>
            <td><span class="badge">${data.cat}</span></td>
            <td><small style="color:var(--text-muted)">${data.zone}</small></td>
            <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${data.desc}">${data.desc}</td>
            <td>
              <span class="stage-pill ${STAGE_CLASSES[stepIdx]}">
                ${isResolved ? '✅ ' : '⏳ '}${stageName}
              </span>
            </td>
            <td style="text-align:right">
              ${isResolved 
                ? `<span style="color:var(--success);font-size:var(--fs-xs);font-weight:700">Archived</span>` 
                : `<button class="btn btn-sm btn-advance-stage" data-id="${id}" style="padding:4px 10px;font-size:11px">Advance Stage →</button>`
              }
            </td>
          </tr>
        `;
      }).join('');

      incidentTableBody.querySelectorAll('.btn-advance-stage').forEach(b => {
        b.onclick = () => {
          const id = b.dataset.id;
          const current = store.complaints[id];
          if (current && current.step < 3) {
            const nextStep = current.step + 1;
            store.updateStep(id, nextStep);
            store.addPoints(10);
            toastSuccess(`Ticket ${id} is now in stage "${STEPS_NAMES[nextStep]}". +10 Citizen points!`, 'Incident Advanced');
            renderIncidentTable();
          }
        };
      });
    }
    renderIncidentTable();

    container.querySelectorAll('#incident-filter-chips .chip').forEach(ch => {
      ch.onclick = () => {
        container.querySelectorAll('#incident-filter-chips .chip').forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        activeIncidentFilter = ch.dataset.filter;
        renderIncidentTable();
      };
    });

    const btnAddTest = container.querySelector('#btn-add-test-incident');
    if (btnAddTest) {
      btnAddTest.onclick = () => {
        const newId = `CL-${Math.floor(1050 + Math.random() * 900)}`;
        const sampleCategories = [
          { cat: 'Water leakage', desc: 'Broken municipal pipe causing street flooding', zone: 'Zone 3 – Tech Park' },
          { cat: 'Broken streetlight', desc: 'LED light outage near main junction', zone: 'Zone 1 – Central' },
          { cat: 'Garbage', desc: 'Overflowing commercial waste bin near market', zone: 'Zone 4 – Old Town' },
          { cat: 'Pothole', desc: 'Deep pothole damaging vehicles on ring road', zone: 'Zone 2 – Riverside' }
        ];
        const pick = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
        store.addComplaint(newId, {
          cat: pick.cat,
          step: 0,
          desc: pick.desc,
          zone: pick.zone,
          date: new Date().toISOString()
        });
        toastInfo(`Generated ${newId} (${pick.cat}) in ${pick.zone}. Step it forward in the table!`, 'New Incident Logged');
        renderIncidentTable();
      };
    }

    // ── STEP 4: IOT SENSORS ──
    const iotPingBtn = container.querySelector('#iot-ping-all');
    if (iotPingBtn) {
      iotPingBtn.onclick = () => {
        toastInfo('Pinging 1,450 IoT sensor nodes across water, power, traffic, and environmental grids…', 'Ping Broadcast Sent');
        setTimeout(() => {
          toastSuccess('1,450 of 1,450 nodes responded. Packet loss 0.00%. Network latency: 12ms.', 'Mesh Verified');
          const powerEl = container.querySelector('#iot-val-power');
          if (powerEl) powerEl.textContent = `${400 + Math.floor(Math.random() * 20)} MW`;
          const waterEl = container.querySelector('#iot-val-water');
          if (waterEl) waterEl.textContent = `${(60 + Math.random() * 4).toFixed(1)} PSI`;
        }, 1000);
      };
    }

    const iotWaterBtn = container.querySelector('#iot-btn-water');
    if (iotWaterBtn) {
      iotWaterBtn.onclick = () => {
        const waterEl = container.querySelector('#iot-val-water');
        if (waterEl) {
          waterEl.textContent = '65.8 PSI';
          toastSuccess('Pressure adjusted across Zone 1 & Zone 3 trunk line.', 'Pressure Valve Pulsed');
          setTimeout(() => { if (waterEl) waterEl.textContent = '62.4 PSI'; }, 3000);
        }
      };
    }

    // ── STEP 5: FLEET & AUDIT ──
    const btnAutoDispatch = container.querySelector('#btn-auto-dispatch');
    const dispatchLiveLog = container.querySelector('#dispatch-live-log');
    const dispatchLogText = container.querySelector('#dispatch-log-text');

    if (btnAutoDispatch) {
      btnAutoDispatch.onclick = () => {
        if (dispatchLiveLog && dispatchLogText) {
          dispatchLiveLog.style.display = 'block';
          dispatchLogText.innerHTML = `
            <span style="color:var(--success);font-weight:700">● DISPATCHED:</span> 
            Rapid Unit <b>#CR-04 (Zone 4 Old Town Team)</b> assigned to priority alert. 
            GPS Routing: <i>Via Lakeview Expressway</i>. Estimated Arrival: <b>4.8 minutes</b>.
          `;
          toastSuccess('Field crew #CR-04 is en route to Zone 4.', 'Response Unit Dispatched');
        }
      };
    }

    const btnCompleteAudit = container.querySelector('#btn-complete-audit');
    if (btnCompleteAudit) {
      btnCompleteAudit.onclick = () => {
        store.addPoints(25);
        const liveBadge = container.querySelector('#dash-live-badge');
        if (liveBadge) {
          liveBadge.innerHTML = '🏆 AUDIT 100%';
          liveBadge.style.background = 'rgba(47,191,113,0.25)';
        }
        toastSuccess('Daily municipal readiness audit signed off with 100% SLA compliance! +25 Citizen points.', 'City Audit Completed');
      };
    }

    // ── SIDEBAR QUICK ACTIONS ──
    container.querySelector('#dash-quick-sync').onclick = () => {
      toastInfo('Refreshed sensor streams, telemetry caches, and field unit coordinates.', 'Live Feeds Synced');
    };

    container.querySelector('#dash-quick-alert').onclick = () => {
      toastWarning('High Wind & Heavy Rain Advisory triggered for Coastal Zones. Automated storm drains opened.', '🚨 Emergency Broadcast Simulation');
    };

    container.querySelector('#dash-quick-csv').onclick = () => {
      const csvContent = "data:text/csv;charset=utf-8," +
        "Metric,Value,Status,Period\n" +
        "Total Complaints,1284,Active,2026-YTD\n" +
        "Resolved Complaints,1042,81.1% Resolution,2026-YTD\n" +
        "Pending Complaints,242,In Dispatch,2026-YTD\n" +
        "Emergency Alerts,3,Handled,2026-YTD\n" +
        "Average Response Time,3.2 hours,Optimal,Current\n" +
        "Zone 1 Central,92%,Optimal,Current\n" +
        "Zone 2 Riverside,87%,Good,Current\n" +
        "Zone 3 Tech Park,78%,Fair,Current\n" +
        "Zone 4 Old Town,71%,Focus Area,Current\n" +
        "Smart Water Pressure,62.4 PSI,Optimal,Telemetry\n" +
        "Air Quality Index,42 AQI,Good,Telemetry\n" +
        "Smart Grid Load,412 MW,Stable,Telemetry\n";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "smart_city_step_dashboard_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toastSuccess('Downloaded smart_city_step_dashboard_report.csv', 'Report Exported');
    };

    container.querySelector('#dash-quick-print').onclick = () => window.print();

    // Live KPI Tick
    timers.push(setInterval(() => {
      const tEl = container.querySelector('#kpi-0');
      const pEl = container.querySelector('#kpi-2');
      if (tEl && pEl) {
        tEl.textContent = +tEl.textContent + 1;
        pEl.textContent = +pEl.textContent + 1;
      }
    }, 6000));

    observeReveal(container);

    return () => { timers.forEach(clearInterval); };
  }
};
