<!-- FieldGuard v3.2
     desktopUI: 'embedded' = we control everything, no Windy CSS classes needed
     mobileUI:  'small'    = Windy puts this as bottom strip
-->

<!-- ════ DESKTOP: floating panel (embedded mode) ════════════
     We position this ourselves — bottom-left, above Windy controls
     Windy gives us full control with embedded mode
════════════════════════════════════════════════════════════ -->
<div class="fg-wrap">

  <!-- COLLAPSED STATE: always-visible pill bar ───────────── -->
  <div class="fg-bar" class:fg-expanded={expanded}>

    <!-- Logo + title -->
    <div class="fg-bar-brand" on:click={() => expanded = !expanded}>
      <img class="fg-bar-logo" src="./assets/logo-white.png"
        onerror="this.style.display='none'" alt="FG"/>
      <span class="fg-bar-title">FieldGuard</span>
      <span class="fg-bar-chevron">{expanded ? '▲' : '▼'}</span>
    </div>

    <!-- 4 pills -->
    {#if heat}
      <div class="fg-bar-pills">
        <button class="fg-p {activeCard==='heat'?'fg-p-on':''}"
          style="--c:{heat.zoneInfo.color}" on:click={() => toggleAndExpand('heat')}>
          <span class="fg-p-ic">🌡</span>
          <span class="fg-p-vl" style="color:{heat.zoneInfo.color}">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°'}</span>
          <span class="fg-p-lb" style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</span>
        </button>
        <button class="fg-p {activeCard==='wind'?'fg-p-on':''}"
          style="--c:{windResult?.riskColor}" on:click={() => toggleAndExpand('wind')}>
          <span class="fg-p-ic">💨</span>
          <span class="fg-p-vl" style="color:{windResult?.riskColor}">{rawData?.windMs.toFixed(1)}</span>
          <span class="fg-p-lb" style="color:{windResult?.riskColor}">{windResult?.riskLabel}</span>
        </button>
        <button class="fg-p {activeCard==='rain'?'fg-p-on':''}"
          style="--c:{rainResult?.riskColor}" on:click={() => toggleAndExpand('rain')}>
          <span class="fg-p-ic">🌧</span>
          <span class="fg-p-vl" style="color:{rainResult?.riskColor}">{rawData?.rainMmH.toFixed(1)}</span>
          <span class="fg-p-lb" style="color:{rainResult?.riskColor}">{rainResult?.riskLabel}</span>
        </button>
        <button class="fg-p {activeCard==='solar'?'fg-p-on':''}"
          style="--c:{solarColor}" on:click={() => toggleAndExpand('solar')}>
          <span class="fg-p-ic">{isNight?'🌙':'☀'}</span>
          <span class="fg-p-vl" style="color:{solarColor}">{isNight?'--':rawData?.solarWm2}</span>
          <span class="fg-p-lb" style="color:{solarColor}">{solarLabel}</span>
        </button>
        <button class="fg-rfr" on:click={refreshData} title="Refresh">↻</button>
      </div>
    {:else if loading}
      <div class="fg-bar-loading"><div class="fg-spin"></div> <span>Loading…</span></div>
    {:else}
      <button class="fg-bar-tap" on:click={refreshData}>⚡ Tap to load</button>
    {/if}
  </div>

  <!-- EXPANDED PANEL: slides up when expanded=true ───────── -->
  {#if expanded && heat}
    <div class="fg-panel">

      <!-- Location + time -->
      <div class="fg-loc">
        <span>📍 {locationName||(lat.toFixed(3)+', '+lon.toFixed(3))}</span>
        <span class="fg-loc-r">
          <span>{currentTime}</span>
          {#if isNight}<span class="fg-nbadge">🌙</span>
          {:else}<span class="fg-dbadge">☀</span>{/if}
        </span>
      </div>

      <!-- Tabs -->
      <div class="fg-tabs">
        {#each TABS as t}
          <button class="fg-tab {tab===t.id?'fg-tab-on':''}" on:click={() => tab=t.id}>
            {t.icon} {t.label}
          </button>
        {/each}
      </div>

      <!-- ── LIVE ── -->
      {#if tab === 'dashboard'}
        {#if heat.isBanPeriod}
          <div class="fg-ban">🚫 LEGAL WORK BAN · 12:30–15:30</div>
        {/if}

        {#if activeCard === 'heat'}
          <div class="fg-det" style="border-color:{heat.zoneInfo.color}">
            <div class="fg-det-ti" style="color:{heat.zoneInfo.color}">🌡 Heat Stress — {heat.zoneInfo.riskLabel}</div>
            <div class="fg-det-g">
              <div class="fg-dc"><span class="fg-dv">{rawData?.tempC}°C</span><span class="fg-dl">Temp</span></div>
              <div class="fg-dc"><span class="fg-dv">{rawData?.humidity}%</span><span class="fg-dl">Humidity</span></div>
              <div class="fg-dc"><span class="fg-dv">{heat.apparentTemp1}°C</span><span class="fg-dl">App.T A</span></div>
              <div class="fg-dc"><span class="fg-dv" style="color:{heat.zoneInfo.color}">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°C'}</span><span class="fg-dl">App.T B</span></div>
              <div class="fg-dc"><span class="fg-dv">{heat.wbgtBase}°C</span><span class="fg-dl">WBGT</span></div>
              <div class="fg-dc"><span class="fg-dv">{heat.wbgtAdjusted}°C</span><span class="fg-dl">WBGT+PPE</span></div>
            </div>
            <div class="fg-ds">
              <div class="fg-dr"><span class="fg-drl">🕐 Light</span><span class="fg-drv">{heat.workRestSchedule.light}</span></div>
              <div class="fg-dr"><span class="fg-drl">💪 Heavy</span><span class="fg-drv">{heat.workRestSchedule.heavy}</span></div>
              <div class="fg-dr"><span class="fg-drl">💧 Hydration</span><span class="fg-drv">{heat.hydration}</span></div>
            </div>
            <div class="fg-dct">⚠ Mandatory Controls</div>
            {#each heat.zoneInfo.mandatoryControls as c}<div class="fg-dci">▸ {c}</div>{/each}
          </div>
        {:else if activeCard === 'wind'}
          <div class="fg-det" style="border-color:{windResult?.riskColor}">
            <div class="fg-det-ti" style="color:{windResult?.riskColor}">💨 Wind — {windResult?.riskLabel}</div>
            <div class="fg-det-g">
              <div class="fg-dc"><span class="fg-dv">{rawData?.windMs.toFixed(1)} m/s</span><span class="fg-dl">Speed</span></div>
              <div class="fg-dc"><span class="fg-dv">{((rawData?.windMs??0)*3.6).toFixed(1)}</span><span class="fg-dl">km/h</span></div>
              <div class="fg-dc"><span class="fg-dv">Bft {windResult?.beaufort}</span><span class="fg-dl">{windResult?.beaufortDesc}</span></div>
            </div>
          </div>
        {:else if activeCard === 'rain'}
          <div class="fg-det" style="border-color:{rainResult?.riskColor}">
            <div class="fg-det-ti" style="color:{rainResult?.riskColor}">🌧 Rain — {rainResult?.riskLabel}</div>
            <div class="fg-det-g">
              <div class="fg-dc"><span class="fg-dv">{rawData?.rainMmH.toFixed(1)}</span><span class="fg-dl">mm/h</span></div>
              <div class="fg-dc"><span class="fg-dv">{rainResult?.intensityLabel}</span><span class="fg-dl">Intensity</span></div>
            </div>
          </div>
        {:else if activeCard === 'solar'}
          <div class="fg-det" style="border-color:{solarColor}">
            <div class="fg-det-ti" style="color:{solarColor}">{isNight?'🌙 Night':'☀ Solar — '+solarLabel}</div>
            {#if isNight}
              <div class="fg-night">🌙 Zero solar at night<br/><small>Sunrise: {sunriseTime} · Sunset: {sunsetTime}</small></div>
            {:else}
              <div class="fg-det-g">
                <div class="fg-dc"><span class="fg-dv">{rawData?.solarWm2} W/m²</span><span class="fg-dl">Irradiance</span></div>
                <div class="fg-dc"><span class="fg-dv">UV ~{uvIndex}</span><span class="fg-dl">Index</span></div>
                <div class="fg-dc"><span class="fg-dv">{solarElevDeg}°</span><span class="fg-dl">Sun angle</span></div>
              </div>
            {/if}
          </div>
        {/if}

        <div class="fg-mr">
          <select class="fg-mr-sel" bind:value={selectedModel} on:change={refreshData}>
            {#each MODELS as m}<option value={m.key}>{m.label}</option>{/each}
          </select>
          <label class="fg-mr-wc {!license.valid?'fg-dis':''}">
            <input type="checkbox" bind:checked={worstCaseMode} on:change={refreshData} disabled={!license.valid}/>
            Worst-case {#if !license.valid}<span class="fg-proch">PRO</span>{/if}
          </label>
        </div>

      {:else if tab === 'sos'}
        {#if !license.valid}
          <div class="fg-gate"><div class="fg-gate-ic">🚨</div><div class="fg-gate-ti">SOS — Pro Feature</div><a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a></div>
        {:else}
          <div class="fg-emg">
            <div class="fg-emg-w">⚠ Heat Stress Is Life-Threatening</div>
            <div class="fg-emg-syms">{#each HEAT_STRESS_SYMPTOMS as s}<span class="fg-sym">{s}</span>{/each}</div>
            <div class="fg-emg-hd">🚑 Response</div>
            {#each EMERGENCY_RESPONSE as step, i}
              <div class="fg-emg-step {step.includes('SEVERE')?'fg-emg-crit':''}"><span class="fg-emg-n">{i+1}</span> {step}</div>
            {/each}
          </div>
        {/if}

      {:else if tab === 'report'}
        {#if !license.valid}
          <div class="fg-gate"><div class="fg-gate-ic">📄</div><div class="fg-gate-ti">Reports — Pro Feature</div><a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a></div>
        {:else}
          <div class="fg-rform">
            <label>Project<input bind:value={reportMeta.projectName} placeholder="Project Name"/></label>
            <label>Country<input bind:value={reportMeta.country} placeholder="Oman, UAE…"/></label>
            <label>Client<input bind:value={reportMeta.clientName}/></label>
            <label>HSE Manager<input bind:value={reportMeta.hseManagerName}/></label>
          </div>
          <button class="fg-btn" on:click={generateReport}>📋 Generate ISO 7933 Report</button>
          {#if reportText}
            <div class="fg-rep">
              <div class="fg-rep-bar"><span>Ready</span><button class="fg-rep-btn" on:click={copyReport}>Copy</button><button class="fg-rep-btn" on:click={downloadReport}>.txt</button></div>
              <pre class="fg-rep-txt">{reportText}</pre>
            </div>
          {/if}
        {/if}

      {:else if tab === 'settings'}
        <div class="fg-grp">
          <div class="fg-grp-hd">🔑 License</div>
          {#if license.valid}
            <div class="fg-lic-act"><span class="fg-lic-b">✓ PRO</span><span class="fg-lic-i">{license.tier?.toUpperCase()} · {license.expires?.slice(0,10)}</span><button class="fg-lic-d" on:click={deactivateLicense}>Deactivate</button></div>
          {:else}
            <div class="fg-lic-free"><div class="fg-lic-ft">FREE</div><div class="fg-lic-fl">⚡ Worst-case · 📄 Reports · 🚨 SOS</div><a class="fg-btn fg-btn-amb" href="https://fieldguard-hse.com" target="_blank">Get Pro</a></div>
            <div class="fg-lic-row"><input class="fg-lic-in" bind:value={licenseKeyInput} placeholder="License key…" disabled={licenseLoading}/><button class="fg-lic-ab" on:click={activateLicense} disabled={licenseLoading||!licenseKeyInput.trim()}>{licenseLoading?'…':'Activate'}</button></div>
            {#if licenseError}<div class="fg-lic-err">⚠ {licenseError}</div>{/if}
          {/if}
        </div>
        <div class="fg-grp">
          <div class="fg-grp-hd">👷 PPE Profile</div>
          {#each Object.entries(PPE_PROFILES) as [key, prof]}
            <label class="fg-radio"><input type="radio" bind:group={settings.ppeProfile} value={key} on:change={saveSettings}/><span>{prof.label}</span><span class="fg-adjch">+{prof.adjustment}°C</span></label>
          {/each}
        </div>
        {#if license.valid}
        <div class="fg-grp">
          <div class="fg-grp-hd">🎛 Thresholds</div>
          <label class="fg-slbl">Wind Warn<div class="fg-srow"><input type="range" min="5" max="25" step="0.5" bind:value={settings.windWarnMs} on:change={saveSettings}/><span>{settings.windWarnMs} m/s</span></div></label>
          <label class="fg-slbl">Rain Warn<div class="fg-srow"><input type="range" min="1" max="25" step="0.5" bind:value={settings.rainWarnMmh} on:change={saveSettings}/><span>{settings.rainWarnMmh} mm/h</span></div></label>
        </div>
        {/if}
      {/if}

    </div>
  {/if}

</div>


<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { map } from '@windy/map';
  import { store } from '@windy/store';
  import { getLatLonInterpolator } from '@windy/interpolator';

  import {
    assessHeatStress, assessWind, assessRain,
    PPE_PROFILES,
    HEAT_STRESS_SYMPTOMS, EMERGENCY_RESPONSE,
    type WeatherInputs, type HeatAssessment, type WindResult, type RainResult,
  } from './hse-calculations';

  import { generateWeeklyReport, type WeeklyReportData } from './report-generator';

  // ── Core state ─────────────────────────────────────────────
  let tab = 'dashboard';
  let lat = 23.6, lon = 58.6;
  let locationName = '';
  let loading = false, error = '';
  let currentTime = '';
  let activeCard: string | null = 'heat'; // heat open by default

  // ── Weather state ──────────────────────────────────────────
  let rawData: WeatherInputs | null = null;
  let heat: HeatAssessment | null = null;
  let windResult: WindResult | null = null;
  let rainResult: RainResult | null = null;
  let modelResults: any[] = [];
  let worstModelLabel = '';
  let selectedModel = 'ecmwf';
  let worstCaseMode = false;
  let alertLog: any[] = [];
  let autoRefreshTimer: any = null;
  let reportText = '';

  // ── Solar / day-night state ────────────────────────────────
  let isNight = false;
  let solarElevDeg = 0;
  let solarPct = 0;
  let uvIndex = 0;
  let sunriseTime = '--:--';
  let sunsetTime  = '--:--';
  let solarNoonTime = '--:--';
  let wbgtSolarContrib = 0;
  let solarColor = '#4a6090';
  let solarLabel = 'LOW';

  // ── Solar calculations (day/night aware) ───────────────────
  function calcSolarPosition(latDeg: number, lonDeg: number, date: Date) {
    const JD = date.getTime() / 86400000 + 2440587.5;
    const n  = JD - 2451545.0;
    const L  = (280.46 + 0.9856474 * n) % 360;
    const g  = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
    const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2*g)) * Math.PI / 180;
    const epsilon = 23.439 * Math.PI / 180;
    const sinDec = Math.sin(epsilon) * Math.sin(lambda);
    const dec    = Math.asin(sinDec);
    const UT = date.getUTCHours() + date.getUTCMinutes()/60 + date.getUTCSeconds()/3600;
    const LSTM = 15 * Math.round(lonDeg / 15);
    const B   = (360/365) * (n - 81) * Math.PI / 180;
    const EoT = 9.87*Math.sin(2*B) - 7.53*Math.cos(B) - 1.5*Math.sin(B);
    const TC  = 4*(lonDeg - LSTM) + EoT;
    const LST = UT + TC/60;
    const HRA = (LST - 12) * 15 * Math.PI / 180;
    const latRad = latDeg * Math.PI / 180;
    const sinElev = Math.sin(latRad)*Math.sin(dec) + Math.cos(latRad)*Math.cos(dec)*Math.cos(HRA);
    const elev = Math.asin(sinElev) * 180 / Math.PI;
    // sunrise/sunset hour angle
    const cosHA_rise = -Math.tan(latRad) * Math.tan(dec);
    const HA_rise = Math.acos(Math.max(-1, Math.min(1, cosHA_rise))) * 180 / Math.PI;
    const sunrise_LST = 12 - HA_rise/15;
    const sunset_LST  = 12 + HA_rise/15;
    return { elev, LST, sunrise_LST, sunset_LST, solarNoon_LST: 12 };
  }

  function fmtLocalSolarTime(lst: number): string {
    // convert solar time to UTC for display (approximate)
    const h = Math.floor(((lst % 24) + 24) % 24);
    const m = Math.floor((lst - Math.floor(lst)) * 60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  function updateSolarState(inputs: WeatherInputs) {
    const now = new Date();
    const sol = calcSolarPosition(lat, lon, now);

    isNight = sol.elev < -0.833; // standard civil twilight threshold
    solarElevDeg = Math.round(sol.elev * 10) / 10;

    // Sun arc percentage (0 = sunrise, 100 = sunset)
    const dayLen = sol.sunset_LST - sol.sunrise_LST;
    solarPct = dayLen > 0
      ? Math.min(100, Math.max(0, ((sol.LST - sol.sunrise_LST) / dayLen) * 100))
      : 0;

    sunriseTime  = fmtLocalSolarTime(sol.sunrise_LST);
    sunsetTime   = fmtLocalSolarTime(sol.sunset_LST);
    solarNoonTime = fmtLocalSolarTime(sol.solarNoon_LST);

    // UV index approximation from W/m²
    uvIndex = isNight ? 0 : Math.round(inputs.solarWm2 / 25);

    // WBGT solar contribution (globe temp effect)
    const albedo = 0.37, emiss = 0.95, sigma = 5.67e-8;
    const Tk = inputs.tempC + 273.15;
    const Tg_K = Math.pow((1 - albedo) * inputs.solarWm2 / (emiss * sigma) + Tk**4, 0.25);
    const Tg = Tg_K - 273.15;
    wbgtSolarContrib = Math.round((0.2 * (Tg - inputs.tempC)) * 10) / 10;

    // Solar risk label and color
    const w = inputs.solarWm2;
    if (isNight)       { solarColor = '#a5b4fc'; solarLabel = 'NIGHT'; }
    else if (w < 200)  { solarColor = '#16a34a'; solarLabel = 'LOW'; }
    else if (w < 600)  { solarColor = '#d97706'; solarLabel = 'MODERATE'; }
    else if (w < 900)  { solarColor = '#dc2626'; solarLabel = 'HIGH'; }
    else               { solarColor = '#7c3aed'; solarLabel = 'EXTREME'; }
  }

  function toggleCard(id: string) {
    activeCard = activeCard === id ? null : id;
  }

  function toggleAndExpand(id: string) {
    if (activeCard === id) {
      expanded = !expanded;
    } else {
      activeCard = id;
      expanded = true;
    }
  }

  // ── License ────────────────────────────────────────────────
  interface LicenseData { valid: boolean; tier: string; expires: string; token?: string; }
  let license: LicenseData = { valid: false, tier: '', expires: '' };
  let licenseKeyInput = '';
  let licenseLoading = false;
  let licenseError = '';

  function isPro(): boolean {
    return license.valid && !!license.expires && new Date(license.expires) > new Date();
  }
  function loadLicense() {
    try {
      const s = localStorage.getItem('fg_license');
      if (s) {
        const p: LicenseData = JSON.parse(s);
        if (p.valid && new Date(p.expires) > new Date()) { license = p; worstCaseMode = true; }
      }
    } catch {}
  }
  async function activateLicense() {
    const key = licenseKeyInput.trim();
    if (!key) return;
    licenseLoading = true; licenseError = '';
    try {
      const res = await fetch('https://fieldguard-hse.com/api/validate', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ key, fingerprint: navigator.userAgent }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.valid) {
        license = { valid:true, tier:data.tier, expires:data.expires, token:data.token };
        localStorage.setItem('fg_license', JSON.stringify(license));
        licenseKeyInput = ''; worstCaseMode = true; refreshData();
      } else {
        licenseError = data.message ?? 'Invalid license key.';
      }
    } catch (e: any) {
      licenseError = e.message?.includes('fetch') ? 'Cannot reach fieldguard-hse.com' : (e.message ?? 'Activation failed.');
    }
    licenseLoading = false;
  }
  function deactivateLicense() {
    license = {valid:false,tier:'',expires:''}; localStorage.removeItem('fg_license'); worstCaseMode = false;
  }

  // ── Constants ──────────────────────────────────────────────
  const TABS = [
    { id:'dashboard', icon:'🏠', label:'Live'   },
    { id:'sos',       icon:'🚨', label:'SOS'    },
    { id:'report',    icon:'📄', label:'Report' },
    { id:'settings',  icon:'⚙',  label:'Config' },
  ];
  const MODELS = [
    {key:'ecmwf',label:'ECMWF'},{key:'gfs',label:'GFS'},{key:'icon',label:'ICON'},
    {key:'meps',label:'MEPS'},{key:'gem',label:'GEM'},{key:'access',label:'ACCESS-G'},
  ];
  const DEFAULT_SETTINGS = {
    ppeProfile:'coverall', wbgtWarnC:30, wbgtDangerC:32,
    windWarnMs:12, windDangerMs:20, rainWarnMmh:7.6, rainDangerMmh:25,
    soundAlerts:true, autoRefresh:false,
  };
  let settings = {...DEFAULT_SETTINGS};
  let reportMeta = {
    projectName:'', contractNumber:'', country:'', clientName:'', contractorName:'', hseManagerName:'',
    regulatoryRef:'Ministerial Decision No. 286/2008', banStart:'12:30', banEnd:'15:30',
    banMonths:'June, July, August', fidic:'UNDER REVIEW', delayDays:0,
  };

  // ── Data fetching ──────────────────────────────────────────
  async function fetchModelData(modelKey: string): Promise<WeatherInputs | null> {
    try {
      store.set('product', modelKey as any);
      await new Promise(r => setTimeout(r, 600));

      const read = async (overlay: string): Promise<any> => {
        store.set('overlay', overlay as any);
        await new Promise(r => setTimeout(r, 300));
        const interp = await getLatLonInterpolator();
        return interp ? await interp({ lat, lon }) : null;
      };

      const tempRaw  = await read('temp');
      const windRaw  = await read('wind');
      const humRaw   = await read('rh');
      const rainRaw  = await read('rain');
      const cloudRaw = await read('lclouds');

      const tempC   = Array.isArray(tempRaw)  ? tempRaw[0] - 273.15       : ((tempRaw ?? 298) - 273.15);
      const windMs  = Array.isArray(windRaw)  ? Math.sqrt(windRaw[0]**2 + windRaw[1]**2) : (windRaw ?? 0);
      const humidity= Array.isArray(humRaw)   ? humRaw[0]                 : (humRaw ?? 50);
      const rainMmH = Array.isArray(rainRaw)  ? Math.max(0, rainRaw[0])   : Math.max(0, rainRaw ?? 0);
      const cloudFrac = Math.min(1, Math.max(0, (Array.isArray(cloudRaw) ? cloudRaw[0] : (cloudRaw ?? 30)) / 100));

      // ── Day/night solar calculation ──────────────────────────
      const now = new Date();
      const sol = calcSolarPosition(lat, lon, now);
      const isNightLocal = sol.elev < -0.833;
      let solarWm2 = 0;
      if (!isNightLocal) {
        // Extraterrestrial radiation × atmosphere × cloud
        const elevRad = sol.elev * Math.PI / 180;
        const sinElev = Math.sin(elevRad);
        const I0 = 1361; // solar constant W/m²
        // Atmospheric transmittance (Beer-Lambert approximation)
        const airMass = sinElev > 0.01 ? 1 / sinElev : 100;
        const transmit = Math.pow(0.7, Math.pow(airMass, 0.678));
        const clearSky = I0 * transmit * sinElev;
        // Cloud attenuation: scattered clouds reduce by 25-75%
        solarWm2 = Math.round(Math.max(0, clearSky * (1 - 0.75 * cloudFrac)));
      }

      return {
        tempC: Math.round(tempC * 10) / 10,
        humidity: Math.min(100, Math.max(0, Math.round(humidity))),
        windMs: Math.max(0, Math.round(windMs * 10) / 10),
        solarWm2,
        rainMmH: Math.round(rainMmH * 10) / 10,
      };
    } catch { return null; }
  }

  async function loadFromOpenMeteo(): Promise<WeatherInputs | null> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,shortwave_radiation` +
        `&wind_speed_unit=ms&timezone=auto`;
      const j = await (await fetch(url)).json();
      const c = j.current;
      // Still apply day/night override for consistency
      const sol = calcSolarPosition(lat, lon, new Date());
      const solarWm2 = sol.elev < -0.833 ? 0 : (c.shortwave_radiation ?? 0);
      return {
        tempC: c.temperature_2m, humidity: c.relative_humidity_2m,
        windMs: c.wind_speed_10m, solarWm2, rainMmH: c.precipitation ?? 0,
      };
    } catch { return null; }
  }

  function processInputs(inputs: WeatherInputs) {
    const now = new Date();
    const localHour = now.getUTCHours() + lon / 15;
    const month = now.getMonth() + 1;
    return {
      heat: assessHeatStress(inputs, settings.ppeProfile, localHour, month),
      wind: assessWind(inputs.windMs, settings.windWarnMs, settings.windDangerMs),
      rain: assessRain(inputs.rainMmH, settings.rainWarnMmh, settings.rainDangerMmh),
    };
  }

  function zoneSeverity(zone: string): number {
    return ({green:0,amber:1,red:2,purple:3,black:4} as any)[zone] ?? 0;
  }

  async function refreshData() {
    loading = true; error = '';
    currentTime = new Date().toLocaleTimeString();
    try {
      const results: any[] = [];
      if (worstCaseMode && isPro()) {
        for (const model of MODELS) {
          const inputs = await fetchModelData(model.key);
          if (!inputs) continue;
          const {heat:h, wind:w, rain:r} = processInputs(inputs);
          results.push({modelKey:model.key, modelLabel:model.label, raw:inputs, heat:h, wind:w, rain:r, isWorst:false});
        }
      }
      if (results.length === 0) {
        const inputs = await fetchModelData(selectedModel) ?? await loadFromOpenMeteo();
        if (!inputs) throw new Error('No data available');
        const {heat:h, wind:w, rain:r} = processInputs(inputs);
        results.push({modelKey:selectedModel, modelLabel:MODELS.find(m=>m.key===selectedModel)?.label??selectedModel, raw:inputs, heat:h, wind:w, rain:r, isWorst:true});
      } else {
        results.sort((a,b) => {
          const zd = zoneSeverity(b.heat.zone) - zoneSeverity(a.heat.zone);
          return zd !== 0 ? zd : (b.heat.apparentTempFinal===999?99:b.heat.apparentTempFinal) - (a.heat.apparentTempFinal===999?99:a.heat.apparentTempFinal);
        });
        results[0].isWorst = true;
      }
      modelResults = results;
      rawData = results[0].raw;
      heat = results[0].heat;
      windResult = results[0].wind;
      rainResult = results[0].rain;
      worstModelLabel = results[0].modelLabel;
      updateSolarState(rawData);
      checkAlerts();
    } catch {
      error = 'Failed to fetch data. Try a different model or check connection.';
    }
    loading = false;
  }

  function checkAlerts() {
    if (!heat || !windResult || !rainResult) return;
    const time = new Date().toLocaleTimeString();
    if (heat.zone !== 'green') alertLog = [...alertLog, {time, type:`🌡 HEAT — ${heat.zoneInfo.riskLabel}`, color:heat.zoneInfo.color, message:`App.Temp: ${heat.apparentTempFinal===999?'NO WORK':heat.apparentTempFinal+'°C'} | ${heat.zoneInfo.label}`}];
    if (windResult.exceedsThreshold) alertLog = [...alertLog, {time, type:'💨 WIND ALERT', color:windResult.riskColor, message:`${rawData?.windMs.toFixed(1)} m/s — Bft ${windResult.beaufort} (${windResult.beaufortDesc})`}];
    if (rainResult.exceedsThreshold) alertLog = [...alertLog, {time, type:'🌧 RAIN ALERT', color:rainResult.riskColor, message:`${rawData?.rainMmH.toFixed(1)} mm/h — ${rainResult.intensityLabel}`}];
    if (heat.isBanPeriod) alertLog = [...alertLog, {time, type:'🚫 LEGAL WORK BAN', color:'#f97316', message:`12:30–15:30 outdoor ban active`}];
    if (heat.zone === 'red' || heat.zone === 'purple' || heat.zone === 'black') {
      if (settings.soundAlerts && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`FieldGuard: ${heat.zoneInfo.riskLabel}`, { body: heat.zoneInfo.mandatoryControls[0] });
      }
    }
  }

  function saveSettings() { try { localStorage.setItem('fieldguard_settings', JSON.stringify(settings)); } catch {} refreshData(); }
  function resetSettings() { settings = {...DEFAULT_SETTINGS}; saveSettings(); }
  function setupAutoRefresh() {
    if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
    if (settings.autoRefresh && isPro()) autoRefreshTimer = setInterval(refreshData, 15*60*1000);
  }

  function generateReport() {
    const today = new Date(), weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const fmt = (d:Date) => d.toISOString().split('T')[0];
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const dailyMet = days.map(day => ({day, maxTemp:rawData?.tempC??0, minTemp:(rawData?.tempC??8)-8, maxRH:rawData?.humidity??0, maxWind:rawData?.windMs??0, peakSolar:rawData?.solarWm2??0}));
    const wbgtLog = alertLog.filter(a=>a.type.includes('HEAT')).map((a,i)=>({date:fmt(new Date(today.getTime()-(6-i)*86400000)), time:a.time, durationH:0.5, wbgtBase:heat?.wbgtBase??0, wbgtAdj:heat?.wbgtAdjusted??0, ppe:PPE_PROFILES[settings.ppeProfile].label, zone:heat?.zoneInfo.riskLabel??'', action:heat?.zoneInfo.mandatoryControls[0]??''}));
    const rd: WeeklyReportData = {...reportMeta, siteAddress:locationName||(lat.toFixed(3)+', '+lon.toFixed(3)), lat, lon, weekStart:fmt(weekAgo), weekEnd:fmt(today), ppeProfile:PPE_PROFILES[settings.ppeProfile].label, ppeAdjustment:PPE_PROFILES[settings.ppeProfile].adjustment, dailyMet, wbgtLog, morningGap:[], suspensions:[], totalSuspensionHours:wbgtLog.reduce((s,e)=>s+e.durationH,0), cumulativeSuspensionHours:wbgtLog.reduce((s,e)=>s+e.durationH,0), forecastNarrative:`FieldGuard analysis at ${locationName||(lat.toFixed(3)+', '+lon.toFixed(3))} shows ${heat?.zoneInfo.riskLabel??'N/A'} zone.`};
    reportText = generateWeeklyReport(rd);
  }
  function copyReport() { navigator.clipboard?.writeText(reportText).catch(()=>{}); }
  function downloadReport() { const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([reportText],{type:'text/plain'})); a.download=`FieldGuard-ISO7933-${new Date().toISOString().split('T')[0]}.txt`; a.click(); }

  onMount(() => {
    try { const s=localStorage.getItem('fieldguard_settings'); if(s) settings={...DEFAULT_SETTINGS,...JSON.parse(s)}; } catch {}
    loadLicense();
    try { const c=map.getCenter(); lat=c.lat; lon=c.lng; } catch {}
    map.on('click', (e:any) => { lat=e.latlng.lat; lon=e.latlng.lng; refreshData(); });
    refreshData();
    setupAutoRefresh();
    if ('Notification' in window && Notification.permission==='default') Notification.requestPermission();
  });
  onDestroy(() => { if (autoRefreshTimer) clearInterval(autoRefreshTimer); map.off('click'); });
  export const onopen = (params:any) => { if (params?.lat && params?.lon) { lat=parseFloat(params.lat); lon=parseFloat(params.lon); refreshData(); } };
</script>

<style>
  /* FieldGuard v3.2 — embedded desktop + small mobile
     Brand: Navy #050a18/#0a1228/#1a2d55  Amber #e8962a
  */
  :root {
    --amb: #e8962a;
    --n1: #050a18; --n2: #0a1228; --n4: #1a2d55;
    --sl: #8a9cc8; --sl2: #4a6090;
  }

  /* ── OUTER WRAP ─────────────────────────────────────────────
     embedded mode: we position and size everything ourselves
     position: absolute puts it relative to Windy's container
  ─────────────────────────────────────────────────────────── */
  .fg-wrap {
    position: absolute;
    bottom: 110px;
    left: 10px;
    width: 300px;
    z-index: 1000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px;
  }

  /* ── ALWAYS-VISIBLE BAR ─────────────────────────────────── */
  .fg-bar {
    background: rgba(5,10,24,0.94);
    border: 1px solid rgba(232,150,42,0.5);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  .fg-bar.fg-expanded { border-radius: 10px 10px 0 0; border-bottom: none; }

  .fg-bar-brand {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 10px;
    background: rgba(5,10,24,0.98);
    border-bottom: 1px solid rgba(232,150,42,0.3);
    cursor: pointer; user-select: none;
  }
  .fg-bar-brand:hover { background: rgba(10,18,40,0.98); }
  .fg-bar-logo  { width: 20px; height: 20px; object-fit: contain; }
  .fg-bar-title { font-size: 12px; font-weight: 800; color: #fff; flex: 1; }
  .fg-bar-chevron { font-size: 9px; color: var(--sl2); }

  /* Pills row */
  .fg-bar-pills {
    display: flex; align-items: stretch; gap: 4px; padding: 6px 7px;
  }
  .fg-p {
    flex: 1; min-width: 0; display: flex; flex-direction: column;
    align-items: center; gap: 1px; padding: 6px 2px;
    background: rgba(10,18,40,0.8); border: 1px solid var(--c,#2d4080);
    border-radius: 7px; cursor: pointer; transition: all 0.15s;
  }
  .fg-p:hover { filter: brightness(1.2); }
  .fg-p.fg-p-on { border-width: 2px; background: rgba(18,32,68,0.95); }
  .fg-p-ic { font-size: 13px; line-height: 1; }
  .fg-p-vl { font-size: 12px; font-weight: 800; line-height: 1.1; }
  .fg-p-lb { font-size: 7px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; }
  .fg-rfr  {
    width: 24px; flex-shrink: 0; align-self: center;
    background: rgba(10,18,40,0.7); border: 1px solid rgba(45,64,128,0.5);
    border-radius: 6px; color: var(--sl); font-size: 14px; cursor: pointer;
    padding: 4px; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .fg-rfr:hover { border-color: var(--amb); color: var(--amb); }
  .fg-bar-loading { display: flex; align-items: center; gap: 7px; padding: 8px 10px; font-size: 10px; color: var(--sl); }
  .fg-bar-tap { width: 100%; padding: 8px 10px; background: transparent; border: none; color: var(--sl); font-size: 10px; cursor: pointer; text-align: left; }

  /* ── EXPANDED PANEL ─────────────────────────────────────── */
  .fg-panel {
    background: rgba(5,10,24,0.96);
    border: 1px solid rgba(232,150,42,0.4);
    border-top: none;
    border-radius: 0 0 10px 10px;
    max-height: 420px;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }

  .fg-loc { display: flex; align-items: center; justify-content: space-between; padding: 4px 9px; font-size: 9px; color: var(--sl); border-bottom: 1px solid rgba(255,255,255,0.04); }
  .fg-loc-r { display: flex; align-items: center; gap: 4px; }
  .fg-dbadge { background: #78350f; color: #fcd34d; border-radius: 3px; padding: 1px 4px; font-size: 7px; font-weight: 700; }
  .fg-nbadge { background: #1e1b4b; color: #a5b4fc; border-radius: 3px; padding: 1px 4px; font-size: 7px; font-weight: 700; }

  .fg-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .fg-tab { flex: 1; padding: 5px 2px; background: transparent; border: none; color: var(--sl2); cursor: pointer; font-size: 8px; border-bottom: 2px solid transparent; transition: all 0.15s; }
  .fg-tab.fg-tab-on { color: var(--amb); border-bottom-color: var(--amb); }

  .fg-ban { padding: 5px 9px; background: rgba(124,45,18,0.85); color: #fed7aa; font-size: 9px; font-weight: 700; text-align: center; }

  /* Detail */
  .fg-det { background: rgba(5,10,24,0.7); border: 1px solid; margin: 5px 7px; border-radius: 7px; padding: 8px; }
  .fg-det-ti { font-size: 9px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; }
  .fg-det-g  { display: grid; grid-template-columns: repeat(3,1fr); gap: 3px; margin-bottom: 5px; }
  .fg-dc { background: rgba(5,10,22,0.6); border-radius: 4px; padding: 4px 2px; text-align: center; }
  .fg-dv { font-size: 11px; font-weight: 800; color: #fff; display: block; }
  .fg-dl { font-size: 7px; color: var(--sl2); text-transform: uppercase; }
  .fg-ds { background: rgba(5,10,22,0.4); border-radius: 4px; padding: 4px; margin-bottom: 3px; }
  .fg-dr { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid rgba(10,18,38,0.9); font-size: 8px; }
  .fg-dr:last-child { border: none; }
  .fg-drl { color: var(--sl2); } .fg-drv { color: var(--sl); font-weight: 500; }
  .fg-dct { font-size: 8px; color: var(--amb); text-transform: uppercase; font-weight: 700; margin: 4px 0 3px; }
  .fg-dci { font-size: 8px; color: var(--sl); padding: 1px 0; border-bottom: 1px solid rgba(10,18,38,0.7); }
  .fg-dci:last-child { border: none; }
  .fg-night { padding: 8px; text-align: center; font-size: 10px; color: #a5b4fc; }

  /* Model row */
  .fg-mr { display: flex; align-items: center; gap: 5px; padding: 5px 7px; border-top: 1px solid rgba(255,255,255,0.05); }
  .fg-mr-sel { background: rgba(10,18,40,0.8); border: 1px solid rgba(45,64,128,0.5); color: #e8edf8; padding: 3px 5px; border-radius: 4px; font-size: 9px; }
  .fg-mr-wc { display: flex; align-items: center; gap: 3px; margin-left: auto; font-size: 8px; color: var(--sl); cursor: pointer; }
  .fg-proch { background: var(--amb); color: #0f1d42; font-size: 7px; font-weight: 800; padding: 1px 3px; border-radius: 2px; }

  /* SOS */
  .fg-emg { padding: 8px; }
  .fg-emg-w { font-size: 10px; font-weight: 700; color: #f87171; margin-bottom: 5px; }
  .fg-emg-syms { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 6px; }
  .fg-sym  { background: rgba(61,10,10,0.8); color: #fca5a5; border-radius: 3px; padding: 2px 5px; font-size: 8px; }
  .fg-emg-hd   { font-size: 8px; color: var(--sl2); text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
  .fg-emg-step { display: flex; gap: 5px; padding: 3px 0; font-size: 8px; color: var(--sl); border-bottom: 1px solid rgba(10,18,38,0.8); }
  .fg-emg-step:last-child { border: none; }
  .fg-emg-n    { background: rgba(45,64,128,0.6); color: #e8edf8; border-radius: 2px; padding: 1px 4px; font-size: 7px; font-weight: 700; flex-shrink: 0; }
  .fg-emg-crit { color: #f87171 !important; font-weight: 700; }
  .fg-emg-crit .fg-emg-n { background: #dc2626; }

  /* Report */
  .fg-rform { padding: 6px 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  label { display: block; color: var(--sl); font-size: 9px; }
  label input, label select { display: block; width: 100%; background: rgba(5,10,22,0.9); border: 1px solid rgba(45,64,128,0.5); color: #e8edf8; padding: 4px 6px; border-radius: 4px; font-size: 9px; margin-top: 2px; box-sizing: border-box; }
  .fg-btn { display: block; width: 100%; padding: 8px; border: none; font-size: 11px; font-weight: 800; cursor: pointer; background: var(--amb); color: #0f1d42; }
  .fg-btn-amb { display: block; text-align: center; text-decoration: none; background: var(--amb); color: #0f1d42 !important; padding: 6px; border-radius: 4px; font-size: 10px; font-weight: 800; margin-top: 4px; }
  .fg-rep { background: rgba(5,10,22,0.9); overflow: hidden; }
  .fg-rep-bar { display: flex; align-items: center; gap: 5px; padding: 4px 7px; background: rgba(10,18,40,0.9); border-bottom: 1px solid rgba(45,64,128,0.3); font-size: 9px; color: var(--sl2); }
  .fg-rep-bar span { flex: 1; }
  .fg-rep-btn { background: rgba(45,64,128,0.5); border: none; color: var(--sl); padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 8px; }
  .fg-rep-txt { padding: 6px; font-size: 8px; color: var(--sl); white-space: pre; overflow: auto; max-height: 150px; font-family: monospace; line-height: 1.4; }

  /* Settings */
  .fg-grp { padding: 7px 8px; border-bottom: 1px solid rgba(45,64,128,0.2); }
  .fg-grp-hd { font-size: 9px; font-weight: 700; color: var(--amb); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .fg-lic-act { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .fg-lic-b   { background: rgba(5,46,22,0.8); color: #4ade80; border: 1px solid #16a34a; border-radius: 4px; padding: 2px 6px; font-size: 9px; font-weight: 700; }
  .fg-lic-i   { font-size: 9px; color: #86efac; flex: 1; }
  .fg-lic-d   { background: rgba(10,18,40,0.8); border: 1px solid rgba(45,64,128,0.5); color: var(--sl); padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 8px; }
  .fg-lic-free { background: rgba(5,10,22,0.6); border-radius: 4px; padding: 6px; margin-bottom: 5px; }
  .fg-lic-ft  { font-size: 8px; font-weight: 700; color: var(--sl2); text-transform: uppercase; margin-bottom: 3px; }
  .fg-lic-fl  { font-size: 9px; color: var(--sl2); line-height: 1.6; margin-bottom: 4px; }
  .fg-lic-row { display: flex; gap: 4px; }
  .fg-lic-in  { flex: 1; background: rgba(5,10,22,0.9); border: 1px solid rgba(45,64,128,0.5); color: #e8edf8; padding: 4px 6px; border-radius: 4px; font-size: 9px; font-family: monospace; }
  .fg-lic-in:disabled { opacity: 0.5; }
  .fg-lic-ab  { background: var(--amb); border: none; color: #0f1d42; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: 800; white-space: nowrap; }
  .fg-lic-ab:disabled { background: rgba(45,64,128,0.4); color: var(--sl2); cursor: not-allowed; }
  .fg-lic-err { margin-top: 4px; font-size: 9px; color: #f87171; padding: 3px 6px; background: rgba(61,10,10,0.8); border-radius: 3px; }
  .fg-radio { display: flex; align-items: center; gap: 5px; padding: 3px 0; cursor: pointer; border-bottom: 1px solid rgba(5,10,22,0.8); font-size: 9px; color: #c8d4f0; }
  .fg-radio:last-child { border-bottom: none; }
  .fg-radio span { flex: 1; }
  .fg-adjch { background: rgba(5,10,22,0.8); color: var(--sl); border-radius: 2px; padding: 1px 3px; font-size: 8px; }
  .fg-slbl  { display: block; color: var(--sl); font-size: 9px; margin-bottom: 3px; }
  .fg-srow  { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .fg-srow input[type="range"] { flex: 1; accent-color: var(--amb); }
  .fg-srow span { min-width: 45px; text-align: right; color: var(--amb); font-size: 9px; font-weight: 700; }
  input[type="checkbox"] { accent-color: var(--amb); }

  /* Gate */
  .fg-gate { padding: 14px 10px; text-align: center; }
  .fg-gate-ic { font-size: 26px; margin-bottom: 5px; }
  .fg-gate-ti { font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 5px; }
  .fg-gate-btn { display: block; background: var(--amb); color: #0f1d42 !important; text-decoration: none; padding: 7px 10px; border-radius: 5px; font-size: 10px; font-weight: 800; }

  /* Spinner */
  .fg-spin { width: 13px; height: 13px; border: 2px solid rgba(45,64,128,0.5); border-top-color: var(--amb); border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fg-dis { opacity: 0.4; pointer-events: none; }

  /* ── MOBILE: Windy puts this as bottom strip ─────────────
     On mobile (small mode) the wrap is shown at bottom.
     Make it horizontal, compact, full width.
     #device-mobile is set on <html> by Windy on mobile.
  ─────────────────────────────────────────────────────────── */
  #device-mobile .fg-wrap {
    position: static;
    width: 100%;
    bottom: auto;
    left: auto;
  }
  #device-mobile .fg-bar {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: 2px solid var(--amb);
    border-bottom: none;
  }
  #device-mobile .fg-bar-brand {
    display: none; /* hide title on mobile — pills fill full width */
  }
  #device-mobile .fg-bar-pills {
    padding: 5px 6px 7px;
  }
  #device-mobile .fg-panel {
    border-radius: 0;
    border-left: none;
    border-right: none;
    max-height: 50vh;
  }
</style>