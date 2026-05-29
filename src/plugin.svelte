<!-- FieldGuard TEST PLUGIN v0.0.1
     Purpose: verify placement, mobile detection, license & remote config
     Replace src/plugin.svelte with this, build, open in Windy dev server.
     Shows a green box with live diagnostic info — nothing else.
-->

<div class="fg-test">

  <div class="fg-test-head">
    🛡 FieldGuard — TEST BUILD
    <span class="fg-test-v">v0.0.1</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">📍 Position</span>
    <span class="fg-test-val" id="fg-pos-check">checking…</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">📱 Mobile detect</span>
    <span class="fg-test-val" id="fg-mobile-check">checking…</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">🌍 Lat / Lon</span>
    <span class="fg-test-val">{lat.toFixed(4)}, {lon.toFixed(4)}</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">🌡 Windy data</span>
    <span class="fg-test-val">{dataStatus}</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">🔑 License API</span>
    <span class="fg-test-val" style="color:{licenseColor}">{licenseStatus}</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">⚙ Remote config</span>
    <span class="fg-test-val" style="color:{configColor}">{configStatus}</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">📦 Container</span>
    <span class="fg-test-val" id="fg-container-check">checking…</span>
  </div>

  <div class="fg-test-row">
    <span class="fg-test-lbl">🖥 Window size</span>
    <span class="fg-test-val" id="fg-size-check">checking…</span>
  </div>

  <div class="fg-test-divider"></div>

  <button class="fg-test-btn" on:click={runTests}>🔄 Re-run tests</button>
  <button class="fg-test-btn fg-test-btn-sec" on:click={testLicenseKey}>🔑 Test license call</button>

  {#if log.length > 0}
    <div class="fg-test-log">
      {#each log as entry}
        <div class="fg-test-log-row" style="color:{entry.ok ? '#4ade80' : '#f87171'}">{entry.ok ? '✓' : '✗'} {entry.msg}</div>
      {/each}
    </div>
  {/if}

</div>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { LatLon } from '@windy/interfaces';
  import windyInit from '@windy/init';

  let lat = 23.03, lon = 58.59;
  let dataStatus = 'not tested';
  let licenseStatus = 'not tested';
  let licenseColor = '#8a9cc8';
  let configStatus = 'not tested';
  let configColor = '#8a9cc8';
  let log: Array<{ok: boolean, msg: string}> = [];

  let map: any;
  let interpolator: any;

  windyInit({ requiredVersion: '3.7.0', features: { interpolator: true } }, windyAPI => {
    const { store, picker, broadcast, map: windyMap } = windyAPI;
    map = windyMap;

    onMount(() => {
      runTests();

      // Listen for location changes
      broadcast.on('paramsChanged', () => {
        try {
          const c = map.getCenter();
          lat = c.lat; lon = c.lng;
          dataStatus = `map center updated`;
        } catch (e) {}
      });

      // Test Windy data fetch
      try {
        const { lat: lt, lon: ln } = store.get('pickerLocation') ?? { lat: 23.03, lon: 58.59 };
        lat = lt; lon = ln;
      } catch {}

      testWindyData();
    });
  });

  function runTests() {
    log = [];

    // Test 1: Position — check where .fg-test sits in DOM
    setTimeout(() => {
      const el = document.querySelector('.fg-test') as HTMLElement;
      const posEl = document.getElementById('fg-pos-check');
      if (el && posEl) {
        const rect = el.getBoundingClientRect();
        const wh = window.innerHeight;
        const ww = window.innerWidth;
        const pos = `top:${Math.round(rect.top)}px left:${Math.round(rect.left)}px`;
        const quadrant = rect.top > wh/2 ? 'BOTTOM' : 'TOP';
        const side = rect.left > ww/2 ? 'RIGHT' : 'LEFT';
        posEl.textContent = `${quadrant}-${side} (${pos})`;
        posEl.style.color = (quadrant === 'BOTTOM' && side === 'RIGHT') ? '#4ade80' : '#f59e0b';
        log = [...log, {
          ok: quadrant === 'BOTTOM' && side === 'RIGHT',
          msg: `Placement: ${quadrant}-${side} — ${quadrant === 'BOTTOM' && side === 'RIGHT' ? 'CORRECT' : 'WRONG (should be BOTTOM-RIGHT)'}`
        }];
      }

      // Test 2: Mobile detection
      const mobileEl = document.getElementById('fg-mobile-check');
      const htmlEl = document.documentElement;
      const isMobile = htmlEl.id === 'device-mobile';
      if (mobileEl) {
        mobileEl.textContent = isMobile ? '✓ #device-mobile detected' : '✗ desktop (no #device-mobile)';
        mobileEl.style.color = '#4ade80';
      }
      log = [...log, { ok: true, msg: `Mobile: ${isMobile ? 'YES (#device-mobile on html)' : 'NO (desktop)'}` }];

      // Test 3: Container info
      const contEl = document.getElementById('fg-container-check');
      if (contEl && el) {
        const parent = el.parentElement;
        const grandParent = parent?.parentElement;
        const info = `parent: ${parent?.className?.substring(0,30) || parent?.id || 'unknown'}`;
        contEl.textContent = info;
        log = [...log, { ok: true, msg: `Container: ${parent?.outerHTML?.substring(0,80)}` }];
      }

      // Test 4: Window size
      const sizeEl = document.getElementById('fg-size-check');
      if (sizeEl) {
        sizeEl.textContent = `${window.innerWidth}×${window.innerHeight}px`;
      }

    }, 100);

    // Test remote config
    testRemoteConfig();
  }

  async function testWindyData() {
    try {
      const W = (window as any).W;
      if (W?.interpolator) {
        dataStatus = '✓ interpolator available';
        log = [...log, { ok: true, msg: 'Windy interpolator: accessible' }];
      } else {
        dataStatus = '⚠ interpolator not ready';
        log = [...log, { ok: false, msg: 'Windy interpolator: not available yet' }];
      }
    } catch (e: any) {
      dataStatus = `error: ${e.message}`;
      log = [...log, { ok: false, msg: `Windy data error: ${e.message}` }];
    }
  }

  async function testLicenseKey() {
    licenseStatus = 'calling…';
    licenseColor = '#e8962a';
    try {
      const res = await fetch('https://fieldguard-hse.com/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'TEST-KEY-PING', revalidate: false, test: true }),
        signal: AbortSignal.timeout(5000),
      });
      const status = res.status;
      const text = await res.text().catch(() => '');
      licenseStatus = `HTTP ${status} — ${text.substring(0, 60)}`;
      licenseColor = res.ok || status === 400 ? '#4ade80' : '#f87171';
      log = [...log, {
        ok: res.ok || status === 400,
        msg: `License API: HTTP ${status} (400 = server reachable, key rejected = correct)`
      }];
    } catch (e: any) {
      licenseStatus = `UNREACHABLE — ${e.message}`;
      licenseColor = '#f87171';
      log = [...log, { ok: false, msg: `License API: ${e.message}` }];
    }
  }

  async function testRemoteConfig() {
    configStatus = 'calling…';
    configColor = '#e8962a';
    try {
      const res = await fetch('https://fieldguard-hse.com/api/plugin-config', {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const keys = Object.keys(data);
        configStatus = keys.length > 0 ? `✓ ${keys.length} keys: ${keys.join(', ')}` : '✓ reachable (empty config)';
        configColor = '#4ade80';
        log = [...log, { ok: true, msg: `Remote config: OK — keys: ${keys.join(', ') || 'none yet'}` }];
      } else {
        configStatus = `HTTP ${res.status}`;
        configColor = res.status === 404 ? '#f59e0b' : '#f87171';
        log = [...log, {
          ok: res.status === 404,
          msg: `Remote config: HTTP ${res.status} ${res.status === 404 ? '(endpoint not created yet — OK)' : '(error)'}`
        }];
      }
    } catch (e: any) {
      configStatus = `UNREACHABLE`;
      configColor = '#f87171';
      log = [...log, { ok: false, msg: `Remote config: unreachable — ${e.message}` }];
    }
  }

  onDestroy(() => {});
</script>

<style>
  .fg-test {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
    font-size: 11px;
    background: #0a0f1e;
    border: 2px solid #22c55e;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.7);
  }

  .fg-test-head {
    background: #064e3b;
    color: #4ade80;
    font-weight: 800;
    font-size: 12px;
    padding: 8px 12px;
    border-bottom: 1px solid #22c55e;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fg-test-v {
    font-size: 9px;
    background: #022c22;
    padding: 2px 6px;
    border-radius: 3px;
    color: #86efac;
  }

  .fg-test-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 5px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .fg-test-lbl {
    flex-shrink: 0;
    width: 120px;
    color: #64748b;
    font-size: 10px;
  }
  .fg-test-val {
    flex: 1;
    color: #94a3b8;
    font-size: 10px;
    word-break: break-all;
  }

  .fg-test-divider {
    height: 1px;
    background: #1e293b;
    margin: 4px 0;
  }

  .fg-test-btn {
    display: block;
    width: calc(50% - 12px);
    margin: 6px 6px 0;
    padding: 6px;
    background: #166534;
    border: 1px solid #22c55e;
    color: #4ade80;
    border-radius: 5px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    float: left;
  }
  .fg-test-btn-sec {
    background: #1e3a5f;
    border-color: #3b82f6;
    color: #93c5fd;
  }
  .fg-test-btn:last-of-type {
    margin-bottom: 6px;
  }

  .fg-test-log {
    clear: both;
    background: #020817;
    border-top: 1px solid #1e293b;
    padding: 6px 10px;
    max-height: 150px;
    overflow-y: auto;
  }
  .fg-test-log-row {
    font-size: 9px;
    padding: 1px 0;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
