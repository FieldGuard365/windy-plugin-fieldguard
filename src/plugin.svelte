<!-- ══ BOTTOM WIDGET BAR ═══════════════════════════════════════
     This is the always-visible compact strip.
     On mobile (mobileUI=small): shown at bottom by Windy as plugin__mobile-header
     On desktop (box mode): shown as compact header of the floating box
════════════════════════════════════════════════════════════════ -->
<div class="plugin__mobile-header fg-bar">

  {#if loading}
    <div class="fg-bar-loading">
      <div class="fg-bar-spin"></div>
      <span>Loading…</span>
    </div>
  {:else if heat}

    <!-- 4 horizontal pills -->
    <button class="fg-bar-pill {activeDetail==='heat'?'fg-bar-pill-active':''}"
      style="--pc:{heat.zoneInfo.color}"
      on:click={() => toggleDetail('heat')}>
      <span class="fg-bar-pill-icon">🌡</span>
      <span class="fg-bar-pill-val">{heat.apparentTempFinal === 999 ? 'NW' : heat.apparentTempFinal+'°'}</span>
      <span class="fg-bar-pill-lbl" style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</span>
    </button>

    <button class="fg-bar-pill {activeDetail==='wind'?'fg-bar-pill-active':''}"
      style="--pc:{windResult?.riskColor}"
      on:click={() => toggleDetail('wind')}>
      <span class="fg-bar-pill-icon">💨</span>
      <span class="fg-bar-pill-val">{rawData?.windMs.toFixed(1)}<span class="fg-bar-unit">m/s</span></span>
      <span class="fg-bar-pill-lbl" style="color:{windResult?.riskColor}">{windResult?.riskLabel}</span>
    </button>

    <button class="fg-bar-pill {activeDetail==='rain'?'fg-bar-pill-active':''}"
      style="--pc:{rainResult?.riskColor}"
      on:click={() => toggleDetail('rain')}>
      <span class="fg-bar-pill-icon">🌧</span>
      <span class="fg-bar-pill-val">{rawData?.rainMmH.toFixed(1)}<span class="fg-bar-unit">mm</span></span>
      <span class="fg-bar-pill-lbl" style="color:{rainResult?.riskColor}">{rainResult?.riskLabel}</span>
    </button>

    <button class="fg-bar-pill {activeDetail==='solar'?'fg-bar-pill-active':''}"
      style="--pc:{solarColor}"
      on:click={() => toggleDetail('solar')}>
      <span class="fg-bar-pill-icon">{isNight ? '🌙' : '☀'}</span>
      <span class="fg-bar-pill-val">{isNight ? '--' : rawData?.solarWm2}<span class="fg-bar-unit">{isNight ? '' : 'W'}</span></span>
      <span class="fg-bar-pill-lbl" style="color:{solarColor}">{solarLabel}</span>
    </button>

    {#if heat.isBanPeriod}
      <div class="fg-bar-ban">🚫</div>
    {/if}

    <button class="fg-bar-refresh" on:click={refreshData}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M8 16H3v5"/>
      </svg>
    </button>

  {:else}
    <button class="fg-bar-tap" on:click={refreshData}>⚡ Tap to load FieldGuard</button>
  {/if}

</div>

<section class="plugin__content fg">

  <!-- ══ DETAIL OVERLAY — shown when a bottom pill is tapped ══ -->
  {#if activeDetail}
    <div class="fg-overlay" on:click|self={() => activeDetail = null}>
      <div class="fg-overlay-panel">

        <!-- Close button -->
        <button class="fg-overlay-close" on:click={() => activeDetail = null}>✕</button>

        <!-- Location + time header -->
        <div class="fg-overlay-loc">
          📍 {locationName || (lat.toFixed(3)+', '+lon.toFixed(3))}
          <span class="fg-overlay-time">{currentTime}</span>
          {#if isNight}<span class="fg-night-badge">🌙 Night</span>
          {:else}<span class="fg-day-badge">☀ Day</span>{/if}
        </div>

        <!-- Tab pills inside overlay -->
        <div class="fg-overlay-tabs">
          {#each TABS as t}
            <button class="fg-overlay-tab {tab===t.id?'active':''}" on:click={() => tab=t.id}>
              {t.icon} {t.label}
            </button>
          {/each}
        </div>

        <!-- Content based on active tab -->
        {#if tab === 'dashboard'}

          {#if heat.isBanPeriod}
            <div class="fg-ban-bar">🚫 LEGAL WORK BAN ACTIVE · 12:30–15:30</div>
          {/if}

          <!-- 4 pill selectors inside overlay -->
          <div class="fg-overlay-pills">
            <button class="fg-ov-pill {activeDetail==='heat'?'active':''}"
              style="--pc:{heat.zoneInfo.color}" on:click={() => activeDetail='heat'}>
              🌡 <span style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</span>
            </button>
            <button class="fg-ov-pill {activeDetail==='wind'?'active':''}"
              style="--pc:{windResult?.riskColor}" on:click={() => activeDetail='wind'}>
              💨 <span style="color:{windResult?.riskColor}">{windResult?.riskLabel}</span>
            </button>
            <button class="fg-ov-pill {activeDetail==='rain'?'active':''}"
              style="--pc:{rainResult?.riskColor}" on:click={() => activeDetail='rain'}>
              🌧 <span style="color:{rainResult?.riskColor}">{rainResult?.riskLabel}</span>
            </button>
            <button class="fg-ov-pill {activeDetail==='solar'?'active':''}"
              style="--pc:{solarColor}" on:click={() => activeDetail='solar'}>
              {isNight?'🌙':'☀'} <span style="color:{solarColor}">{solarLabel}</span>
            </button>
          </div>

          <!-- Detail content -->
          {#if activeDetail === 'heat'}
            <div class="fg-detail-panel" style="border-color:{heat.zoneInfo.color}">
              <div class="fg-dp-title" style="color:{heat.zoneInfo.color}">🌡 Heat Stress — {heat.zoneInfo.riskLabel}</div>
              <div class="fg-dp-metrics">
                <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.tempC}°C</span><span class="fg-dp-l">Temp</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.humidity}%</span><span class="fg-dp-l">Humidity</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v">{heat.apparentTemp1}°C</span><span class="fg-dp-l">App.Temp A</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v" style="color:{heat.zoneInfo.color}">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°C'}</span><span class="fg-dp-l">App.Temp B</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v">{heat.wbgtBase}°C</span><span class="fg-dp-l">WBGT</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v">{heat.wbgtAdjusted}°C</span><span class="fg-dp-l">WBGT+PPE</span></div>
              </div>
              <div class="fg-dp-schedule">
                <div class="fg-dp-row"><span class="fg-dp-rl">🕐 Light work</span><span class="fg-dp-rv">{heat.workRestSchedule.light}</span></div>
                <div class="fg-dp-row"><span class="fg-dp-rl">💪 Heavy work</span><span class="fg-dp-rv">{heat.workRestSchedule.heavy}</span></div>
                <div class="fg-dp-row"><span class="fg-dp-rl">💧 Hydration</span><span class="fg-dp-rv">{heat.hydration}</span></div>
                <div class="fg-dp-row"><span class="fg-dp-rl">👁 Monitoring</span><span class="fg-dp-rv fg-dp-rv-sm">{heat.zoneInfo.monitoringSchedule}</span></div>
              </div>
              <div class="fg-dp-controls-title">⚠ Mandatory Controls</div>
              {#each heat.zoneInfo.mandatoryControls as ctrl}
                <div class="fg-dp-ctrl">▸ {ctrl}</div>
              {/each}
              <div class="fg-dp-ppe">PPE: {PPE_PROFILES[settings.ppeProfile].label} (+{PPE_PROFILES[settings.ppeProfile].adjustment}°C)</div>
            </div>
          {:else if activeDetail === 'wind'}
            <div class="fg-detail-panel" style="border-color:{windResult?.riskColor}">
              <div class="fg-dp-title" style="color:{windResult?.riskColor}">💨 Wind — {windResult?.riskLabel}</div>
              <div class="fg-dp-metrics">
                <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.windMs.toFixed(1)}</span><span class="fg-dp-l">m/s</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v">{((rawData?.windMs??0)*3.6).toFixed(1)}</span><span class="fg-dp-l">km/h</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v">Bft {windResult?.beaufort}</span><span class="fg-dp-l">{windResult?.beaufortDesc}</span></div>
              </div>
              <div class="fg-dp-threshold">Warn ≥ {settings.windWarnMs} m/s · Danger ≥ {settings.windDangerMs} m/s</div>
            </div>
          {:else if activeDetail === 'rain'}
            <div class="fg-detail-panel" style="border-color:{rainResult?.riskColor}">
              <div class="fg-dp-title" style="color:{rainResult?.riskColor}">🌧 Rain — {rainResult?.riskLabel}</div>
              <div class="fg-dp-metrics">
                <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.rainMmH.toFixed(1)}</span><span class="fg-dp-l">mm/h</span></div>
                <div class="fg-dp-m"><span class="fg-dp-v">{rainResult?.intensityLabel}</span><span class="fg-dp-l">Intensity</span></div>
              </div>
              <div class="fg-dp-threshold">Warn ≥ {settings.rainWarnMmh} mm/h · Danger ≥ {settings.rainDangerMmh} mm/h</div>
            </div>
          {:else if activeDetail === 'solar'}
            <div class="fg-detail-panel" style="border-color:{solarColor}">
              <div class="fg-dp-title" style="color:{solarColor}">{isNight ? '🌙 Night — No Solar' : '☀ Solar — '+solarLabel}</div>
              {#if isNight}
                <div class="fg-dp-night-msg">
                  <div class="fg-dp-night-icon">🌙</div>
                  <div>Solar radiation is <strong>zero</strong> at night. WBGT uses only temperature, humidity and wind.</div>
                  <div class="fg-dp-night-sub">Sunrise: ~{sunriseTime} · Sunset: ~{sunsetTime}</div>
                </div>
              {:else}
                <div class="fg-dp-metrics">
                  <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.solarWm2}</span><span class="fg-dp-l">W/m²</span></div>
                  <div class="fg-dp-m"><span class="fg-dp-v">UV ~{uvIndex}</span><span class="fg-dp-l">Index</span></div>
                  <div class="fg-dp-m"><span class="fg-dp-v">{solarElevDeg}°</span><span class="fg-dp-l">Sun angle</span></div>
                </div>
                <div class="fg-dp-solar-bar">
                  <div class="fg-dp-solar-track">
                    <div class="fg-dp-solar-fill" style="width:{solarPct}%;background:{solarColor}"></div>
                    <div class="fg-dp-solar-sun" style="left:{solarPct}%">☀</div>
                  </div>
                  <div class="fg-dp-solar-labels"><span>Dawn</span><span>Solar Noon</span><span>Dusk</span></div>
                </div>
                <div class="fg-dp-schedule">
                  <div class="fg-dp-row"><span class="fg-dp-rl">Sunrise</span><span class="fg-dp-rv">{sunriseTime}</span></div>
                  <div class="fg-dp-row"><span class="fg-dp-rl">Solar noon</span><span class="fg-dp-rv">{solarNoonTime}</span></div>
                  <div class="fg-dp-row"><span class="fg-dp-rl">Sunset</span><span class="fg-dp-rv">{sunsetTime}</span></div>
                  <div class="fg-dp-row"><span class="fg-dp-rl">WBGT solar contribution</span><span class="fg-dp-rv">+{wbgtSolarContrib}°C</span></div>
                </div>
              {/if}
              <div class="fg-dp-threshold">0–200 Low · 200–600 Moderate · 600–900 High · &gt;900 Extreme (W/m²)</div>
            </div>
          {/if}

          <!-- Model row at bottom of overlay -->
          <div class="fg-model-row">
            <select class="fg-model-select" bind:value={selectedModel} on:change={refreshData}>
              {#each MODELS as m}<option value={m.key}>{m.label}</option>{/each}
            </select>
            <label class="fg-worst-toggle {!license.valid?'fg-toggle-disabled':''}">
              <input type="checkbox" bind:checked={worstCaseMode} on:change={refreshData} disabled={!license.valid}/>
              <span>Worst-case ⚡</span>
              {#if !license.valid}<span class="fg-pro-chip">PRO</span>{/if}
            </label>
          </div>

        {:else if tab === 'sos'}
          {#if !license.valid}
            <div class="fg-gate"><div class="fg-gate-icon">🚨</div><div class="fg-gate-title">SOS — Pro Feature</div><a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a></div>
          {:else}
            <div class="fg-section-hd">🚨 Emergency Response</div>
            <div class="fg-emg-card">
              <div class="fg-emg-warn">⚠ Heat Stress Is Life-Threatening</div>
              <div class="fg-emg-section-hd">🔴 SYMPTOMS (every 2 hours)</div>
              <div class="fg-emg-symptoms">{#each HEAT_STRESS_SYMPTOMS as s}<span class="fg-emg-symptom">● {s}</span>{/each}</div>
              <div class="fg-emg-section-hd">🚑 RESPONSE STEPS</div>
              {#each EMERGENCY_RESPONSE as step, i}
                <div class="fg-emg-step {step.includes('SEVERE')?'fg-emg-critical':''}">
                  <span class="fg-emg-n">{i+1}</span> {step}
                </div>
              {/each}
            </div>
          {/if}

        {:else if tab === 'report'}
          {#if !license.valid}
            <div class="fg-gate"><div class="fg-gate-icon">📄</div><div class="fg-gate-title">Reports — Pro Feature</div><a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a></div>
          {:else}
            <div class="fg-section-hd">📄 ISO 7933 Weekly Report</div>
            <div class="fg-form-grid">
              <label>Project<input bind:value={reportMeta.projectName} placeholder="Project Name"/></label>
              <label>Country<input bind:value={reportMeta.country} placeholder="Oman, UAE…"/></label>
              <label>Client<input bind:value={reportMeta.clientName}/></label>
              <label>Contractor<input bind:value={reportMeta.contractorName}/></label>
              <label>HSE Manager<input bind:value={reportMeta.hseManagerName}/></label>
              <label>FIDIC<select bind:value={reportMeta.fidic}><option>ELIGIBLE</option><option>NOT ELIGIBLE</option><option>UNDER REVIEW</option></select></label>
            </div>
            <button class="fg-action-btn" on:click={generateReport}>📋 Generate Report</button>
            {#if reportText}
              <div class="fg-report-box">
                <div class="fg-report-toolbar"><span>Report ready</span><button class="fg-mini-btn" on:click={copyReport}>📋 Copy</button><button class="fg-mini-btn" on:click={downloadReport}>⬇ .txt</button></div>
                <pre class="fg-report-pre">{reportText}</pre>
              </div>
            {/if}
          {/if}

        {:else if tab === 'settings'}
          <div class="fg-setting-group fg-license-group">
            <div class="fg-setting-hd">🔑 License</div>
            {#if license.valid}
              <div class="fg-license-active"><span class="fg-license-badge">✓ PRO</span><span class="fg-license-info">{license.tier?.toUpperCase()} · expires {license.expires?.slice(0,10)}</span><button class="fg-deact-btn" on:click={deactivateLicense}>Deactivate</button></div>
            {:else}
              <div class="fg-license-free-box"><div class="fg-free-tag">FREE TIER</div><div class="fg-free-list">⚡ Multi-model worst-case<br/>📄 ISO 7933 reports<br/>🚨 SOS emergency tab<br/>🎛 Custom thresholds</div><a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Get Pro</a></div>
              <div class="fg-key-row"><input class="fg-key-input" bind:value={licenseKeyInput} placeholder="Paste license key…" disabled={licenseLoading}/><button class="fg-key-btn" on:click={activateLicense} disabled={licenseLoading||!licenseKeyInput.trim()}>{licenseLoading?'…':'Activate'}</button></div>
              {#if licenseError}<div class="fg-key-error">⚠ {licenseError}</div>{/if}
            {/if}
          </div>
          <div class="fg-setting-group">
            <div class="fg-setting-hd">👷 PPE Profile</div>
            {#each Object.entries(PPE_PROFILES) as [key, prof]}
              <label class="fg-radio-row"><input type="radio" bind:group={settings.ppeProfile} value={key} on:change={saveSettings}/><span>{prof.label}</span><span class="fg-adj-chip">+{prof.adjustment}°C</span></label>
            {/each}
          </div>
          {#if license.valid}
          <div class="fg-setting-group">
            <div class="fg-setting-hd">🌡 WBGT · 💨 Wind · 🌧 Rain Thresholds</div>
            <label class="fg-slider-label">WBGT Warn (°C)<div class="fg-slider-row"><input type="range" min="28" max="38" step="0.5" bind:value={settings.wbgtWarnC} on:change={saveSettings}/><span>{settings.wbgtWarnC}°C</span></div></label>
            <label class="fg-slider-label">WBGT Danger (°C)<div class="fg-slider-row"><input type="range" min="30" max="42" step="0.5" bind:value={settings.wbgtDangerC} on:change={saveSettings}/><span>{settings.wbgtDangerC}°C</span></div></label>
            <label class="fg-slider-label">Wind Warn (m/s)<div class="fg-slider-row"><input type="range" min="5" max="25" step="0.5" bind:value={settings.windWarnMs} on:change={saveSettings}/><span>{settings.windWarnMs} m/s</span></div></label>
            <label class="fg-slider-label">Wind Danger (m/s)<div class="fg-slider-row"><input type="range" min="10" max="35" step="0.5" bind:value={settings.windDangerMs} on:change={saveSettings}/><span>{settings.windDangerMs} m/s</span></div></label>
            <label class="fg-slider-label">Rain Warn (mm/h)<div class="fg-slider-row"><input type="range" min="1" max="25" step="0.5" bind:value={settings.rainWarnMmh} on:change={saveSettings}/><span>{settings.rainWarnMmh} mm/h</span></div></label>
            <label class="fg-slider-label">Rain Danger (mm/h)<div class="fg-slider-row"><input type="range" min="5" max="60" step="1" bind:value={settings.rainDangerMmh} on:change={saveSettings}/><span>{settings.rainDangerMmh} mm/h</span></div></label>
            <button class="fg-action-btn fg-action-btn-sec" on:click={resetSettings}>↩ Reset Defaults</button>
          </div>
          {/if}
          <div class="fg-setting-group">
            <div class="fg-setting-hd">🔔 Alerts</div>
            <label class="fg-toggle-row"><input type="checkbox" bind:checked={settings.soundAlerts} on:change={saveSettings}/>Browser notifications</label>
            <label class="fg-toggle-row {!license.valid?'fg-locked':''}"><input type="checkbox" bind:checked={settings.autoRefresh} on:change={setupAutoRefresh} disabled={!license.valid}/>Auto-refresh 15 min {#if !license.valid}<span class="fg-pro-chip">PRO</span>{/if}</label>
          </div>
        {/if}

      </div>
    </div>
  {/if}

  <!-- ══ HEADER ══════════════════════════════════════════════ -->
  <div class="fg-header">
    <img class="fg-logo" src="./assets/logo-white.png" 
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
         alt="FieldGuard" />
    <div class="fg-logo-fallback" style="display:none">🛡️</div>
    <div class="fg-header-text">
      <span class="fg-title">FieldGuard</span>
      <span class="fg-subtitle">Real-time Heat & Weather Safety</span>
    </div>
    <div class="fg-header-right">
      <button class="fg-icon-btn" on:click={refreshData} title="Refresh">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
      </button>
      <button class="fg-icon-btn {tab==='settings'?'active':''}" on:click={() => tab = tab==='settings'?'dashboard':'settings'} title="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12H4M20 12h2"/></svg>
      </button>
    </div>
  </div>

  <!-- ══ LOCATION BAR ════════════════════════════════════════ -->
  <div class="fg-loc-bar">
    <span class="fg-loc-pin">📍</span>
    <span class="fg-loc-name">{locationName || (lat.toFixed(3)+', '+lon.toFixed(3))}</span>
    <span class="fg-loc-time">{currentTime}</span>
    {#if isNight}
      <span class="fg-night-badge">🌙 Night</span>
    {:else}
      <span class="fg-day-badge">☀ Day</span>
    {/if}
  </div>

  <!-- ══ TAB BAR ═════════════════════════════════════════════ -->
  <div class="fg-tabs">
    {#each TABS as t}
      <button class="fg-tab {tab===t.id?'active':''}" on:click={() => tab=t.id}>
        <span class="fg-tab-icon">{t.icon}</span>
        <span class="fg-tab-label">{t.label}</span>
      </button>
    {/each}
  </div>

  <!-- ══ DASHBOARD ═══════════════════════════════════════════ -->
  {#if tab === 'dashboard'}

    {#if loading}
      <div class="fg-loading">
        <div class="fg-spinner"></div>
        <span>Reading {worstCaseMode ? 'all models' : selectedModel}…</span>
      </div>
    {:else if error}
      <div class="fg-error">{error}</div>
    {:else if heat}

      <!-- BAN ALERT -->
      {#if heat.isBanPeriod}
        <div class="fg-ban-bar">
          🚫 LEGAL WORK BAN ACTIVE &nbsp;·&nbsp; 12:30–15:30
        </div>
      {/if}

      <!-- ── COMPACT STATUS BUTTONS ─────────────────────────── -->
      <div class="fg-status-grid">

        <!-- HEAT button -->
        <button
          class="fg-status-btn {expandedCard==='heat'?'expanded':''}"
          style="--zone-color:{heat.zoneInfo.color};--zone-bg:{heat.zoneInfo.bgColor}"
          on:click={() => toggleCard('heat')}
        >
          <div class="fg-sb-icon">🌡</div>
          <div class="fg-sb-zone" style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</div>
          <div class="fg-sb-val">{heat.apparentTempFinal === 999 ? 'NO WORK' : heat.apparentTempFinal+'°C'}</div>
          <div class="fg-sb-label">Apparent Temp</div>
          <div class="fg-sb-chevron">{expandedCard==='heat'?'▲':'▼'}</div>
        </button>

        <!-- WIND button -->
        <button
          class="fg-status-btn {expandedCard==='wind'?'expanded':''}"
          style="--zone-color:{windResult?.riskColor};--zone-bg:#0f1d42"
          on:click={() => toggleCard('wind')}
        >
          <div class="fg-sb-icon">💨</div>
          <div class="fg-sb-zone" style="color:{windResult?.riskColor}">{windResult?.riskLabel}</div>
          <div class="fg-sb-val">{rawData?.windMs.toFixed(1)} m/s</div>
          <div class="fg-sb-label">Bft {windResult?.beaufort}</div>
          <div class="fg-sb-chevron">{expandedCard==='wind'?'▲':'▼'}</div>
        </button>

        <!-- RAIN button -->
        <button
          class="fg-status-btn {expandedCard==='rain'?'expanded':''}"
          style="--zone-color:{rainResult?.riskColor};--zone-bg:#0f1d42"
          on:click={() => toggleCard('rain')}
        >
          <div class="fg-sb-icon">🌧</div>
          <div class="fg-sb-zone" style="color:{rainResult?.riskColor}">{rainResult?.riskLabel}</div>
          <div class="fg-sb-val">{rawData?.rainMmH.toFixed(1)} mm/h</div>
          <div class="fg-sb-label">{rainResult?.intensityLabel}</div>
          <div class="fg-sb-chevron">{expandedCard==='rain'?'▲':'▼'}</div>
        </button>

        <!-- SOLAR / RADIATION button -->
        <button
          class="fg-status-btn {expandedCard==='solar'?'expanded':''}"
          style="--zone-color:{solarColor};--zone-bg:#0f1d42"
          on:click={() => toggleCard('solar')}
        >
          <div class="fg-sb-icon">{isNight ? '🌙' : '☀'}</div>
          <div class="fg-sb-zone" style="color:{solarColor}">{solarLabel}</div>
          <div class="fg-sb-val">{rawData?.solarWm2} W/m²</div>
          <div class="fg-sb-label">{isNight ? 'Night — no solar' : 'UV Index ~'+uvIndex}</div>
          <div class="fg-sb-chevron">{expandedCard==='solar'?'▲':'▼'}</div>
        </button>

      </div>

      <!-- ── EXPANDED DETAIL PANELS ─────────────────────────── -->

      {#if expandedCard === 'heat'}
        <div class="fg-detail-panel" style="border-color:{heat.zoneInfo.color}">
          <div class="fg-dp-title" style="color:{heat.zoneInfo.color}">
            🌡 Heat Stress — {heat.zoneInfo.riskLabel}
          </div>
          <div class="fg-dp-metrics">
            <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.tempC}°C</span><span class="fg-dp-l">Temp</span></div>
            <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.humidity}%</span><span class="fg-dp-l">Humidity</span></div>
            <div class="fg-dp-m"><span class="fg-dp-v">{heat.apparentTemp1}°C</span><span class="fg-dp-l">App.Temp A</span></div>
            <div class="fg-dp-m" style="color:{heat.zoneInfo.color}"><span class="fg-dp-v" style="color:{heat.zoneInfo.color}">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°C'}</span><span class="fg-dp-l">App.Temp B</span></div>
            <div class="fg-dp-m"><span class="fg-dp-v">{heat.wbgtBase}°C</span><span class="fg-dp-l">WBGT</span></div>
            <div class="fg-dp-m"><span class="fg-dp-v">{heat.wbgtAdjusted}°C</span><span class="fg-dp-l">WBGT+PPE</span></div>
          </div>
          <div class="fg-dp-schedule">
            <div class="fg-dp-row"><span class="fg-dp-rl">🕐 Light work</span><span class="fg-dp-rv">{heat.workRestSchedule.light}</span></div>
            <div class="fg-dp-row"><span class="fg-dp-rl">💪 Heavy work</span><span class="fg-dp-rv">{heat.workRestSchedule.heavy}</span></div>
            <div class="fg-dp-row"><span class="fg-dp-rl">💧 Hydration</span><span class="fg-dp-rv">{heat.hydration}</span></div>
            <div class="fg-dp-row"><span class="fg-dp-rl">👁 Monitoring</span><span class="fg-dp-rv fg-dp-rv-sm">{heat.zoneInfo.monitoringSchedule}</span></div>
          </div>
          <div class="fg-dp-controls-title">⚠ Mandatory Controls</div>
          {#each heat.zoneInfo.mandatoryControls as ctrl}
            <div class="fg-dp-ctrl">▸ {ctrl}</div>
          {/each}
          <div class="fg-dp-ppe">PPE: {PPE_PROFILES[settings.ppeProfile].label} (+{PPE_PROFILES[settings.ppeProfile].adjustment}°C)</div>
        </div>
      {/if}

      {#if expandedCard === 'wind'}
        <div class="fg-detail-panel" style="border-color:{windResult?.riskColor}">
          <div class="fg-dp-title" style="color:{windResult?.riskColor}">
            💨 Wind — {windResult?.riskLabel}
          </div>
          <div class="fg-dp-metrics">
            <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.windMs.toFixed(1)}</span><span class="fg-dp-l">m/s</span></div>
            <div class="fg-dp-m"><span class="fg-dp-v">{((rawData?.windMs??0)*3.6).toFixed(1)}</span><span class="fg-dp-l">km/h</span></div>
            <div class="fg-dp-m"><span class="fg-dp-v">Bft {windResult?.beaufort}</span><span class="fg-dp-l">{windResult?.beaufortDesc}</span></div>
          </div>
          <div class="fg-dp-threshold">
            Warn ≥ {settings.windWarnMs} m/s &nbsp;·&nbsp; Danger ≥ {settings.windDangerMs} m/s
          </div>
        </div>
      {/if}

      {#if expandedCard === 'rain'}
        <div class="fg-detail-panel" style="border-color:{rainResult?.riskColor}">
          <div class="fg-dp-title" style="color:{rainResult?.riskColor}">
            🌧 Rain — {rainResult?.riskLabel}
          </div>
          <div class="fg-dp-metrics">
            <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.rainMmH.toFixed(1)}</span><span class="fg-dp-l">mm/h</span></div>
            <div class="fg-dp-m"><span class="fg-dp-v">{rainResult?.intensityLabel}</span><span class="fg-dp-l">Intensity</span></div>
          </div>
          <div class="fg-dp-threshold">
            Warn ≥ {settings.rainWarnMmh} mm/h &nbsp;·&nbsp; Danger ≥ {settings.rainDangerMmh} mm/h
          </div>
        </div>
      {/if}

      {#if expandedCard === 'solar'}
        <div class="fg-detail-panel" style="border-color:{solarColor}">
          <div class="fg-dp-title" style="color:{solarColor}">
            {isNight ? '🌙 Night — No Solar Radiation' : '☀ Solar Radiation — '+solarLabel}
          </div>
          {#if isNight}
            <div class="fg-dp-night-msg">
              <div class="fg-dp-night-icon">🌙</div>
              <div>Solar radiation is <strong>zero</strong> during night hours.</div>
              <div>WBGT calculation uses <strong>nocturnal formula</strong> — only temperature, humidity and wind contribute to heat stress.</div>
              <div class="fg-dp-night-sub">Sunrise: ~{sunriseTime} &nbsp;·&nbsp; Sunset: ~{sunsetTime}</div>
            </div>
          {:else}
            <div class="fg-dp-metrics">
              <div class="fg-dp-m"><span class="fg-dp-v">{rawData?.solarWm2}</span><span class="fg-dp-l">W/m²</span></div>
              <div class="fg-dp-m"><span class="fg-dp-v">UV ~{uvIndex}</span><span class="fg-dp-l">Index</span></div>
              <div class="fg-dp-m"><span class="fg-dp-v">{solarElevDeg}°</span><span class="fg-dp-l">Sun angle</span></div>
            </div>
            <div class="fg-dp-solar-bar">
              <div class="fg-dp-solar-track">
                <div class="fg-dp-solar-fill" style="width:{solarPct}%;background:{solarColor}"></div>
                <div class="fg-dp-solar-sun" style="left:{solarPct}%">☀</div>
              </div>
              <div class="fg-dp-solar-labels"><span>Dawn</span><span>Solar Noon</span><span>Dusk</span></div>
            </div>
            <div class="fg-dp-schedule">
              <div class="fg-dp-row"><span class="fg-dp-rl">Sunrise</span><span class="fg-dp-rv">{sunriseTime}</span></div>
              <div class="fg-dp-row"><span class="fg-dp-rl">Solar noon</span><span class="fg-dp-rv">{solarNoonTime}</span></div>
              <div class="fg-dp-row"><span class="fg-dp-rl">Sunset</span><span class="fg-dp-rv">{sunsetTime}</span></div>
              <div class="fg-dp-row"><span class="fg-dp-rl">Contribution to WBGT</span><span class="fg-dp-rv">+{wbgtSolarContrib}°C</span></div>
            </div>
          {/if}
          <div class="fg-dp-threshold">
            0–200 W/m² Low &nbsp;·&nbsp; 200–600 W/m² Moderate &nbsp;·&nbsp; 600–900 W/m² High &nbsp;·&nbsp; &gt;900 W/m² Extreme
          </div>
        </div>
      {/if}

      <!-- ── MODEL ROW ──────────────────────────────────────── -->
      <div class="fg-model-row">
        <select class="fg-model-select" bind:value={selectedModel} on:change={refreshData}>
          {#each MODELS as m}<option value={m.key}>{m.label}</option>{/each}
        </select>
        <label class="fg-worst-toggle {!license.valid?'fg-toggle-disabled':''}">
          <input type="checkbox" bind:checked={worstCaseMode} on:change={refreshData} disabled={!license.valid} />
          <span>Worst-case ⚡</span>
          {#if !license.valid}<span class="fg-pro-chip">PRO</span>{/if}
        </label>
      </div>

      <!-- ── MODEL COMPARISON (Pro) ─────────────────────────── -->
      {#if worstCaseMode && modelResults.length > 1}
        <div class="fg-model-table-wrap">
          <div class="fg-model-table-title">📊 Model Comparison</div>
          <table class="fg-model-table">
            <thead><tr><th>Model</th><th>Zone</th><th>App.T</th><th>Wind</th></tr></thead>
            <tbody>
              {#each modelResults as mr}
                <tr class="{mr.isWorst?'fg-best-row':''}">
                  <td>{mr.modelLabel}{mr.isWorst?' ⚡':''}</td>
                  <td style="color:{mr.heat.zoneInfo.color}">{mr.heat.zoneInfo.riskLabel}</td>
                  <td style="color:{mr.heat.zoneInfo.color}">{mr.heat.apparentTempFinal===999?'NW':mr.heat.apparentTempFinal+'°C'}</td>
                  <td style="color:{mr.wind.riskColor}">{mr.raw.windMs.toFixed(1)} m/s</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

    {/if}

  <!-- ══ SOS TAB ═════════════════════════════════════════════ -->
  {:else if tab === 'sos'}
    {#if !license.valid}
      <div class="fg-gate">
        <div class="fg-gate-icon">🚨</div>
        <div class="fg-gate-title">SOS Emergency Response</div>
        <div class="fg-gate-desc">Emergency steps, symptom checklist and alert history — FieldGuard Pro</div>
        <a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>
      </div>
    {:else}
      <div class="fg-section-hd">🚨 Emergency Response</div>
      <div class="fg-emg-card">
        <div class="fg-emg-warn">⚠ Heat Stress Is Life-Threatening</div>
        <div class="fg-emg-sub">The body starts shutting down and cannot recover without help.</div>
        <div class="fg-emg-section-hd">🔴 SYMPTOMS (monitor every 2 hours)</div>
        <div class="fg-emg-symptoms">
          {#each HEAT_STRESS_SYMPTOMS as s}
            <span class="fg-emg-symptom">● {s}</span>
          {/each}
        </div>
        <div class="fg-emg-section-hd">🚑 RESPONSE STEPS</div>
        {#each EMERGENCY_RESPONSE as step, i}
          <div class="fg-emg-step {step.includes('SEVERE')?'fg-emg-critical':''}">
            <span class="fg-emg-n">{i+1}</span> {step}
          </div>
        {/each}
      </div>
      <div class="fg-section-hd" style="margin-top:8px">📋 Alert Log</div>
      {#if alertLog.length === 0}
        <div class="fg-empty">No alerts this session.</div>
      {:else}
        {#each [...alertLog].reverse().slice(0,15) as a}
          <div class="fg-alert-row" style="border-left-color:{a.color}">
            <div class="fg-alert-type">{a.type}</div>
            <div class="fg-alert-msg">{a.message}</div>
            <div class="fg-alert-time">{a.time}</div>
          </div>
        {/each}
      {/if}
    {/if}

  <!-- ══ REPORT TAB ══════════════════════════════════════════ -->
  {:else if tab === 'report'}
    {#if !license.valid}
      <div class="fg-gate">
        <div class="fg-gate-icon">📄</div>
        <div class="fg-gate-title">ISO 7933 Weekly Report</div>
        <div class="fg-gate-desc">Generate ISO 7933 / FIDIC Clause 8.4 HSE audit reports with PPE-adjusted WBGT logs and Morning Gap analysis.</div>
        <a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a>
      </div>
    {:else}
      <div class="fg-section-hd">📄 ISO 7933 Weekly Report</div>
      <div class="fg-form-grid">
        <label>Project Name<input bind:value={reportMeta.projectName} placeholder="Site/Project Name" /></label>
        <label>Contract No.<input bind:value={reportMeta.contractNumber} placeholder="CONTRACT-001" /></label>
        <label>Country<input bind:value={reportMeta.country} placeholder="Oman, UAE, Qatar…" /></label>
        <label>Client<input bind:value={reportMeta.clientName} placeholder="Client Name" /></label>
        <label>Contractor<input bind:value={reportMeta.contractorName} placeholder="Contractor Name" /></label>
        <label>HSE Manager<input bind:value={reportMeta.hseManagerName} placeholder="Name, Cert. No." /></label>
        <label>Regulatory Ref<input bind:value={reportMeta.regulatoryRef} /></label>
        <label>Ban Start<input bind:value={reportMeta.banStart} placeholder="12:30" /></label>
        <label>Ban End<input bind:value={reportMeta.banEnd} placeholder="15:30" /></label>
        <label>Ban Months<input bind:value={reportMeta.banMonths} /></label>
        <label>FIDIC
          <select bind:value={reportMeta.fidic}>
            <option>ELIGIBLE</option><option>NOT ELIGIBLE</option><option>UNDER REVIEW</option>
          </select>
        </label>
        <label>Delay Days<input type="number" bind:value={reportMeta.delayDays} min="0" /></label>
      </div>
      <button class="fg-action-btn" on:click={generateReport}>📋 Generate Report</button>
      {#if reportText}
        <div class="fg-report-box">
          <div class="fg-report-toolbar">
            <span>Report ready</span>
            <button class="fg-mini-btn" on:click={copyReport}>📋 Copy</button>
            <button class="fg-mini-btn" on:click={downloadReport}>⬇ .txt</button>
          </div>
          <pre class="fg-report-pre">{reportText}</pre>
        </div>
      {/if}
    {/if}

  <!-- ══ SETTINGS TAB ════════════════════════════════════════ -->
  {:else if tab === 'settings'}

    <!-- LICENSE -->
    <div class="fg-setting-group fg-license-group">
      <div class="fg-setting-hd">🔑 License</div>
      {#if license.valid}
        <div class="fg-license-active">
          <span class="fg-license-badge">✓ PRO</span>
          <span class="fg-license-info">{license.tier?.toUpperCase()} · expires {license.expires?.slice(0,10)}</span>
          <button class="fg-deact-btn" on:click={deactivateLicense}>Deactivate</button>
        </div>
      {:else}
        <div class="fg-license-free-box">
          <div class="fg-free-tag">FREE TIER</div>
          <div class="fg-free-list">
            ⚡ Multi-model worst-case engine<br/>
            📄 ISO 7933 weekly report generator<br/>
            🚨 SOS emergency tab<br/>
            🎛 Custom thresholds &amp; auto-refresh
          </div>
          <a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Get Pro — fieldguard-hse.com</a>
        </div>
        <div class="fg-key-row">
          <input class="fg-key-input" bind:value={licenseKeyInput} placeholder="Paste license key…" disabled={licenseLoading} />
          <button class="fg-key-btn" on:click={activateLicense} disabled={licenseLoading || !licenseKeyInput.trim()}>
            {licenseLoading ? '…' : 'Activate'}
          </button>
        </div>
        {#if licenseError}<div class="fg-key-error">⚠ {licenseError}</div>{/if}
      {/if}
    </div>

    <!-- PPE (free) -->
    <div class="fg-setting-group">
      <div class="fg-setting-hd">👷 PPE Profile (ISO 7933)</div>
      {#each Object.entries(PPE_PROFILES) as [key, prof]}
        <label class="fg-radio-row">
          <input type="radio" bind:group={settings.ppeProfile} value={key} on:change={saveSettings} />
          <span>{prof.label}</span>
          <span class="fg-adj-chip">+{prof.adjustment}°C</span>
        </label>
      {/each}
    </div>

    <!-- WBGT (pro) -->
    <div class="fg-setting-group {!license.valid?'fg-locked':''}">
      <div class="fg-setting-hd">🌡 WBGT Thresholds {#if !license.valid}<span class="fg-pro-chip">PRO</span>{/if}</div>
      {#if license.valid}
        <label class="fg-slider-label">Warning (°C)
          <div class="fg-slider-row"><input type="range" min="28" max="38" step="0.5" bind:value={settings.wbgtWarnC} on:change={saveSettings}/><span>{settings.wbgtWarnC}°C</span></div>
        </label>
        <label class="fg-slider-label">Danger (°C)
          <div class="fg-slider-row"><input type="range" min="30" max="42" step="0.5" bind:value={settings.wbgtDangerC} on:change={saveSettings}/><span>{settings.wbgtDangerC}°C</span></div>
        </label>
      {:else}
        <div class="fg-gate-msg">Activate Pro to unlock</div>
      {/if}
    </div>

    <!-- WIND (pro) -->
    <div class="fg-setting-group {!license.valid?'fg-locked':''}">
      <div class="fg-setting-hd">💨 Wind Thresholds {#if !license.valid}<span class="fg-pro-chip">PRO</span>{/if}</div>
      {#if license.valid}
        <label class="fg-slider-label">Warning (m/s)
          <div class="fg-slider-row"><input type="range" min="5" max="25" step="0.5" bind:value={settings.windWarnMs} on:change={saveSettings}/><span>{settings.windWarnMs} m/s</span></div>
        </label>
        <label class="fg-slider-label">Danger (m/s)
          <div class="fg-slider-row"><input type="range" min="10" max="35" step="0.5" bind:value={settings.windDangerMs} on:change={saveSettings}/><span>{settings.windDangerMs} m/s</span></div>
        </label>
      {:else}
        <div class="fg-gate-msg">Activate Pro to unlock</div>
      {/if}
    </div>

    <!-- RAIN (pro) -->
    <div class="fg-setting-group {!license.valid?'fg-locked':''}">
      <div class="fg-setting-hd">🌧 Rain Thresholds {#if !license.valid}<span class="fg-pro-chip">PRO</span>{/if}</div>
      {#if license.valid}
        <label class="fg-slider-label">Warning (mm/h)
          <div class="fg-slider-row"><input type="range" min="1" max="25" step="0.5" bind:value={settings.rainWarnMmh} on:change={saveSettings}/><span>{settings.rainWarnMmh} mm/h</span></div>
        </label>
        <label class="fg-slider-label">Danger (mm/h)
          <div class="fg-slider-row"><input type="range" min="5" max="60" step="1" bind:value={settings.rainDangerMmh} on:change={saveSettings}/><span>{settings.rainDangerMmh} mm/h</span></div>
        </label>
      {:else}
        <div class="fg-gate-msg">Activate Pro to unlock</div>
      {/if}
    </div>

    <!-- ALERTS -->
    <div class="fg-setting-group">
      <div class="fg-setting-hd">🔔 Alerts</div>
      <label class="fg-toggle-row">
        <input type="checkbox" bind:checked={settings.soundAlerts} on:change={saveSettings}/>
        Browser notifications for danger zones
      </label>
      <label class="fg-toggle-row {!license.valid?'fg-locked':''}">
        <input type="checkbox" bind:checked={settings.autoRefresh} on:change={setupAutoRefresh} disabled={!license.valid}/>
        Auto-refresh every 15 min
        {#if !license.valid}<span class="fg-pro-chip">PRO</span>{/if}
      </label>
    </div>

    {#if license.valid}
      <button class="fg-action-btn fg-action-btn-sec" on:click={resetSettings}>↩ Reset Defaults</button>
    {/if}

  {/if}

</section>

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
  let expandedCard: string | null = 'heat'; // used in desktop full panel
  let activeDetail: string | null = null; // used in bottom bar pill taps

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
    expandedCard = expandedCard === id ? null : id;
  }

  // For the bottom bar pills — toggles the overlay detail panel
  function toggleDetail(id: string) {
    activeDetail = activeDetail === id ? null : id;
    // Also sync with main panel expanded card
    expandedCard = activeDetail;
  }

  // Called from mobile widget bar pills — switches to full panel view
  // and opens the relevant expanded card
  function openFullPanel(cardId: string) {
    tab = 'dashboard';
    expandedCard = cardId;
    // On mobile small mode, Windy expands the plugin to full when user taps
    // We also emit rqstOpen to ensure the full panel opens
    try {
      import('@windy/broadcast').then(({ default: bcast }) => {
        bcast.emit('rqstOpen', 'fieldguard');
      });
    } catch {}
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
  /* ── Brand tokens ─────────────────────────────────────────
     Navy deep : #0f1d42   Navy mid: #1a2b5e   Navy light: #2d4080
     Amber:      #e8962a   White:    #ffffff    Slate:      #8a9cc8
  ─────────────────────────────────────────────────────────── */
  .fg {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #e8edf8; font-size: 13px; padding: 0;
    max-width: 100%; box-sizing: border-box;
    /* Let the Windy map show through */
    background: transparent;
  }

  /* ── Header ─────────────────────────────────────────────── */
  .fg-header {
    display: flex; align-items: center; gap: 8px; padding: 8px 10px;
    background: rgba(10, 18, 40, 0.82);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 2px solid #e8962a;
  }
  .fg-logo { width: 30px; height: 30px; object-fit: contain; flex-shrink: 0; }
  .fg-logo-fallback { width: 30px; height: 30px; font-size: 22px; align-items: center; justify-content: center; flex-shrink: 0; }
  .fg-header-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .fg-title { font-size: 15px; font-weight: 800; color: #fff; line-height: 1.1; }
  .fg-subtitle { font-size: 8px; color: #8a9cc8; text-transform: uppercase; letter-spacing: 1px; }
  .fg-header-right { display: flex; gap: 4px; margin-left: auto; flex-shrink: 0; }
  .fg-icon-btn {
    width: 30px; height: 30px; background: #1a2b5e; border: 1px solid #2d4080;
    border-radius: 7px; cursor: pointer; display: flex; align-items: center;
    justify-content: center; color: #8a9cc8; transition: all 0.15s; padding: 0;
  }
  .fg-icon-btn svg { width: 15px; height: 15px; }
  .fg-icon-btn:hover, .fg-icon-btn.active { border-color: #e8962a; color: #e8962a; }

  /* ── Location bar ────────────────────────────────────────── */
  .fg-loc-bar {
    display: flex; align-items: center; gap: 5px; padding: 5px 10px;
    background: rgba(15, 29, 66, 0.75);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    font-size: 10px; color: #8a9cc8;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .fg-loc-pin { font-size: 11px; }
  .fg-loc-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .fg-loc-time { color: #4a6090; flex-shrink: 0; }
  .fg-day-badge  { background: #78350f; color: #fcd34d; border-radius: 3px; padding: 1px 5px; font-size: 9px; font-weight: 700; flex-shrink: 0; }
  .fg-night-badge { background: #1e1b4b; color: #a5b4fc; border-radius: 3px; padding: 1px 5px; font-size: 9px; font-weight: 700; flex-shrink: 0; }

  /* ── Tabs ────────────────────────────────────────────────── */
  .fg-tabs {
    display: flex;
    background: rgba(10, 18, 40, 0.80);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .fg-tab {
    flex: 1; padding: 7px 2px; background: transparent; border: none;
    color: #4a6090; cursor: pointer; font-size: 10px;
    border-bottom: 2px solid transparent; transition: all 0.15s;
    display: flex; flex-direction: column; align-items: center; gap: 1px;
  }
  .fg-tab-icon { font-size: 14px; }
  .fg-tab-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
  .fg-tab.active { color: #e8962a; border-bottom-color: #e8962a; }

  /* ── States ──────────────────────────────────────────────── */
  .fg-loading { padding: 24px 12px; text-align: center; color: #8a9cc8; display: flex; flex-direction: column; align-items: center; gap: 10px; background: transparent; }
  .fg-spinner {
    width: 24px; height: 24px; border: 2px solid #1a2b5e;
    border-top-color: #e8962a; border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fg-error { padding: 10px 12px; background: rgba(61,10,10,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); color: #fca5a5; font-size: 11px; border-bottom: 1px solid #7f1d1d; }
  .fg-ban-bar {
    padding: 7px 12px;
    background: rgba(124, 45, 18, 0.85);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    color: #fed7aa; font-size: 11px; font-weight: 700; text-align: center;
    border-bottom: 1px solid #e8962a;
  }

  /* ── Status button grid ──────────────────────────────────── */
  .fg-status-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; padding: 8px 10px 4px;
    background: transparent;
  }
  .fg-status-btn {
    background: rgba(15, 29, 66, 0.75);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--zone-color, rgba(45, 64, 128, 0.7));
    border-radius: 12px; padding: 14px 8px;
    cursor: pointer; text-align: center;
    transition: all 0.15s; position: relative;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    width: 100%;
  }
  .fg-status-btn:active { transform: scale(0.97); }
  .fg-status-btn.expanded {
    border-width: 2px;
    background: rgba(20, 38, 80, 0.85);
    box-shadow: 0 0 14px color-mix(in srgb, var(--zone-color) 40%, transparent);
  }
  .fg-sb-icon { font-size: 22px; line-height: 1; }
  .fg-sb-zone { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
  .fg-sb-val  { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.2; }
  .fg-sb-label { font-size: 9px; color: #8a9cc8; }
  .fg-sb-chevron { font-size: 8px; color: #4a6090; margin-top: 2px; }

  /* ── Detail panels ───────────────────────────────────────── */
  .fg-detail-panel {
    margin: 0 8px 6px; padding: 14px;
    background: rgba(12, 24, 58, 0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid; border-radius: 12px;
    animation: slideDown 0.18s ease-out;
  }
  @keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
  .fg-dp-title { font-size: 13px; font-weight: 800; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  .fg-dp-metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; margin-bottom: 10px; }
  .fg-dp-m { background: rgba(8, 15, 35, 0.6); border-radius: 7px; padding: 7px 4px; text-align: center; display: flex; flex-direction: column; gap: 2px; }
  .fg-dp-v { font-size: 15px; font-weight: 800; color: #fff; }
  .fg-dp-l { font-size: 9px; color: #4a6090; text-transform: uppercase; }
  .fg-dp-schedule { background: rgba(8, 15, 35, 0.55); border-radius: 7px; padding: 8px; margin-bottom: 8px; }
  .fg-dp-row { display: flex; justify-content: space-between; align-items: baseline; padding: 3px 0; border-bottom: 1px solid #1a2b5e; }
  .fg-dp-row:last-child { border-bottom: none; }
  .fg-dp-rl { font-size: 10px; color: #4a6090; }
  .fg-dp-rv { font-size: 11px; color: #8a9cc8; font-weight: 500; }
  .fg-dp-rv-sm { font-size: 9px; }
  .fg-dp-controls-title { font-size: 10px; color: #e8962a; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 5px; }
  .fg-dp-ctrl { font-size: 10px; color: #8a9cc8; padding: 2px 0; border-bottom: 1px solid #0f1d42; }
  .fg-dp-ctrl:last-of-type { border-bottom: none; }
  .fg-dp-ppe { font-size: 9px; color: #4a6090; margin-top: 6px; }
  .fg-dp-threshold { font-size: 9px; color: #4a6090; margin-top: 6px; text-align: center; }

  /* ── Solar panel extras ──────────────────────────────────── */
  .fg-dp-night-msg {
    background: rgba(30, 27, 75, 0.7); border-radius: 7px; padding: 12px; text-align: center;
    display: flex; flex-direction: column; gap: 6px; font-size: 11px; color: #c7d2fe;
    border: 1px solid rgba(165, 180, 252, 0.2);
  }
  .fg-dp-night-icon { font-size: 28px; }
  .fg-dp-night-msg strong { color: #a5b4fc; }
  .fg-dp-night-sub { font-size: 10px; color: #4a6090; }
  .fg-dp-solar-bar { margin: 10px 0 4px; }
  .fg-dp-solar-track { position: relative; height: 6px; background: #0f1d42; border-radius: 3px; margin-bottom: 16px; }
  .fg-dp-solar-fill { position: absolute; height: 100%; border-radius: 3px; transition: width 0.5s; }
  .fg-dp-solar-sun { position: absolute; top: -8px; transform: translateX(-50%); font-size: 16px; transition: left 0.5s; }
  .fg-dp-solar-labels { display: flex; justify-content: space-between; font-size: 9px; color: #4a6090; }

  /* ── Model row ───────────────────────────────────────────── */
  .fg-model-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px 10px;
    background: rgba(10, 18, 40, 0.82);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255,255,255,0.07);
    font-size: 11px; color: #8a9cc8;
    margin-bottom: 2px;
  }
  .fg-model-select { background: #1a2b5e; border: 1px solid #2d4080; color: #e8edf8; padding: 3px 6px; border-radius: 5px; font-size: 11px; }
  .fg-worst-toggle { display: flex; align-items: center; gap: 4px; cursor: pointer; margin-left: auto; font-size: 11px; }
  .fg-model-table-wrap { margin: 0 10px 6px; background: rgba(15,29,66,0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(45,64,128,0.5); border-radius: 8px; padding: 8px; }
  .fg-model-table-title { font-size: 10px; color: #e8962a; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
  .fg-model-table { width: 100%; border-collapse: collapse; font-size: 10px; }
  .fg-model-table th { color: #4a6090; text-align: left; padding: 2px 3px; border-bottom: 1px solid #2d4080; }
  .fg-model-table td { padding: 2px 3px; color: #8a9cc8; }
  .fg-best-row td { color: #fff; font-weight: 700; background: #0f1d42; }

  /* ── Gate ────────────────────────────────────────────────── */
  .fg-gate { margin: 16px 10px; padding: 18px 14px; background: rgba(15,29,66,0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(45,64,128,0.5); border-radius: 10px; text-align: center; }
  .fg-gate-icon { font-size: 30px; margin-bottom: 6px; }
  .fg-gate-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .fg-gate-desc { font-size: 11px; color: #4a6090; line-height: 1.6; margin-bottom: 12px; }
  .fg-gate-btn { display: block; background: #e8962a; color: #0f1d42 !important; text-decoration: none; padding: 9px 14px; border-radius: 7px; font-size: 12px; font-weight: 800; }

  /* ── SOS tab ─────────────────────────────────────────────── */
  .fg-section-hd { padding: 8px 10px 4px; font-size: 10px; color: #e8962a; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
  .fg-emg-card { margin: 0 10px 6px; background: rgba(15,29,66,0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid #dc2626; border-radius: 9px; padding: 12px; }
  .fg-emg-warn { font-size: 13px; font-weight: 700; color: #f87171; margin-bottom: 3px; }
  .fg-emg-sub  { font-size: 10px; color: #8a9cc8; margin-bottom: 10px; }
  .fg-emg-section-hd { font-size: 9px; color: #4a6090; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 5px; }
  .fg-emg-symptoms { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
  .fg-emg-symptom { background: #3d0a0a; color: #fca5a5; border-radius: 4px; padding: 2px 7px; font-size: 10px; }
  .fg-emg-step { display: flex; gap: 7px; align-items: flex-start; padding: 4px 0; font-size: 10px; color: #8a9cc8; border-bottom: 1px solid #0f1d42; }
  .fg-emg-step:last-child { border-bottom: none; }
  .fg-emg-n { background: #2d4080; color: #e8edf8; border-radius: 3px; padding: 1px 5px; font-size: 9px; font-weight: 700; flex-shrink: 0; }
  .fg-emg-critical { color: #f87171 !important; font-weight: 700; }
  .fg-emg-critical .fg-emg-n { background: #dc2626; }
  .fg-empty { padding: 14px; text-align: center; color: #4a6090; font-size: 11px; }
  .fg-alert-row { margin: 3px 10px; padding: 7px 9px; background: rgba(15,29,66,0.80); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 6px; border-left: 3px solid; }
  .fg-alert-type { font-size: 11px; font-weight: 700; color: #fff; }
  .fg-alert-msg  { font-size: 10px; color: #8a9cc8; }
  .fg-alert-time { font-size: 9px; color: #4a6090; }

  /* ── Report tab ──────────────────────────────────────────── */
  .fg-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 0 10px; }
  label { display: block; color: #8a9cc8; font-size: 10px; }
  label input, label select {
    display: block; width: 100%; background: #0f1d42; border: 1px solid #2d4080;
    color: #e8edf8; padding: 5px 7px; border-radius: 5px; font-size: 11px;
    margin-top: 2px; box-sizing: border-box;
  }
  label input:focus, label select:focus { outline: none; border-color: #e8962a; }
  .fg-action-btn {
    display: block; width: calc(100% - 20px); margin: 7px 10px;
    padding: 9px; border: none; border-radius: 7px; font-size: 13px; font-weight: 800;
    cursor: pointer; background: #e8962a; color: #0f1d42;
  }
  .fg-action-btn-sec { background: #1a2b5e; color: #8a9cc8; border: 1px solid #2d4080; }
  .fg-report-box { margin: 0 10px 6px; background: rgba(10,18,40,0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(45,64,128,0.5); border-radius: 8px; overflow: hidden; }
  .fg-report-toolbar { display: flex; align-items: center; gap: 6px; padding: 5px 8px; background: #1a2b5e; border-bottom: 1px solid #2d4080; font-size: 10px; color: #4a6090; }
  .fg-report-toolbar span { flex: 1; }
  .fg-mini-btn { background: #2d4080; border: none; color: #8a9cc8; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; }
  .fg-report-pre { padding: 8px; font-size: 8px; color: #8a9cc8; white-space: pre; overflow: auto; max-height: 240px; font-family: 'Courier New', monospace; line-height: 1.4; }

  /* ── Settings tab ────────────────────────────────────────── */
  .fg-setting-group { background: rgba(15,29,66,0.84); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 9px; margin: 5px 10px; padding: 10px; border: 1px solid rgba(45,64,128,0.6); }
  .fg-license-group { border-color: #e8962a; }
  .fg-setting-hd { font-size: 10px; font-weight: 700; color: #e8962a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .fg-license-active { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .fg-license-badge { background: #052e16; color: #4ade80; border: 1px solid #16a34a; border-radius: 5px; padding: 3px 8px; font-size: 11px; font-weight: 700; }
  .fg-license-info { font-size: 11px; color: #86efac; flex: 1; }
  .fg-deact-btn { background: #2d4080; border: 1px solid #334155; color: #8a9cc8; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; }
  .fg-license-free-box { background: #0f1d42; border-radius: 7px; padding: 10px; margin-bottom: 8px; border: 1px solid #2d4080; }
  .fg-free-tag { font-size: 9px; font-weight: 700; color: #4a6090; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
  .fg-free-list { font-size: 11px; color: #4a6090; line-height: 1.8; margin-bottom: 8px; }
  .fg-key-row { display: flex; gap: 5px; margin-top: 4px; }
  .fg-key-input { flex: 1; background: #0f1d42; border: 1px solid #2d4080; color: #e8edf8; padding: 6px 8px; border-radius: 5px; font-size: 11px; font-family: monospace; }
  .fg-key-input:focus { outline: none; border-color: #e8962a; }
  .fg-key-btn { background: #e8962a; border: none; color: #0f1d42; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 800; white-space: nowrap; }
  .fg-key-btn:disabled { background: #2d4080; color: #4a6090; cursor: not-allowed; }
  .fg-key-error { margin-top: 5px; font-size: 10px; color: #f87171; padding: 5px 7px; background: #3d0a0a; border-radius: 4px; }
  .fg-radio-row { display: flex; align-items: center; gap: 7px; padding: 5px 0; cursor: pointer; border-bottom: 1px solid #0f1d42; font-size: 11px; color: #c8d4f0; }
  .fg-radio-row:last-child { border-bottom: none; }
  .fg-radio-row span:first-of-type { flex: 1; }
  .fg-adj-chip { background: #0f1d42; color: #8a9cc8; border: 1px solid #2d4080; border-radius: 3px; padding: 1px 5px; font-size: 9px; flex-shrink: 0; }
  .fg-slider-label { display: block; color: #8a9cc8; font-size: 10px; margin-bottom: 5px; }
  .fg-slider-row { display: flex; align-items: center; gap: 7px; margin-top: 2px; }
  .fg-slider-row input[type="range"] { flex: 1; accent-color: #e8962a; }
  .fg-slider-row span { min-width: 50px; text-align: right; color: #e8962a; font-size: 11px; font-weight: 700; }
  .fg-toggle-row { display: flex; align-items: center; gap: 7px; padding: 5px 0; cursor: pointer; font-size: 11px; color: #c8d4f0; border-bottom: 1px solid #0f1d42; }
  .fg-toggle-row:last-child { border-bottom: none; }
  input[type="checkbox"] { accent-color: #e8962a; }
  .fg-gate-msg { font-size: 10px; color: #4a6090; padding: 4px 0; }
  .fg-locked { opacity: 0.4; pointer-events: none; }
  .fg-pro-chip { background: #e8962a; color: #0f1d42; font-size: 8px; font-weight: 800; padding: 1px 5px; border-radius: 3px; margin-left: 5px; }
  .fg-toggle-disabled { opacity: 0.4; }

  /* ══ MOBILE SMALL WIDGET BAR ═══════════════════════════════
     Shown when mobileUI = 'small' — floats over the Windy map
     as a compact pill strip at the bottom of the screen.
  ══════════════════════════════════════════════════════════ */

  .fg-widget-bar {
    /* Override Windy's plugin__mobile-header defaults */
    background: rgba(8, 15, 35, 0.78) !important;
    backdrop-filter: blur(18px) !important;
    -webkit-backdrop-filter: blur(18px) !important;
    border-top: 1px solid rgba(232, 150, 42, 0.4) !important;
    border-radius: 16px 16px 0 0;
    padding: 0 !important;
    min-height: 0 !important;
    overflow: visible !important;
  }

  .fg-widget-inner {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 10px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .fg-widget-inner::-webkit-scrollbar { display: none; }

  /* Logo in widget bar */
  .fg-widget-logo {
    flex-shrink: 0;
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
  }
  .fg-widget-logo-img { width: 26px; height: 26px; object-fit: contain; }

  /* Status pills */
  .fg-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    padding: 5px 9px;
    background: rgba(15, 29, 66, 0.75);
    border: 1px solid var(--pc, rgba(45, 64, 128, 0.7));
    border-radius: 10px;
    cursor: pointer;
    flex-shrink: 0;
    min-width: 52px;
    transition: all 0.15s;
    /* subtle glow matching zone color */
    box-shadow: 0 0 8px color-mix(in srgb, var(--pc, #2d4080) 25%, transparent);
  }
  .fg-pill:active {
    transform: scale(0.94);
    background: rgba(25, 45, 90, 0.9);
  }
  .fg-pill-icon { font-size: 13px; line-height: 1; }
  .fg-pill-val  {
    font-size: 13px; font-weight: 800; color: #ffffff;
    line-height: 1.1; display: flex; align-items: baseline; gap: 1px;
  }
  .fg-pill-val small { font-size: 8px; color: #8a9cc8; font-weight: 400; }
  .fg-pill-zone {
    font-size: 7px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.8px; line-height: 1;
  }

  /* Work ban pill */
  .fg-pill-ban {
    background: rgba(124, 45, 18, 0.8);
    border-color: #e8962a;
    animation: pulse-ban 1.5s ease-in-out infinite;
    cursor: default;
  }
  @keyframes pulse-ban {
    0%, 100% { box-shadow: 0 0 6px rgba(232, 150, 42, 0.3); }
    50%       { box-shadow: 0 0 14px rgba(232, 150, 42, 0.7); }
  }

  /* Loading state in widget bar */
  .fg-widget-loading {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: #8a9cc8; flex: 1; padding: 4px 0;
  }
  .fg-widget-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(45,64,128,0.5);
    border-top-color: #e8962a;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  /* Tap to load */
  .fg-pill-refresh {
    font-size: 11px; color: #8a9cc8; background: rgba(15,29,66,0.6);
    border: 1px dashed #2d4080; border-radius: 8px; padding: 5px 12px;
    cursor: pointer; flex: 1;
  }

  /* Refresh icon button in widget bar */
  .fg-widget-refresh {
    width: 28px; height: 28px;
    background: rgba(15,29,66,0.6);
    border: 1px solid rgba(45,64,128,0.5);
    border-radius: 8px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #4a6090; flex-shrink: 0;
    transition: all 0.15s; margin-left: auto;
  }
  .fg-widget-refresh:hover { border-color: #e8962a; color: #e8962a; }

  /* Windy controls widget bar visibility via plugin__mobile-header class
     We don't need to hide it — Windy handles it based on mobileUI: 'small' */


  /* ══ BOTTOM PILL BAR ════════════════════════════════════════ */
  .fg-bar {
    background: rgba(8, 15, 35, 0.92) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-top: 2px solid #e8962a !important;
    border-radius: 14px 14px 0 0 !important;
    padding: 0 !important;
    min-height: 0 !important;
  }
  .fg-bar > * { display: flex; align-items: center; gap: 4px; padding: 6px 8px; overflow-x: auto; scrollbar-width: none; }
  .fg-bar > *::-webkit-scrollbar { display: none; }

  /* The 4 pills */
  .fg-bar-pill {
    flex: 1; min-width: 60px; max-width: 80px;
    display: flex; flex-direction: column; align-items: center; gap: 1px;
    padding: 7px 4px;
    background: rgba(15, 29, 66, 0.7);
    border: 1px solid var(--pc, #2d4080);
    border-radius: 10px; cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 0 8px color-mix(in srgb, var(--pc, #2d4080) 20%, transparent);
  }
  .fg-bar-pill:active { transform: scale(0.94); }
  .fg-bar-pill.fg-bar-pill-active {
    background: rgba(25, 45, 90, 0.9);
    border-width: 2px;
    box-shadow: 0 0 14px color-mix(in srgb, var(--pc, #2d4080) 40%, transparent);
  }
  .fg-bar-pill-icon { font-size: 16px; line-height: 1; }
  .fg-bar-pill-val  { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.1; display: flex; align-items: baseline; gap: 1px; }
  .fg-bar-unit      { font-size: 8px; color: #8a9cc8; }
  .fg-bar-pill-lbl  { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Ban badge */
  .fg-bar-ban {
    font-size: 18px; flex-shrink: 0;
    animation: pulse-ban 1.5s ease-in-out infinite;
  }
  @keyframes pulse-ban { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* Refresh button */
  .fg-bar-refresh {
    width: 28px; height: 28px; flex-shrink: 0; margin-left: auto;
    background: rgba(15,29,66,0.6); border: 1px solid rgba(45,64,128,0.5);
    border-radius: 8px; cursor: pointer; color: #4a6090;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .fg-bar-refresh:hover { border-color: #e8962a; color: #e8962a; }

  /* Loading / tap */
  .fg-bar-loading { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #8a9cc8; padding: 10px 12px; }
  .fg-bar-spin { width: 14px; height: 14px; border: 2px solid rgba(45,64,128,0.5); border-top-color: #e8962a; border-radius: 50%; animation: spin 0.8s linear infinite; }
  .fg-bar-tap { font-size: 12px; color: #8a9cc8; background: transparent; border: 1px dashed #2d4080; border-radius: 8px; padding: 8px 16px; cursor: pointer; width: 100%; }

  /* ══ DETAIL OVERLAY ═════════════════════════════════════════ */
  .fg-overlay {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    top: 0;
    z-index: 9999;
    background: rgba(5, 10, 25, 0.5);
    backdrop-filter: blur(4px);
    display: flex; flex-direction: column; justify-content: flex-end;
  }
  .fg-overlay-panel {
    background: rgba(10, 18, 42, 0.97);
    backdrop-filter: blur(20px);
    border-top: 2px solid #e8962a;
    border-radius: 18px 18px 0 0;
    padding: 12px 10px 20px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.22s ease-out;
  }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: none; opacity: 1; } }

  .fg-overlay-close {
    position: absolute; top: 10px; right: 12px;
    background: rgba(45,64,128,0.5); border: 1px solid #2d4080;
    color: #8a9cc8; width: 28px; height: 28px;
    border-radius: 8px; cursor: pointer; font-size: 13px;
    display: flex; align-items: center; justify-content: center;
  }
  .fg-overlay-loc {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: #8a9cc8;
    padding: 0 0 8px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 8px;
    padding-right: 36px;
  }
  .fg-overlay-time { margin-left: auto; color: #4a6090; }

  /* Tabs inside overlay */
  .fg-overlay-tabs {
    display: flex; gap: 4px; margin-bottom: 10px;
    overflow-x: auto; scrollbar-width: none;
  }
  .fg-overlay-tabs::-webkit-scrollbar { display: none; }
  .fg-overlay-tab {
    padding: 5px 12px; background: rgba(15,29,66,0.6);
    border: 1px solid #2d4080; border-radius: 20px;
    color: #4a6090; font-size: 11px; cursor: pointer; white-space: nowrap;
    transition: all 0.15s; flex-shrink: 0;
  }
  .fg-overlay-tab.active { background: #e8962a; color: #0f1d42; font-weight: 700; border-color: #e8962a; }

  /* 4 pill selectors inside overlay */
  .fg-overlay-pills {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 5px; margin-bottom: 10px;
  }
  .fg-ov-pill {
    padding: 6px 4px; background: rgba(15,29,66,0.6);
    border: 1px solid var(--pc, #2d4080); border-radius: 8px;
    font-size: 11px; color: #8a9cc8; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    transition: all 0.15s;
  }
  .fg-ov-pill.active { background: rgba(25,45,90,0.9); border-width: 2px; }
  .fg-ov-pill span { font-size: 9px; font-weight: 700; }

  /* Hide the old full-panel content on plugin__content — 
     the overlay handles everything now */
  .fg .fg-status-grid { display: none; }
  .fg .fg-detail-panel:not(.fg-overlay-panel .fg-detail-panel) { display: none; }

</style>
