<section class="plugin__content fieldguard">

  <!-- HEADER -->
  <div class="fg-header">
    <span class="fg-logo">🛡️</span>
    <div class="fg-titlewrap">
      <div class="fg-title">FieldGuard</div>
      <div class="fg-subtitle">Heat · Cold · Wind · Rain · Storm</div>
    </div>
    <span class="fg-tier {isPro ? 'pro' : 'free'}">{isPro ? (licenseTier === 'site' ? 'SITE' : 'PRO') : 'FREE'}</span>
    <button class="fg-settings-btn" on:click={() => tab = tab === 'settings' ? 'dashboard' : 'settings'}>
      {tab === 'settings' ? '← Back' : '⚙ Config'}
    </button>
  </div>

  <!-- TABS -->
  <div class="fg-tabs">
    {#each TABS as t}
      <button class="fg-tab {tab === t.id ? 'active' : ''}" on:click={() => tab = t.id}>
        {t.icon} {t.label}
      </button>
    {/each}
  </div>

  <!-- ═══════════════ DASHBOARD ═══════════════════════════════ -->
  {#if tab === 'dashboard'}

    <div class="fg-location-row">
      <span>📍</span>
      <span class="fg-loc-text">{locationName || (lat.toFixed(3) + ', ' + lon.toFixed(3))}</span>
      <span class="fg-daynight {isDay ? 'day' : 'night'}">{isDay ? '☀ Day' : '🌙 Night'}</span>
      <button class="fg-mini-btn {locked ? 'locked' : ''}" title={locked ? 'Unlock pin (map clicks move it)' : 'Lock pin to this location'} on:click={() => locked = !locked}>{locked ? '🔒' : '🔓'}</button>
      <button class="fg-mini-btn" title="Refresh" on:click={refreshData}>🔄</button>
    </div>

    <div class="fg-model-row">
      <label style="margin:0">Model:</label>
      <select bind:value={selectedModel} on:change={refreshData}>
        {#each MODELS as m}<option value={m.key}>{m.label}</option>{/each}
      </select>
      <label class="fg-worst-label" style="margin:0">
        <input type="checkbox" bind:checked={worstCaseMode} on:change={refreshData} disabled={!isPro} />
        Worst-case ⚡{#if !isPro}<span class="fg-pro-tag">PRO</span>{/if}
      </label>
    </div>

    {#if loading}
      <div class="fg-loading">⏳ Fetching {worstCaseMode ? 'all models' : selectedModel}…</div>
    {:else if error}
      <div class="fg-error">⚠ {error}</div>
    {:else if heat}

      <!-- BAN PERIOD ALERT -->
      {#if heat.isBanPeriod && activeBan}
        <div class="fg-ban-alert">
          🚫 LEGAL WORK BAN ({activeBan.country}) — {activeBan.label}<br/>
          <small>Outdoor work prohibited now — workers must be in a shaded / A/C environment</small>
        </div>
      {:else if activeBan}
        <div class="fg-ban-info">ℹ {activeBan.country} statutory midday work ban: {activeBan.label}</div>
      {/if}

      <!-- 4-HAZARD SELECTOR STRIP -->
      <div class="fg-hazard-strip">
        <button class="fg-hz {selectedHazard==='heat'?'sel':''}" style="border-color:{heat.zoneInfo.color}" on:click={() => selectedHazard='heat'}>
          <div class="fg-hz-ic">🌡️</div>
          <div class="fg-hz-val">{fmtTemp(rawData?.tempC ?? 0, units, false)}<span class="fg-hz-u">°</span></div>
          <div class="fg-hz-st" style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</div>
        </button>
        <button class="fg-hz {selectedHazard==='wind'?'sel':''}" style="border-color:{windResult?.riskColor}" on:click={() => selectedHazard='wind'}>
          <div class="fg-hz-ic">💨</div>
          <div class="fg-hz-val">{fmtWind(rawData?.windMs ?? 0, units, false)}<span class="fg-hz-u">{units==='imperial'?'mph':'m/s'}</span></div>
          <div class="fg-hz-st" style="color:{windResult?.riskColor}">{windResult?.riskLabel}</div>
        </button>
        <button class="fg-hz {selectedHazard==='rain'?'sel':''}" style="border-color:{rainResult?.riskColor}" on:click={() => selectedHazard='rain'}>
          <div class="fg-hz-ic">🌧️</div>
          <div class="fg-hz-val">{fmtRain(rawData?.rainMmH ?? 0, units, false)}<span class="fg-hz-u">{units==='imperial'?'in':'mm'}</span></div>
          <div class="fg-hz-st" style="color:{rainResult?.riskColor}">{rainResult?.riskLabel}</div>
        </button>
        <button class="fg-hz {selectedHazard==='solar'?'sel':''}" style="border-color:{solarBand(rawData?.solarWm2 ?? 0, isDay).color}" on:click={() => selectedHazard='solar'}>
          <div class="fg-hz-ic">☀️</div>
          <div class="fg-hz-val">{rawData?.solarWm2 ?? 0}<span class="fg-hz-u">W</span></div>
          <div class="fg-hz-st" style="color:{solarBand(rawData?.solarWm2 ?? 0, isDay).color}">{solarBand(rawData?.solarWm2 ?? 0, isDay).label}</div>
        </button>
      </div>

      {#if selectedHazard === 'heat'}
      <!-- MAIN ZONE BANNER -->
      <div class="fg-zone-banner" style="background:{heat.zoneInfo.bgColor};border-color:{heat.zoneInfo.color}">
        <div class="fg-zone-dot" style="background:{heat.zoneInfo.color}"></div>
        <div class="fg-zone-main">
          <div class="fg-zone-name" style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</div>
          <div class="fg-zone-label">{heat.zoneInfo.label}</div>
          <div class="fg-zone-sub">Apparent Temp: {fmtTemp(heat.apparentTempFinal, units)}{#if isPro} | WBGT+PPE: {fmtTemp(heat.wbgtAdjusted, units)}{/if}</div>
        </div>
        <div class="fg-zone-time">{currentTime}</div>
      </div>

      <!-- HEAT ANALYSIS CARD -->
      <div class="fg-card" style="border-color:{heat.zoneInfo.color}">
        <div class="fg-card-header">🌡 Heat Stress{#if isPro} Analysis{/if}</div>
        {#if isPro}
        <div class="fg-metrics-grid">
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtTemp(rawData?.tempC ?? 0, units)}</div>
            <div class="fg-metric-lbl">Temp</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">{rawData?.humidity}%</div>
            <div class="fg-metric-lbl">Humidity</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtTemp(heat.apparentTemp1, units)}</div>
            <div class="fg-metric-lbl">App.Temp A</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val" style="color:{heat.zoneInfo.color}">
              {heat.apparentTempFinal === 999 ? 'NW' : fmtTemp(heat.apparentTempFinal, units)}
            </div>
            <div class="fg-metric-lbl">App.Temp B</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtTemp(heat.wbgtBase, units)}</div>
            <div class="fg-metric-lbl">WBGT</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val" style="color:{heat.wbgtAdjusted >= settings.wbgtDangerC ? '#dc2626' : heat.wbgtAdjusted >= settings.wbgtWarnC ? '#f97316' : '#94a3b8'}">
              {fmtTemp(heat.wbgtAdjusted, units)}
            </div>
            <div class="fg-metric-lbl">WBGT+PPE</div>
          </div>
        </div>
        {/if}
        <div class="fg-work-schedule">
          <div class="fg-ws-row">
            <span class="fg-ws-icon">🕐</span>
            <span class="fg-ws-label">Light work:</span>
            <span class="fg-ws-val">{heat.workRestSchedule.light}</span>
          </div>
          <div class="fg-ws-row">
            <span class="fg-ws-icon">💪</span>
            <span class="fg-ws-label">Heavy work:</span>
            <span class="fg-ws-val">{heat.workRestSchedule.heavy}</span>
          </div>
          <div class="fg-ws-row">
            <span class="fg-ws-icon">💧</span>
            <span class="fg-ws-label">Hydration:</span>
            <span class="fg-ws-val">{heat.hydration}</span>
          </div>
          {#if isPro}
          <div class="fg-ws-row">
            <span class="fg-ws-icon">👁</span>
            <span class="fg-ws-label">Monitoring:</span>
            <span class="fg-ws-val" style="font-size:9px">{heat.zoneInfo.monitoringSchedule}</span>
          </div>
          {/if}
        </div>
        {#if isPro}
          <div class="fg-ppe-row">PPE: {PPE_PROFILES[settings.ppeProfile].label} (+{PPE_PROFILES[settings.ppeProfile].adjustment}°C)</div>
          {#if worstCaseMode && worstModelLabel}
            <div class="fg-ppe-row" style="color:#38bdf8">⚡ Worst case: {worstModelLabel}</div>
          {/if}
        {:else}
          <div class="fg-lock">🔒 WBGT, Apparent Temp A/B, mandatory controls &amp; monitoring schedule
            <button class="fg-lock-btn" on:click={() => tab = 'settings'}>Upgrade to Pro →</button>
          </div>
        {/if}
      </div>

      <!-- MANDATORY CONTROLS (Pro) -->
      {#if isPro}
      <div class="fg-card" style="border-color:{heat.zoneInfo.color}">
        <div class="fg-card-header">⚠ Mandatory Controls ({heat.zoneInfo.riskLabel})</div>
        {#each heat.zoneInfo.mandatoryControls as ctrl}
          <div class="fg-control-item">▸ {ctrl}</div>
        {/each}
      </div>
      {/if}

      {:else if selectedHazard === 'wind'}
      <!-- WIND CARD -->
      <div class="fg-card" style="border-color:{windResult?.riskColor}">
        <div class="fg-card-header">
          💨 Wind
          <span class="fg-badge" style="background:{windResult?.riskColor}">{windResult?.riskLabel}</span>
        </div>
        {#if isPro}
        <div class="fg-metrics-grid">
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtWind(rawData?.windMs ?? 0, units)}</div>
            <div class="fg-metric-lbl">Speed</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtWindSecondary(rawData?.windMs ?? 0, units).val}</div>
            <div class="fg-metric-lbl">{fmtWindSecondary(rawData?.windMs ?? 0, units).lbl}</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">Bft {windResult?.beaufort}</div>
            <div class="fg-metric-lbl">{windResult?.beaufortDesc}</div>
          </div>
        </div>
        <div class="fg-threshold-row">⚠ Warn: {fmtWind(settings.windWarnMs, units)} &nbsp;|&nbsp; 🛑 Danger: {fmtWind(settings.windDangerMs, units)}</div>
        {:else}
        <div class="fg-metrics-grid">
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtWind(rawData?.windMs ?? 0, units)}</div>
            <div class="fg-metric-lbl">Speed</div>
          </div>
        </div>
        <div class="fg-lock">🔒 Beaufort scale, km/h &amp; custom thresholds
          <button class="fg-lock-btn" on:click={() => tab = 'settings'}>Upgrade to Pro →</button>
        </div>
        {/if}
      </div>

      {:else if selectedHazard === 'rain'}
      <!-- RAIN CARD -->
      <div class="fg-card" style="border-color:{rainResult?.riskColor}">
        <div class="fg-card-header">
          🌧 Rain
          <span class="fg-badge" style="background:{rainResult?.riskColor}">{rainResult?.riskLabel}</span>
        </div>
        {#if isPro}
        <div class="fg-metrics-grid">
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtRain(rawData?.rainMmH ?? 0, units)}</div>
            <div class="fg-metric-lbl">Rate</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">{rainResult?.intensityLabel}</div>
            <div class="fg-metric-lbl">Intensity</div>
          </div>
        </div>
        <div class="fg-threshold-row">⚠ Warn: {fmtRain(settings.rainWarnMmh, units)} &nbsp;|&nbsp; 🛑 Danger: {fmtRain(settings.rainDangerMmh, units)}</div>
        {:else}
        <div class="fg-metrics-grid">
          <div class="fg-metric">
            <div class="fg-metric-val">{fmtRain(rawData?.rainMmH ?? 0, units)}</div>
            <div class="fg-metric-lbl">Rate</div>
          </div>
        </div>
        <div class="fg-lock">🔒 Intensity scale &amp; custom thresholds
          <button class="fg-lock-btn" on:click={() => tab = 'settings'}>Upgrade to Pro →</button>
        </div>
        {/if}
      </div>

      {:else if selectedHazard === 'solar'}
      <!-- SOLAR RADIATION CARD -->
      <div class="fg-card" style="border-color:{solarBand(rawData?.solarWm2 ?? 0, isDay).color}">
        <div class="fg-card-header">
          ☀ Solar Radiation
          <span class="fg-badge" style="background:{solarBand(rawData?.solarWm2 ?? 0, isDay).color}">{solarBand(rawData?.solarWm2 ?? 0, isDay).label}</span>
        </div>
        {#if isPro}
        <div class="fg-metrics-grid">
          <div class="fg-metric">
            <div class="fg-metric-val">{rawData?.solarWm2 ?? 0}<span style="font-size:9px"> W/m²</span></div>
            <div class="fg-metric-lbl">Irradiance</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">{sunElevation}°</div>
            <div class="fg-metric-lbl">Sun Angle</div>
          </div>
          <div class="fg-metric">
            <div class="fg-metric-val">{isDay ? '☀ Day' : '🌙 Night'}</div>
            <div class="fg-metric-lbl">Daylight</div>
          </div>
        </div>
        <div class="fg-threshold-row">Adds to WBGT globe temperature — peak solar load drives heat stress.</div>
        {:else}
        <div class="fg-metrics-grid">
          <div class="fg-metric">
            <div class="fg-metric-val">{rawData?.solarWm2 ?? 0}<span style="font-size:9px"> W/m²</span></div>
            <div class="fg-metric-lbl">Irradiance</div>
          </div>
        </div>
        <div class="fg-lock">🔒 UV index, sun angle, sunrise/sunset &amp; WBGT solar contribution
          <button class="fg-lock-btn" on:click={() => tab = 'settings'}>Upgrade to Pro →</button>
        </div>
        {/if}
      </div>
      {/if}

      <!-- COLD STRESS / WIND CHILL CARD (Pro · winter) — under Heat -->
      {#if selectedHazard === 'heat' && showColdCard(coldResult) && coldResult}
        <div class="fg-card" style="border-color:{coldResult.riskColor}">
          <div class="fg-card-header">
            ❄ Cold Stress / Wind Chill
            <span class="fg-badge" style="background:{coldResult.riskColor}">{coldResult.riskLabel}</span>
          </div>
          <div class="fg-metrics-grid">
            <div class="fg-metric">
              <div class="fg-metric-val">{fmtTemp(rawData?.tempC ?? 0, units)}</div>
              <div class="fg-metric-lbl">Air Temp</div>
            </div>
            <div class="fg-metric">
              <div class="fg-metric-val" style="color:{coldResult.riskColor}">{fmtTemp(coldResult.windChillC, units)}</div>
              <div class="fg-metric-lbl">Wind Chill</div>
            </div>
            <div class="fg-metric">
              <div class="fg-metric-val">{fmtWind(rawData?.windMs ?? 0, units)}</div>
              <div class="fg-metric-lbl">Wind</div>
            </div>
          </div>
          <div class="fg-threshold-row">🥶 {coldResult.frostbite}</div>
          {#each coldResult.controls as ctrl}
            <div class="fg-control-item">▸ {ctrl}</div>
          {/each}
        </div>
      {/if}

      <!-- THUNDERSTORM / LIGHTNING RISK CARD (Pro) — under Rain -->
      {#if selectedHazard === 'rain' && isPro && thunderResult}
        <div class="fg-card" style="border-color:{thunderResult.riskColor}">
          <div class="fg-card-header">
            ⛈ Thunderstorm / Lightning Risk
            <span class="fg-badge" style="background:{thunderResult.riskColor}">{thunderResult.riskLabel}</span>
          </div>
          {#if thunderResult.available}
            <div class="fg-metrics-grid">
              <div class="fg-metric">
                <div class="fg-metric-val" style="color:{thunderResult.riskColor}">{thunderResult.capeJkg}</div>
                <div class="fg-metric-lbl">CAPE J/kg</div>
              </div>
              <div class="fg-metric" style="grid-column:span 2">
                <div class="fg-metric-val" style="font-size:11px">{thunderResult.instability}</div>
                <div class="fg-metric-lbl">Instability</div>
              </div>
            </div>
          {:else}
            <div class="fg-threshold-row">{thunderResult.instability}</div>
          {/if}
          <div class="fg-threshold-row">⚡ Lightning warning zone: ⌀ {fmtDistance(settings.lightningRadiusKm * 2, units)} diameter ({fmtDistance(settings.lightningRadiusKm, units)} radius)</div>
          {#each thunderResult.guidance as g}
            <div class="fg-control-item">▸ {g}</div>
          {/each}
        </div>
      {/if}

      <!-- MODEL COMPARISON TABLE -->
      {#if worstCaseMode && modelResults.length > 1}
        <div class="fg-card fg-card-flat">
          <div class="fg-card-header">📊 Model Comparison</div>
          <table class="fg-table">
            <thead><tr><th>Model</th><th>Zone</th><th>App.T</th><th>Wind</th></tr></thead>
            <tbody>
              {#each modelResults as mr}
                <tr class="{mr.isWorst ? 'fg-worst-row' : ''}">
                  <td>{mr.modelLabel}{mr.isWorst ? ' ⚡' : ''}</td>
                  <td style="color:{mr.heat.zoneInfo.color}">{mr.heat.zoneInfo.riskLabel}</td>
                  <td style="color:{mr.heat.zoneInfo.color}">
                    {mr.heat.apparentTempFinal === 999 ? 'NW' : fmtTemp(mr.heat.apparentTempFinal, units)}
                  </td>
                  <td style="color:{mr.wind.riskColor}">{fmtWind(mr.raw.windMs, units)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

    {/if}

  <!-- ═══════════════ EMERGENCY TAB ════════════════════════════ -->
  {:else if tab === 'emergency'}
    {#if !isPro}
      <div class="fg-pro-feature">
        <div class="pf-ic">🚨</div>
        <div class="pf-t">SOS — Pro Feature</div>
        <button class="pf-btn" on:click={() => tab = 'settings'}>Upgrade</button>
      </div>
    {:else}
    <div class="fg-section-title">🚨 Emergency Response</div>

    <div class="fg-emergency-card">
      <div class="fg-emg-title">⚠ Heat Stress Is Life-Threatening</div>
      <div class="fg-emg-sub">The body starts shutting down and cannot recover without help.</div>

      <div class="fg-emg-section">
        <div class="fg-emg-label">🔴 SYMPTOMS TO MONITOR (every 2 hours)</div>
        {#each HEAT_STRESS_SYMPTOMS as s}
          <div class="fg-emg-item">● {s}</div>
        {/each}
      </div>

      <div class="fg-emg-section">
        <div class="fg-emg-label">🚑 IMMEDIATE RESPONSE STEPS</div>
        {#each EMERGENCY_RESPONSE as step, i}
          <div class="fg-emg-step {step.includes('SEVERE') ? 'fg-emg-critical' : ''}">
            <span class="fg-emg-num">{i+1}</span> {step}
          </div>
        {/each}
      </div>
    </div>

    <div class="fg-card" style="border-color:#d97706">
      <div class="fg-card-header">📋 Alerts Log (This Session)</div>
      {#if alertLog.length === 0}
        <div class="fg-empty">No alerts triggered yet.</div>
      {:else}
        {#each [...alertLog].reverse().slice(0, 15) as alert}
          <div class="fg-alert-item" style="border-left:3px solid {alert.color}">
            <div class="fg-alert-time">{alert.time}</div>
            <div class="fg-alert-type">{alert.type}</div>
            <div class="fg-alert-msg">{alert.message}</div>
          </div>
        {/each}
      {/if}
    </div>
    {/if}

  <!-- ═══════════════ REPORT TAB ═════════════════════════════ -->
  {:else if tab === 'report'}
    <div class="fg-section-title">📄 Weekly ISO 7933 Report</div>
    <div class="fg-report-note">
      Aligned to ISO 7933:2004 / ISO 7243:2017 / ACGIH TLV / FIDIC Clause 8.4
    </div>

    {#if !isPro}
      <div class="fg-upgrade">🔒 ISO 7933 report generation is a <b>Pro</b> feature. Activate a license in <b>Config</b> to produce defensible weekly reports &amp; FIDIC 8.4 evidence.</div>
    {:else}
    <div class="fg-form">
      <label>Project Name<input bind:value={reportMeta.projectName} placeholder="Site/Project Name" /></label>
      <label>Contract No.<input bind:value={reportMeta.contractNumber} placeholder="CONTRACT-001" /></label>
      <label>Country / Jurisdiction<input bind:value={reportMeta.country} placeholder="Oman, UAE, Qatar…" /></label>
      <label>Client / Employer<input bind:value={reportMeta.clientName} placeholder="Client Name" /></label>
      <label>Main Contractor<input bind:value={reportMeta.contractorName} placeholder="Contractor Name" /></label>
      <label>HSE Manager<input bind:value={reportMeta.hseManagerName} placeholder="Name, Cert. No." /></label>
      <label>Regulatory Reference<input bind:value={reportMeta.regulatoryRef} placeholder="e.g. Min. Decision 286/2008" /></label>
      <label>Work Ban Start<input bind:value={reportMeta.banStart} placeholder="12:30" /></label>
      <label>Work Ban End<input bind:value={reportMeta.banEnd} placeholder="15:30" /></label>
      <label>Ban Months<input bind:value={reportMeta.banMonths} placeholder="June, July, August" /></label>
      <label>FIDIC Assessment
        <select bind:value={reportMeta.fidic}>
          <option>ELIGIBLE</option><option>NOT ELIGIBLE</option><option>UNDER REVIEW</option>
        </select>
      </label>
      <label>Est. Delay Days<input type="number" bind:value={reportMeta.delayDays} min="0" /></label>
    </div>

    <button class="fg-btn fg-btn-primary" on:click={generateReport}>📋 Generate ISO 7933 Report</button>

    {#if reportText}
      <div class="fg-report-preview">
        <div class="fg-report-toolbar">
          <span>Report Ready</span>
          <button class="fg-mini-btn" on:click={copyReport}>📋 Copy</button>
          <button class="fg-mini-btn" on:click={downloadReport}>⬇ Download .txt</button>
        </div>
        <pre class="fg-report-text">{reportText}</pre>
      </div>
    {/if}
    {/if}

  <!-- ═══════════════ SETTINGS TAB ═════════════════════════════ -->
  {:else if tab === 'settings'}
    <div class="fg-section-title">⚙ Configuration</div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">🔑 License</div>
      {#if isPro}
        <div class="fg-license-active">
          <span class="fg-pro-badge">✓ {licenseTier === 'site' ? 'SITE' : 'PRO'}</span>
          <span style="flex:1">Active{licenseExpires ? ' · expires ' + licenseExpires : ''}</span>
          <button class="fg-mini-btn" on:click={deactivateLicense}>Deactivate</button>
        </div>
      {:else}
        <div class="fg-note">Free tier. A license key unlocks Pro: imperial units, worst-case engine, cold-stress/winter, lightning, custom thresholds &amp; ISO 7933 reports.</div>
        <div class="fg-license-row">
          <input class="fg-license-input" type="text" placeholder="FG-XXXX-XXXX-XXXX" spellcheck="false"
                 bind:value={licenseKey} on:keydown={(e) => { if (e.key === 'Enter') activateLicense(); }} />
          <button class="fg-btn-inline" on:click={activateLicense} disabled={licenseChecking}>{licenseChecking ? '…' : 'Activate'}</button>
        </div>
        <a class="fg-buy-link" href="https://fieldguard-hse.com/#pricing" target="_blank" rel="noopener">Get a license →</a>
      {/if}
      {#if licenseMsg}<div class="fg-license-msg">{licenseMsg}</div>{/if}
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">🌐 Units &amp; Display {#if !isPro}<span class="fg-pro-tag">PRO</span>{/if}</div>
      <label class="fg-radio-label">
        <input type="radio" bind:group={settings.units} value="metric" on:change={saveSettings} disabled={!isPro} />
        <span class="fg-radio-text">Metric <span class="fg-adj">°C · m/s · mm/h</span></span>
      </label>
      <label class="fg-radio-label">
        <input type="radio" bind:group={settings.units} value="imperial" on:change={saveSettings} disabled={!isPro} />
        <span class="fg-radio-text">Imperial <span class="fg-adj">°F · mph · in/h</span></span>
      </label>
      <div class="fg-note">WBGT/heat-stress standards (ISO 7933/7243) are defined in °C; values are converted for display.</div>
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">❄ Winter / Cold-Stress Monitoring {#if !isPro}<span class="fg-pro-tag">PRO</span>{/if}</div>
      <div class="fg-note">Wind chill (Environment Canada) + ACGIH cold-stress zones &amp; frostbite times.</div>
      <label class="fg-radio-label">
        <input type="radio" bind:group={settings.winterMode} value="auto" on:change={saveSettings} disabled={!isPro} />
        <span class="fg-radio-text">Auto <span class="fg-adj">show when ≤ 10°C</span></span>
      </label>
      <label class="fg-radio-label">
        <input type="radio" bind:group={settings.winterMode} value="on" on:change={saveSettings} disabled={!isPro} />
        <span class="fg-radio-text">Always on</span>
      </label>
      <label class="fg-radio-label">
        <input type="radio" bind:group={settings.winterMode} value="off" on:change={saveSettings} disabled={!isPro} />
        <span class="fg-radio-text">Off</span>
      </label>
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">👷 PPE Profile (ISO 7933:2004)</div>
      {#each Object.entries(PPE_PROFILES) as [key, prof]}
        <label class="fg-radio-label">
          <input type="radio" bind:group={settings.ppeProfile} value={key} on:change={saveSettings} />
          <span class="fg-radio-text">{prof.label} <span class="fg-adj">+{prof.adjustment}°C</span></span>
        </label>
      {/each}
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">🌡 WBGT Custom Thresholds (ISO 7933) {#if !isPro}<span class="fg-pro-tag">PRO</span>{/if}</div>
      <div class="fg-note">Zone system uses a 2-step Apparent Temperature method. WBGT thresholds are used for FIDIC reports.</div>
      <label>Warning ({units === 'imperial' ? '°F' : '°C'})
        <div class="fg-slider-row">
          <input type="range" min="28" max="38" step="0.5" bind:value={settings.wbgtWarnC} on:change={saveSettings} disabled={!isPro} />
          <span>{fmtTemp(settings.wbgtWarnC, units)}</span>
        </div>
      </label>
      <label>Danger ({units === 'imperial' ? '°F' : '°C'})
        <div class="fg-slider-row">
          <input type="range" min="30" max="42" step="0.5" bind:value={settings.wbgtDangerC} on:change={saveSettings} disabled={!isPro} />
          <span>{fmtTemp(settings.wbgtDangerC, units)}</span>
        </div>
      </label>
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">💨 Wind Thresholds {#if !isPro}<span class="fg-pro-tag">PRO</span>{/if}</div>
      <label>Warning ({units === 'imperial' ? 'mph' : 'm/s'})
        <div class="fg-slider-row">
          <input type="range" min="5" max="25" step="0.5" bind:value={settings.windWarnMs} on:change={saveSettings} disabled={!isPro} />
          <span>{fmtWind(settings.windWarnMs, units)}</span>
        </div>
      </label>
      <label>Danger ({units === 'imperial' ? 'mph' : 'm/s'})
        <div class="fg-slider-row">
          <input type="range" min="10" max="35" step="0.5" bind:value={settings.windDangerMs} on:change={saveSettings} disabled={!isPro} />
          <span>{fmtWind(settings.windDangerMs, units)}</span>
        </div>
      </label>
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">🌧 Rain Thresholds {#if !isPro}<span class="fg-pro-tag">PRO</span>{/if}</div>
      <label>Warning ({units === 'imperial' ? 'in/h' : 'mm/h'})
        <div class="fg-slider-row">
          <input type="range" min="1" max="25" step="0.5" bind:value={settings.rainWarnMmh} on:change={saveSettings} disabled={!isPro} />
          <span>{fmtRain(settings.rainWarnMmh, units)}</span>
        </div>
      </label>
      <label>Danger ({units === 'imperial' ? 'in/h' : 'mm/h'})
        <div class="fg-slider-row">
          <input type="range" min="5" max="60" step="1" bind:value={settings.rainDangerMmh} on:change={saveSettings} disabled={!isPro} />
          <span>{fmtRain(settings.rainDangerMmh, units)}</span>
        </div>
      </label>
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">⛈ Lightning {#if !isPro}<span class="fg-pro-tag">PRO</span>{/if}</div>
      <div class="fg-note">Safety radius for the lightning warning zone (10 km ≈ the 30-30 rule). Shown on the Thunderstorm card.</div>
      <label>Warning radius ({units === 'imperial' ? 'mi' : 'km'})
        <div class="fg-slider-row">
          <input type="range" min="5" max="25" step="1" bind:value={settings.lightningRadiusKm} on:change={saveSettings} disabled={!isPro} />
          <span>{fmtDistance(settings.lightningRadiusKm, units)} · ⌀ {fmtDistance(settings.lightningRadiusKm * 2, units)}</span>
        </div>
      </label>
    </div>

    <div class="fg-settings-section">
      <div class="fg-settings-label">🔔 Alerts</div>
      <label class="fg-toggle-label">
        <input type="checkbox" bind:checked={settings.soundAlerts} on:change={saveSettings} />
        Browser notifications for danger zones
      </label>
      <label class="fg-toggle-label">
        <input type="checkbox" bind:checked={settings.autoRefresh} on:change={setupAutoRefresh} disabled={!isPro} />
        Auto-refresh every 15 minutes{#if !isPro} <span class="fg-pro-tag">PRO</span>{/if}
      </label>
    </div>

    <button class="fg-btn fg-btn-secondary" on:click={resetSettings}>↩ Reset to Defaults</button>

  {/if}

</section>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { map } from '@windy/map';

  import {
    assessHeatStress, assessWind, assessRain, assessColdStress, assessThunderstorm,
    PPE_PROFILES, ZONES,
    HEAT_STRESS_SYMPTOMS, EMERGENCY_RESPONSE,
    fmtTemp, fmtWind, fmtWindSecondary, fmtRain, fmtDistance,
    isDaytime, solarElevationDeg, solarBand, getMiddayBan,
    type WeatherInputs, type HeatAssessment, type WindResult, type RainResult,
    type ColdResult, type ThunderResult, type UnitSystem, type MiddayBan,
  } from './hse-calculations';

  import { generateWeeklyReport, type WeeklyReportData } from './report-generator';

  // ── State ──────────────────────────────────────────────────
  let tab = 'dashboard';
  let lat = 23.6, lon = 58.6;
  let locationName = '';
  let loading = false, error = '';
  let currentTime = '';
  let locked = false;                       // pin lock — when true, map clicks don't move the pin
  let isDay = true;                          // daylight at the pin (solar elevation > 0)
  let sunElevation = 0;                       // solar elevation angle (deg) at the pin
  let countryCode = '', countryName = '';    // resolved from the pin via reverse geocoding
  let activeBan: MiddayBan | null = null;    // statutory midday work ban for that country (if any)
  let geocodedFor = '';                      // lat,lon we last geocoded (avoid repeat calls)
  let rawData: WeatherInputs | null = null;
  let heat: HeatAssessment | null = null;
  let windResult: WindResult | null = null;
  let rainResult: RainResult | null = null;
  let coldResult: ColdResult | null = null;
  let thunderResult: ThunderResult | null = null;
  let selectedHazard = 'heat';   // which of the 4 hazard squares is expanded
  let modelResults: any[] = [];

  // ── License / tier ─────────────────────────────────────────
  // Pro features (imperial units, multi-model worst-case, cold-stress/winter,
  // lightning, custom thresholds, ISO 7933 report) unlock with a valid key,
  // validated at https://fieldguard-hse.com/api/validate.
  let licenseKey = '';
  let licenseTier = '';            // '' (free) | 'pro' | 'site'
  let licenseExpires = '';
  let licenseMsg = '';
  let licenseChecking = false;
  $: isPro = licenseTier === 'individual' || licenseTier === 'pro' || licenseTier === 'site';
  // Imperial display is a Pro feature — free tier is always metric.
  $: units = (isPro && settings.units === 'imperial' ? 'imperial' : 'metric') as UnitSystem;
  // Worst-case multi-model engine is Pro — free tier uses a single model.
  $: if (!isPro && worstCaseMode) worstCaseMode = false;
  let worstModelLabel = '';
  let selectedModel = 'ecmwf';
  let worstCaseMode = true;
  let alertLog: any[] = [];
  let reportText = '';
  let autoRefreshTimer: any = null;

  const TABS = [
    { id: 'dashboard',  icon: '🏠', label: 'Live'    },
    { id: 'emergency',  icon: '🚨', label: 'SOS'     },
    { id: 'report',     icon: '📄', label: 'Report'  },
    { id: 'settings',   icon: '⚙',  label: 'Config'  },
  ];

  // model key → Open-Meteo model id. Data is read over HTTP from Open-Meteo at the
  // pin's coordinates; the plugin NEVER changes Windy's map, overlays or store.
  const MODELS = [
    { key: 'ecmwf',  label: 'ECMWF',    om: 'ecmwf_ifs025' },
    { key: 'gfs',    label: 'GFS',      om: 'gfs_global' },
    { key: 'icon',   label: 'ICON',     om: 'icon_global' },
    { key: 'gem',    label: 'GEM',      om: 'gem_global' },
    { key: 'arpege', label: 'ARPEGE',   om: 'meteofrance_arpege_world' },
    { key: 'access', label: 'ACCESS-G', om: 'bom_access_global' },
  ];

  const DEFAULT_SETTINGS = {
    ppeProfile: 'coverall',
    wbgtWarnC: 30,
    wbgtDangerC: 32,
    windWarnMs: 12,
    windDangerMs: 20,
    rainWarnMmh: 7.6,
    rainDangerMmh: 25,
    soundAlerts: true,
    autoRefresh: false,
    units: 'metric' as UnitSystem,   // 'metric' (°C, m/s) or 'imperial' (°F, mph) — Pro
    winterMode: 'auto',              // 'auto' (show cold card when ≤10°C) | 'on' | 'off' — Pro
    lightningRadiusKm: 10,           // lightning safety radius (10 km ≈ 30-30 rule) — Pro
  };
  let settings = { ...DEFAULT_SETTINGS };

  let reportMeta = {
    projectName: '', contractNumber: '', country: '',
    clientName: '', contractorName: '', hseManagerName: '',
    regulatoryRef: 'Ministerial Decision No. 286/2008',
    banStart: '12:30', banEnd: '15:30', banMonths: 'June, July, August',
    fidic: 'UNDER REVIEW', delayDays: 0,
  };

  // ── Data fetching — Open-Meteo point API (NEVER touches Windy's map/overlays) ──
  // The plugin reads a point forecast for the pin's coordinates over HTTP. It does
  // NOT call store.set / change overlays / mutate Windy state, so it cannot break
  // the Windy map. Each model is one of Open-Meteo's global models.
  async function fetchModelData(modelKey: string): Promise<WeatherInputs | null> {
    try {
      const m = MODELS.find(x => x.key === modelKey);
      const om = m ? m.om : 'best_match';
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,shortwave_radiation` +
        `&hourly=cape&wind_speed_unit=ms&forecast_days=1&models=${om}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const j = await res.json();
      const c = j && j.current;
      if (!c || c.temperature_2m === undefined || c.temperature_2m === null) return null;

      // CAPE (thunderstorm/lightning potential) comes from the hourly series.
      let capeJkg: number | undefined;
      const capeArr = j && j.hourly && j.hourly.cape;
      if (Array.isArray(capeArr) && capeArr.length && capeArr[0] !== null && capeArr[0] !== undefined) {
        capeJkg = Math.max(0, Math.round(capeArr[0]));
      }

      return {
        tempC: Math.round(c.temperature_2m * 10) / 10,
        humidity: Math.min(100, Math.max(0, Math.round(c.relative_humidity_2m ?? 50))),
        windMs: Math.max(0, Math.round((c.wind_speed_10m ?? 0) * 10) / 10),
        solarWm2: Math.max(0, Math.round(c.shortwave_radiation ?? 0)),   // real shortwave irradiance
        rainMmH: Math.max(0, Math.round((c.precipitation ?? 0) * 10) / 10),
        capeJkg,
      };
    } catch {
      return null;
    }
  }

  // Reverse-geocode the pin → country (for the correct statutory work-ban rule).
  // Uses BigDataCloud's free client endpoint (no API key). Fails silently.
  async function resolveCountry() {
    const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    if (key === geocodedFor) return;        // already resolved for ~this spot
    geocodedFor = key;
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const j = await (await fetch(url)).json();
      countryCode = j.countryCode || '';
      countryName = j.countryName || '';
      locationName = [j.city || j.locality, j.principalSubdivision, countryName].filter(Boolean).join(', ');
      activeBan = getMiddayBan(countryCode);
    } catch {
      countryCode = ''; countryName = ''; activeBan = null;
    }
  }

  function processInputs(inputs: WeatherInputs) {
    const now = new Date();
    const localHour = now.getUTCHours() + lon / 15;
    const month = now.getMonth() + 1;
    isDay = isDaytime(lat, lon, now);
    sunElevation = solarElevationDeg(lat, lon, now);
    return {
      heat: assessHeatStress(inputs, settings.ppeProfile, localHour, month, activeBan),
      wind: assessWind(inputs.windMs, settings.windWarnMs, settings.windDangerMs),
      rain: assessRain(inputs.rainMmH, settings.rainWarnMmh, settings.rainDangerMmh),
      cold: assessColdStress(inputs.tempC, inputs.windMs),
      thunder: assessThunderstorm(inputs.capeJkg),
    };
  }

  // Show the cold-stress card when winterMode is 'on', or 'auto' and it's cold.
  function showColdCard(c: ColdResult | null): boolean {
    if (!isPro || !c) return false;
    if (settings.winterMode === 'off') return false;
    if (settings.winterMode === 'on') return true;
    return c.active; // auto
  }

  // Zone severity score for worst-case selection
  function zoneSeverity(zone: string): number {
    return { green: 0, amber: 1, red: 2, purple: 3, black: 4 }[zone] ?? 0;
  }

  async function refreshData() {
    loading = true; error = '';
    currentTime = new Date().toLocaleTimeString();
    try {
      await resolveCountry();
      const results: any[] = [];

      if (worstCaseMode) {
        for (const model of MODELS) {
          const inputs = await fetchModelData(model.key);
          if (!inputs) continue;
          const { heat: h, wind: w, rain: r, cold: cd, thunder: th } = processInputs(inputs);
          results.push({ modelKey: model.key, modelLabel: model.label, raw: inputs, heat: h, wind: w, rain: r, cold: cd, thunder: th, isWorst: false });
        }
      }

      // Single-model path (or fallback if worst-case returned nothing)
      if (results.length === 0) {
        const inputs = await fetchModelData(selectedModel);
        if (!inputs) throw new Error('No data available');
        const { heat: h, wind: w, rain: r, cold: cd, thunder: th } = processInputs(inputs);
        results.push({ modelKey: selectedModel, modelLabel: MODELS.find(m => m.key === selectedModel)?.label ?? selectedModel, raw: inputs, heat: h, wind: w, rain: r, cold: cd, thunder: th, isWorst: true });
      } else {
        // Pick worst: highest zone severity, then highest apparent temp
        results.sort((a, b) => {
          const zd = zoneSeverity(b.heat.zone) - zoneSeverity(a.heat.zone);
          if (zd !== 0) return zd;
          return (b.heat.apparentTempFinal === 999 ? 99 : b.heat.apparentTempFinal)
               - (a.heat.apparentTempFinal === 999 ? 99 : a.heat.apparentTempFinal);
        });
        results[0].isWorst = true;
      }

      modelResults = results;
      rawData = results[0].raw;
      heat = results[0].heat;
      windResult = results[0].wind;
      rainResult = results[0].rain;
      coldResult = results[0].cold;
      thunderResult = results[0].thunder;
      worstModelLabel = results[0].modelLabel;

      checkAlerts();
    } catch (e) {
      error = 'Failed to fetch data. Check network or try a different model.';
    }
    loading = false;
  }

  function checkAlerts() {
    if (!heat || !windResult || !rainResult) return;
    const time = new Date().toLocaleTimeString();

    if (heat.zone !== 'green') {
      const entry = {
        time, type: `🌡 HEAT — ${heat.zoneInfo.riskLabel}`,
        color: heat.zoneInfo.color,
        message: `App.Temp: ${heat.apparentTempFinal === 999 ? 'NO WORK' : heat.apparentTempFinal+'°C'} | ${heat.zoneInfo.label}`,
      };
      alertLog = [...alertLog, entry];
      if (settings.soundAlerts && (heat.zone === 'red' || heat.zone === 'purple' || heat.zone === 'black')) {
        triggerNotification(entry.type, entry.message);
      }
    }
    if (windResult.exceedsThreshold) {
      alertLog = [...alertLog, { time, type: '💨 WIND ALERT', color: windResult.riskColor,
        message: `${rawData?.windMs.toFixed(1)} m/s — Bft ${windResult.beaufort} (${windResult.beaufortDesc})` }];
    }
    if (rainResult.exceedsThreshold) {
      alertLog = [...alertLog, { time, type: '🌧 RAIN ALERT', color: rainResult.riskColor,
        message: `${rawData?.rainMmH.toFixed(1)} mm/h — ${rainResult.intensityLabel}` }];
    }
    if (isPro && coldResult && coldResult.exceedsThreshold) {
      const entry = { time, type: `❄ COLD — ${coldResult.riskLabel}`, color: coldResult.riskColor,
        message: `Wind chill ${fmtTemp(coldResult.windChillC, units)} — ${coldResult.frostbite}` };
      alertLog = [...alertLog, entry];
      if (settings.soundAlerts) triggerNotification(entry.type, entry.message);
    }
    if (isPro && thunderResult && thunderResult.exceedsThreshold) {
      const entry = { time, type: `⛈ STORM — ${thunderResult.riskLabel}`, color: thunderResult.riskColor,
        message: `CAPE ${thunderResult.capeJkg} J/kg — ${thunderResult.instability}` };
      alertLog = [...alertLog, entry];
      if (settings.soundAlerts) triggerNotification(entry.type, entry.message);
    }
    if (heat.isBanPeriod) {
      alertLog = [...alertLog, { time, type: '🚫 LEGAL WORK BAN', color: '#f97316',
        message: `12:30–15:30 outdoor ban active (${reportMeta.banMonths})` }];
    }
  }

  function triggerNotification(title: string, body: string) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') new Notification(`FieldGuard: ${title}`, { body });
      else Notification.requestPermission();
    }
  }

  function saveSettings() {
    try { localStorage.setItem('fieldguard_settings', JSON.stringify(settings)); } catch {}
    refreshData();
  }
  function resetSettings() { settings = { ...DEFAULT_SETTINGS }; saveSettings(); }
  function setupAutoRefresh() {
    if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
    if (settings.autoRefresh) autoRefreshTimer = setInterval(refreshData, 15 * 60 * 1000);
  }

  // ── License activation (validated at fieldguard-hse.com/api/validate) ──
  const LICENSE_API = 'https://fieldguard-hse.com/api/validate';
  function loadLicense() {
    try {
      const s = localStorage.getItem('fieldguard_license');
      if (!s) return;
      const o = JSON.parse(s);
      if (o && o.tier && o.expires && new Date(o.expires) > new Date()) {
        licenseKey = o.key || ''; licenseTier = o.tier; licenseExpires = o.expires;
      } else { localStorage.removeItem('fieldguard_license'); }
    } catch {}
  }
  async function activateLicense() {
    const key = (licenseKey || '').trim().toUpperCase();
    licenseKey = key;
    if (!/^FGS?-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) {
      licenseMsg = 'Invalid key format — expected FG-XXXX-XXXX-XXXX'; return;
    }
    licenseChecking = true; licenseMsg = 'Checking…';
    try {
      const res = await fetch(LICENSE_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const j = await res.json();
      if (j && j.valid) {
        licenseTier = j.tier || 'pro'; licenseExpires = j.expires || '';
        try { localStorage.setItem('fieldguard_license', JSON.stringify({ key, tier: licenseTier, expires: licenseExpires })); } catch {}
        licenseMsg = '✓ Activated — Pro features unlocked';
        refreshData();
      } else {
        licenseTier = ''; licenseExpires = '';
        licenseMsg = (j && j.reason === 'expired') ? 'This key has expired — please renew.' : 'Key not found or invalid.';
      }
    } catch {
      licenseMsg = 'Could not reach the license server. Check your connection.';
    }
    licenseChecking = false;
  }
  function deactivateLicense() {
    licenseTier = ''; licenseExpires = ''; licenseKey = ''; licenseMsg = '';
    try { localStorage.removeItem('fieldguard_license'); } catch {}
    refreshData();
  }

  function generateReport() {
    const today = new Date();
    const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const dailyMet = days.map(day => ({
      day, maxTemp: rawData?.tempC ?? 0, minTemp: (rawData?.tempC ?? 8) - 8,
      maxRH: rawData?.humidity ?? 0, maxWind: rawData?.windMs ?? 0, peakSolar: rawData?.solarWm2 ?? 0,
    }));
    const wbgtLog = alertLog.filter(a => a.type.includes('HEAT')).map((a, i) => ({
      date: fmt(new Date(today.getTime() - (6-i)*86400000)), time: a.time,
      durationH: 0.5, wbgtBase: heat?.wbgtBase ?? 0, wbgtAdj: heat?.wbgtAdjusted ?? 0,
      ppe: PPE_PROFILES[settings.ppeProfile].label,
      zone: heat?.zoneInfo.riskLabel ?? '', action: heat?.zoneInfo.mandatoryControls[0] ?? '',
    }));
    const rd: WeeklyReportData = {
      ...reportMeta,
      siteAddress: locationName || `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
      lat, lon,
      weekStart: fmt(weekAgo), weekEnd: fmt(today),
      ppeProfile: PPE_PROFILES[settings.ppeProfile].label,
      ppeAdjustment: PPE_PROFILES[settings.ppeProfile].adjustment,
      dailyMet, wbgtLog,
      morningGap: [], suspensions: [],
      totalSuspensionHours: wbgtLog.reduce((s,e) => s + e.durationH, 0),
      cumulativeSuspensionHours: wbgtLog.reduce((s,e) => s + e.durationH, 0),
      forecastNarrative: `FieldGuard worst-case analysis at ${locationName || `${lat.toFixed(3)}, ${lon.toFixed(3)}`} ` +
        `shows ${heat?.zoneInfo.riskLabel ?? 'N/A'} zone (Apparent Temp: ${heat?.apparentTempFinal === 999 ? 'NO WORK' : (heat?.apparentTempFinal ?? 'N/A')+'°C'}, ` +
        `WBGT+PPE: ${heat?.wbgtAdjusted ?? 'N/A'}°C). ${heat?.zoneInfo.mandatoryControls[0] ?? ''}`,
    };
    reportText = generateWeeklyReport(rd);
  }

  function copyReport() { navigator.clipboard?.writeText(reportText).catch(()=>{}); }
  function downloadReport() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([reportText], {type:'text/plain'}));
    a.download = `FieldGuard-ISO7933-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  }

  // Named handler so onDestroy removes ONLY our listener via map.off('click', onMapClick).
  // (A bare map.off('click') would strip every click handler on the Windy map, including Windy's own.)
  function onMapClick(e: any) {
    if (locked) return;
    lat = e.latlng.lat; lon = e.latlng.lng; refreshData();
  }

  onMount(() => {
    try { const s = localStorage.getItem('fieldguard_settings'); if (s) settings = {...DEFAULT_SETTINGS, ...JSON.parse(s)}; } catch {}
    loadLicense();
    try { const c = map.getCenter(); lat = c.lat; lon = c.lng; } catch {}
    map.on('click', onMapClick);
    refreshData();
    setupAutoRefresh();
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  });

  onDestroy(() => {
    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    map.off('click', onMapClick);
  });

  export const onopen = (params: any) => {
    if (params?.lat && params?.lon) { lat = parseFloat(params.lat); lon = parseFloat(params.lon); refreshData(); }
  };
</script>

<style>
  .fieldguard {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #e2e8f0; font-size: 13px; padding: 0 0 14px; background: #0f172a;
    min-height: 100%;
  }
  .fg-header {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    background:#0f172a; border-bottom:1px solid #1e293b;
  }
  .fg-logo { font-size:26px; flex-shrink:0; }
  .fg-titlewrap { min-width:0; flex:1; overflow:hidden; }
  .fg-title { font-size:16px; font-weight:700; color:#f8fafc; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fg-subtitle { font-size:9px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fg-settings-btn {
    margin-left:auto; background:#1e293b; border:1px solid #334155;
    color:#94a3b8; padding:4px 8px; border-radius:5px; cursor:pointer; font-size:11px;
  }
  .fg-tabs { display:flex; background:#0f172a; border-bottom:1px solid #1e293b; }
  .fg-tab { flex:1; padding:7px 2px; background:transparent; border:none; color:#64748b; cursor:pointer; font-size:11px; }
  .fg-tab.active { color:#38bdf8; border-bottom:2px solid #38bdf8; }
  .fg-location-row {
    display:flex; align-items:center; gap:6px; padding:6px 12px;
    background:#1e293b; font-size:11px; color:#94a3b8;
  }
  .fg-loc-text { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .fg-model-row { display:flex; align-items:center; gap:8px; padding:5px 12px; background:#0f172a; font-size:11px; color:#94a3b8; }
  .fg-model-row select { background:#1e293b; border:1px solid #334155; color:#e2e8f0; padding:3px 6px; border-radius:4px; font-size:11px; }
  .fg-worst-label { display:flex; align-items:center; gap:4px; cursor:pointer; margin-left:auto; }
  .fg-mini-btn { background:#334155; border:none; color:#94a3b8; padding:2px 6px; border-radius:4px; cursor:pointer; font-size:11px; }
  .fg-mini-btn.locked { background:#b45309; color:#fff; }
  .fg-daynight { font-size:10px; padding:2px 8px; border-radius:10px; white-space:nowrap; flex-shrink:0; }
  .fg-daynight.day { background:#78350f; color:#fcd34d; }
  .fg-daynight.night { background:#1e3a8a; color:#bfdbfe; }
  .fg-ban-info { margin:5px 12px 0; padding:6px 10px; background:#0f172a; border:1px solid #334155; border-radius:6px; font-size:10px; color:#94a3b8; }
  .fg-hazard-strip { display:flex; gap:6px; padding:8px 12px 4px; }
  .fg-hz { flex:1; background:#1e293b; border:2px solid #334155; border-radius:10px; padding:8px 4px 7px; cursor:pointer; text-align:center; min-width:0; }
  .fg-hz.sel { outline:2px solid #f8fafc; outline-offset:-2px; }
  .fg-hz-ic { font-size:16px; line-height:1; }
  .fg-hz-val { font-size:15px; font-weight:800; color:#f8fafc; margin-top:3px; line-height:1; white-space:nowrap; }
  .fg-hz-u { font-size:9px; font-weight:600; color:#94a3b8; margin-left:1px; }
  .fg-hz-st { font-size:8.5px; font-weight:700; letter-spacing:0.3px; margin-top:4px; }
  .fg-loading { padding:20px; text-align:center; color:#64748b; }
  .fg-error   { padding:12px; background:#450a0a; color:#fca5a5; border-radius:6px; margin:8px 12px; }
  .fg-ban-alert {
    margin:6px 12px; padding:10px 12px; background:#7c2d12; border:1px solid #ea580c;
    border-radius:7px; color:#fed7aa; font-size:12px; font-weight:600; text-align:center;
  }
  .fg-ban-alert small { font-weight:400; font-size:10px; display:block; margin-top:3px; color:#fdba74; }
  .fg-zone-banner {
    display:flex; align-items:center; gap:10px;
    margin:8px 12px; padding:10px 12px; border-radius:8px; border:1px solid;
  }
  .fg-zone-dot { width:14px; height:14px; border-radius:50%; flex-shrink:0; }
  .fg-zone-main { flex:1; }
  .fg-zone-name { font-size:17px; font-weight:800; letter-spacing:1px; }
  .fg-zone-label { font-size:11px; color:#94a3b8; }
  .fg-zone-sub { font-size:10px; color:#64748b; margin-top:2px; }
  .fg-zone-time { font-size:10px; color:#475569; }
  .fg-card {
    background:#1e293b; border:1px solid #334155; border-left-width:3px;
    border-radius:8px; margin:5px 12px; padding:10px;
  }
  .fg-card-flat { background:#1e293b; border:1px solid #334155; border-radius:8px; margin:5px 12px; padding:10px; }
  .fg-card-header { font-weight:600; font-size:12px; margin-bottom:8px; color:#f1f5f9; display:flex; align-items:center; }
  .fg-badge { margin-left:auto; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; color:#fff; }
  .fg-metrics-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:5px; margin-bottom:8px; }
  .fg-metric { background:#0f172a; border-radius:6px; padding:5px; text-align:center; }
  .fg-metric-val { font-size:14px; font-weight:700; color:#f8fafc; }
  .fg-metric-lbl { font-size:9px; color:#64748b; text-transform:uppercase; }
  .fg-work-schedule { background:#0f172a; border-radius:6px; padding:7px; margin-bottom:6px; }
  .fg-ws-row { display:flex; align-items:baseline; gap:6px; padding:2px 0; }
  .fg-ws-icon { font-size:11px; }
  .fg-ws-label { font-size:10px; color:#64748b; min-width:70px; }
  .fg-ws-val { font-size:11px; color:#94a3b8; font-weight:500; }
  .fg-ppe-row { font-size:10px; color:#475569; margin-top:4px; }
  .fg-control-item { font-size:11px; color:#94a3b8; padding:3px 0; border-bottom:1px solid #0f172a; }
  .fg-control-item:last-child { border-bottom:none; }
  .fg-threshold-row { font-size:10px; color:#475569; margin-top:4px; }
  .fg-table { width:100%; border-collapse:collapse; font-size:11px; }
  .fg-table th { color:#64748b; text-align:left; padding:3px 4px; border-bottom:1px solid #334155; }
  .fg-table td { padding:3px 4px; color:#94a3b8; }
  .fg-worst-row td { color:#f1f5f9; font-weight:600; background:#0f172a; }
  .fg-section-title { padding:10px 12px 4px; font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px; }
  .fg-empty { padding:16px; text-align:center; color:#475569; font-size:11px; }
  .fg-alert-item { margin:3px 12px; padding:7px 10px; background:#1e293b; border-radius:6px; }
  .fg-alert-time { font-size:10px; color:#64748b; }
  .fg-alert-type { font-size:12px; font-weight:600; color:#f1f5f9; }
  .fg-alert-msg  { font-size:11px; color:#94a3b8; }
  .fg-emergency-card { background:#1e293b; border-radius:8px; margin:6px 12px; padding:12px; border:1px solid #dc2626; }
  .fg-emg-title { font-size:14px; font-weight:700; color:#f87171; margin-bottom:4px; }
  .fg-emg-sub { font-size:11px; color:#94a3b8; margin-bottom:10px; }
  .fg-emg-section { margin-bottom:12px; }
  .fg-emg-label { font-size:10px; color:#64748b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .fg-emg-item { font-size:11px; color:#fca5a5; padding:2px 0; }
  .fg-emg-step { display:flex; gap:8px; align-items:flex-start; padding:4px 0; font-size:11px; color:#94a3b8; }
  .fg-emg-num { background:#334155; color:#e2e8f0; border-radius:3px; padding:1px 5px; font-size:10px; font-weight:700; flex-shrink:0; }
  .fg-emg-critical { color:#f87171 !important; font-weight:600; }
  .fg-emg-critical .fg-emg-num { background:#dc2626; }
  .fg-report-note { margin:0 12px 6px; padding:7px 10px; background:#1e293b; border-radius:6px; font-size:10px; color:#64748b; }
  .fg-form { padding:0 12px; display:grid; grid-template-columns:1fr 1fr; gap:5px; }
  label { display:block; color:#94a3b8; font-size:11px; margin-bottom:4px; }
  .fg-form label input, .fg-form label select { display:block; width:100%; background:#0f172a; border:1px solid #334155; color:#e2e8f0; padding:5px 8px; border-radius:5px; font-size:11px; margin-top:2px; box-sizing:border-box; }
  /* radios/checkboxes must stay their natural size — never full-width */
  .fg-radio-label input[type="radio"], .fg-toggle-label input[type="checkbox"], .fg-worst-label input[type="checkbox"] { width:auto; flex:0 0 auto; margin:0; }
  .fg-radio-text { text-align:left; }
  .fg-btn { display:block; width:calc(100% - 24px); margin:6px 12px; padding:9px; border:none; border-radius:7px; font-size:13px; font-weight:600; cursor:pointer; }
  .fg-btn-primary { background:#0284c7; color:#fff; }
  .fg-btn-secondary { background:#334155; color:#94a3b8; }
  .fg-report-preview { margin:6px 12px; background:#0f172a; border:1px solid #334155; border-radius:8px; overflow:hidden; }
  .fg-report-toolbar { display:flex; align-items:center; gap:8px; padding:6px 10px; background:#1e293b; border-bottom:1px solid #334155; font-size:11px; color:#64748b; }
  .fg-report-toolbar span { flex:1; }
  .fg-report-text { padding:10px; font-size:9px; color:#94a3b8; white-space:pre; overflow:auto; max-height:280px; font-family:'Courier New',monospace; line-height:1.5; }
  .fg-settings-section { background:#1e293b; border-radius:8px; margin:5px 12px; padding:10px; }
  .fg-settings-label { font-size:10px; font-weight:600; color:#38bdf8; margin-bottom:7px; text-transform:uppercase; letter-spacing:0.5px; }
  .fg-note { font-size:10px; color:#475569; margin-bottom:7px; }
  .fg-radio-label { display:flex; align-items:center; gap:8px; padding:4px 0; cursor:pointer; border-bottom:1px solid #0f172a; }
  .fg-radio-label:last-child { border-bottom:none; }
  .fg-radio-text { font-size:11px; color:#cbd5e1; flex:1; }
  .fg-adj { background:#334155; color:#94a3b8; border-radius:3px; padding:1px 5px; font-size:9px; margin-left:4px; }
  .fg-pro-tag { background:#f59e0b; color:#0f172a; border-radius:3px; padding:1px 5px; font-size:8px; font-weight:700; margin-left:6px; letter-spacing:0.5px; }
  .fg-tier { font-size:9px; font-weight:700; letter-spacing:0.5px; padding:2px 7px; border-radius:4px; margin-left:6px; flex-shrink:0; }
  .fg-tier.free { background:#334155; color:#94a3b8; }
  .fg-tier.pro { background:#f59e0b; color:#0f172a; }
  .fg-license-active { display:flex; align-items:center; gap:8px; font-size:11px; color:#cbd5e1; }
  .fg-pro-badge { background:#16a34a; color:#fff; font-weight:700; font-size:10px; padding:2px 8px; border-radius:4px; }
  .fg-license-row { display:flex; gap:6px; margin-top:6px; }
  .fg-license-input { flex:1; min-width:0; background:#0f172a; border:1px solid #334155; color:#e2e8f0; padding:6px 8px; border-radius:5px; font-size:12px; font-family:monospace; letter-spacing:0.5px; text-transform:uppercase; }
  .fg-btn-inline { background:#0284c7; color:#fff; border:none; border-radius:5px; padding:6px 12px; font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap; }
  .fg-btn-inline:disabled { opacity:0.6; cursor:default; }
  .fg-buy-link { display:inline-block; margin-top:7px; font-size:11px; color:#38bdf8; text-decoration:none; }
  .fg-license-msg { margin-top:7px; font-size:11px; color:#fcd34d; }
  .fg-upgrade { margin:8px 12px; padding:12px; background:#1e293b; border:1px solid var(--amber, #f59e0b); border-radius:8px; font-size:12px; color:#fcd34d; line-height:1.6; }
  input:disabled { opacity:0.45; cursor:not-allowed; }
  .fg-lock { margin-top:8px; padding:8px 10px; background:#0f172a; border:1px dashed #475569; border-radius:6px; font-size:10px; color:#94a3b8; display:flex; flex-direction:column; gap:7px; }
  .fg-lock-btn { background:#f59e0b; color:#0f172a; border:none; border-radius:5px; padding:7px 10px; font-size:11px; font-weight:700; cursor:pointer; }
  .fg-pro-feature { text-align:center; padding:32px 16px; }
  .fg-pro-feature .pf-ic { font-size:34px; }
  .fg-pro-feature .pf-t { font-size:15px; font-weight:700; color:#f1f5f9; margin:10px 0 16px; }
  .fg-pro-feature .pf-btn { display:inline-block; background:#f59e0b; color:#0f172a; border:none; border-radius:7px; padding:10px 28px; font-size:13px; font-weight:700; cursor:pointer; }
  .fg-slider-row { display:flex; align-items:center; gap:8px; }
  .fg-slider-row input[type="range"] { flex:1; }
  .fg-slider-row span { min-width:55px; text-align:right; color:#38bdf8; font-size:11px; font-weight:600; }
  .fg-toggle-label { display:flex; align-items:center; gap:8px; padding:5px 0; cursor:pointer; font-size:11px; color:#cbd5e1; }
</style>
