<!-- FieldGuard v3.0 — clean rebuild matching approved preview -->

<!-- ══ MOBILE TOP STRIP (plugin__mobile-header for mobileUI=small) ══════════ -->
<div class="plugin__mobile-header fg-mbar">
  {#if loading}
    <div class="fg-mbar-load"><div class="fg-spin"></div><span>Loading…</span></div>
  {:else if heat}
    <button class="fg-mp {mActive==='heat'?'fg-mp-on':''}" style="--c:{heat.zoneInfo.color}" on:click={() => mToggle('heat')}>
      <span class="fg-mp-ic">🌡</span>
      <span class="fg-mp-vl">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°C'}</span>
      <span class="fg-mp-lb" style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</span>
    </button>
    <button class="fg-mp {mActive==='wind'?'fg-mp-on':''}" style="--c:{windResult?.riskColor}" on:click={() => mToggle('wind')}>
      <span class="fg-mp-ic">💨</span>
      <span class="fg-mp-vl">{rawData?.windMs.toFixed(1)}<span class="fg-mp-u">m/s</span></span>
      <span class="fg-mp-lb" style="color:{windResult?.riskColor}">{windResult?.riskLabel}</span>
    </button>
    <button class="fg-mp {mActive==='rain'?'fg-mp-on':''}" style="--c:{rainResult?.riskColor}" on:click={() => mToggle('rain')}>
      <span class="fg-mp-ic">🌧</span>
      <span class="fg-mp-vl">{rawData?.rainMmH.toFixed(1)}<span class="fg-mp-u">mm</span></span>
      <span class="fg-mp-lb" style="color:{rainResult?.riskColor}">{rainResult?.riskLabel}</span>
    </button>
    <button class="fg-mp {mActive==='solar'?'fg-mp-on':''}" style="--c:{solarColor}" on:click={() => mToggle('solar')}>
      <span class="fg-mp-ic">{isNight?'🌙':'☀'}</span>
      <span class="fg-mp-vl">{isNight?'--':rawData?.solarWm2}<span class="fg-mp-u">{isNight?'':'W'}</span></span>
      <span class="fg-mp-lb" style="color:{solarColor}">{solarLabel}</span>
    </button>
    <button class="fg-mrf" on:click={refreshData} title="Refresh">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
    </button>
  {:else}
    <button class="fg-mbar-tap" on:click={refreshData}>⚡ Tap to load FieldGuard</button>
  {/if}
</div>

<!-- Mobile detail dropdown (below bar) -->
{#if mActive}
  <div class="fg-mdet">
    {#if mActive === 'heat' && heat}
      <div class="fg-det-title" style="color:{heat.zoneInfo.color}">🌡 Heat Stress — {heat.zoneInfo.riskLabel}</div>
      <div class="fg-det-grid">
        <div class="fg-dc"><span class="fg-dv">{rawData?.tempC}°C</span><span class="fg-dl">Temp</span></div>
        <div class="fg-dc"><span class="fg-dv">{rawData?.humidity}%</span><span class="fg-dl">Humidity</span></div>
        <div class="fg-dc"><span class="fg-dv">{heat.apparentTemp1}°C</span><span class="fg-dl">App.T A</span></div>
        <div class="fg-dc"><span class="fg-dv" style="color:{heat.zoneInfo.color}">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°C'}</span><span class="fg-dl">App.T B</span></div>
        <div class="fg-dc"><span class="fg-dv">{heat.wbgtBase}°C</span><span class="fg-dl">WBGT</span></div>
        <div class="fg-dc"><span class="fg-dv">{heat.wbgtAdjusted}°C</span><span class="fg-dl">WBGT+PPE</span></div>
      </div>
      <div class="fg-ds">
        <div class="fg-dr"><span class="fg-drl">🕐 Light work</span><span class="fg-drv">{heat.workRestSchedule.light}</span></div>
        <div class="fg-dr"><span class="fg-drl">💪 Heavy work</span><span class="fg-drv">{heat.workRestSchedule.heavy}</span></div>
        <div class="fg-dr"><span class="fg-drl">💧 Hydration</span><span class="fg-drv">{heat.hydration}</span></div>
      </div>
      <div class="fg-dct">⚠ Mandatory Controls</div>
      {#each heat.zoneInfo.mandatoryControls as c}<div class="fg-dci">▸ {c}</div>{/each}
    {:else if mActive === 'wind' && windResult}
      <div class="fg-det-title" style="color:{windResult.riskColor}">💨 Wind — {windResult.riskLabel}</div>
      <div class="fg-det-grid">
        <div class="fg-dc"><span class="fg-dv">{rawData?.windMs.toFixed(1)}</span><span class="fg-dl">m/s</span></div>
        <div class="fg-dc"><span class="fg-dv">{((rawData?.windMs??0)*3.6).toFixed(1)}</span><span class="fg-dl">km/h</span></div>
        <div class="fg-dc"><span class="fg-dv">Bft {windResult.beaufort}</span><span class="fg-dl">{windResult.beaufortDesc}</span></div>
      </div>
      <div class="fg-dthr">Warn ≥ {settings.windWarnMs} m/s · Danger ≥ {settings.windDangerMs} m/s</div>
    {:else if mActive === 'rain' && rainResult}
      <div class="fg-det-title" style="color:{rainResult.riskColor}">🌧 Rain — {rainResult.riskLabel}</div>
      <div class="fg-det-grid">
        <div class="fg-dc"><span class="fg-dv">{rawData?.rainMmH.toFixed(1)}</span><span class="fg-dl">mm/h</span></div>
        <div class="fg-dc"><span class="fg-dv">{rainResult.intensityLabel}</span><span class="fg-dl">Intensity</span></div>
      </div>
      <div class="fg-dthr">Warn ≥ {settings.rainWarnMmh} mm/h · Danger ≥ {settings.rainDangerMmh} mm/h</div>
    {:else if mActive === 'solar'}
      <div class="fg-det-title" style="color:{solarColor}">{isNight?'🌙 Night — No Solar':'☀ Solar — '+solarLabel}</div>
      {#if isNight}
        <div class="fg-night-msg">
          <div style="font-size:24px">🌙</div>
          <div>Solar radiation is <strong>zero</strong> at night. WBGT uses only temp, humidity and wind.</div>
          <div style="color:#4a6090">Sunrise: ~{sunriseTime} · Sunset: ~{sunsetTime}</div>
        </div>
      {:else}
        <div class="fg-det-grid">
          <div class="fg-dc"><span class="fg-dv">{rawData?.solarWm2}</span><span class="fg-dl">W/m²</span></div>
          <div class="fg-dc"><span class="fg-dv">UV ~{uvIndex}</span><span class="fg-dl">Index</span></div>
          <div class="fg-dc"><span class="fg-dv">{solarElevDeg}°</span><span class="fg-dl">Sun angle</span></div>
        </div>
        <div class="fg-ds">
          <div class="fg-dr"><span class="fg-drl">Sunrise</span><span class="fg-drv">{sunriseTime}</span></div>
          <div class="fg-dr"><span class="fg-drl">Solar noon</span><span class="fg-drv">{solarNoonTime}</span></div>
          <div class="fg-dr"><span class="fg-drl">Sunset</span><span class="fg-drv">{sunsetTime}</span></div>
          <div class="fg-dr"><span class="fg-drl">WBGT solar contribution</span><span class="fg-drv">+{wbgtSolarContrib}°C</span></div>
        </div>
      {/if}
    {/if}
    <button class="fg-mdet-close" on:click={() => mActive = null}>✕ Close</button>
  </div>
{/if}

<!-- ══ DESKTOP PANEL (plugin__content — box mode, top-left, no bg) ══════════ -->
<section class="plugin__content fg-panel">

  <!-- Header -->
  <div class="fg-ph">
    <img class="fg-ph-logo" src="./assets/logo-white.png"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="FieldGuard"/>
    <div class="fg-ph-shield" style="display:none">🛡️</div>
    <div class="fg-ph-txt">
      <span class="fg-ph-title">FieldGuard</span>
      <span class="fg-ph-sub">Real-time Heat & Weather Safety</span>
    </div>
    <button class="fg-ph-btn" on:click={refreshData} title="Refresh">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
    </button>
    <button class="fg-ph-btn" title="Location">◎</button>
  </div>

  <!-- Location bar -->
  <div class="fg-ploc">
    <span>📍</span>
    <span class="fg-ploc-name">{locationName||(lat.toFixed(3)+', '+lon.toFixed(3))}</span>
    <span class="fg-ploc-r">
      <span class="fg-ploc-time">{currentTime}</span>
      {#if isNight}<span class="fg-nbadge">🌙 Night</span>
      {:else}<span class="fg-dbadge">☀ Day</span>{/if}
    </span>
  </div>

  <!-- Tabs -->
  <div class="fg-ptabs">
    {#each TABS as t}
      <button class="fg-ptab {tab===t.id?'fg-ptab-on':''}" on:click={() => tab=t.id}>
        <span>{t.icon}</span><span>{t.label}</span>
      </button>
    {/each}
  </div>

  <!-- ── LIVE TAB ── -->
  {#if tab === 'dashboard'}
    {#if loading}
      <div class="fg-pload"><div class="fg-spin"></div><span>Reading {worstCaseMode?'all models':selectedModel}…</span></div>
    {:else if error}
      <div class="fg-perr">{error}</div>
    {:else if heat}

      {#if heat.isBanPeriod}
        <div class="fg-ban">🚫 LEGAL WORK BAN · 12:30–15:30</div>
      {/if}

      <!-- 2×2 status grid -->
      <div class="fg-pgrid">
        <button class="fg-psb {dActive==='heat'?'fg-psb-on':''}" style="--c:{heat.zoneInfo.color}" on:click={() => dToggle('heat')}>
          <span class="fg-psb-ic">🌡</span>
          <span class="fg-psb-zo" style="color:{heat.zoneInfo.color}">{heat.zoneInfo.riskLabel}</span>
          <span class="fg-psb-vl">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°C'}</span>
          <span class="fg-psb-lb">Apparent Temp</span>
          <span class="fg-psb-ch">{dActive==='heat'?'▲':'▼'}</span>
        </button>
        <button class="fg-psb {dActive==='wind'?'fg-psb-on':''}" style="--c:{windResult?.riskColor}" on:click={() => dToggle('wind')}>
          <span class="fg-psb-ic">💨</span>
          <span class="fg-psb-zo" style="color:{windResult?.riskColor}">{windResult?.riskLabel}</span>
          <span class="fg-psb-vl">{rawData?.windMs.toFixed(1)} m/s</span>
          <span class="fg-psb-lb">Bft {windResult?.beaufort}</span>
          <span class="fg-psb-ch">{dActive==='wind'?'▲':'▼'}</span>
        </button>
        <button class="fg-psb {dActive==='rain'?'fg-psb-on':''}" style="--c:{rainResult?.riskColor}" on:click={() => dToggle('rain')}>
          <span class="fg-psb-ic">🌧</span>
          <span class="fg-psb-zo" style="color:{rainResult?.riskColor}">{rainResult?.riskLabel}</span>
          <span class="fg-psb-vl">{rawData?.rainMmH.toFixed(1)} mm/h</span>
          <span class="fg-psb-lb">{rainResult?.intensityLabel}</span>
          <span class="fg-psb-ch">{dActive==='rain'?'▲':'▼'}</span>
        </button>
        <button class="fg-psb {dActive==='solar'?'fg-psb-on':''}" style="--c:{solarColor}" on:click={() => dToggle('solar')}>
          <span class="fg-psb-ic">{isNight?'🌙':'☀'}</span>
          <span class="fg-psb-zo" style="color:{solarColor}">{solarLabel}</span>
          <span class="fg-psb-vl">{isNight?'0':rawData?.solarWm2} W/m²</span>
          <span class="fg-psb-lb">{isNight?'Night':'UV ~'+uvIndex}</span>
          <span class="fg-psb-ch">{dActive==='solar'?'▲':'▼'}</span>
        </button>
      </div>

      <!-- Detail panel (inline under grid) -->
      {#if dActive === 'heat'}
        <div class="fg-pdet" style="border-color:{heat.zoneInfo.color}">
          <div class="fg-det-title" style="color:{heat.zoneInfo.color}">🌡 Heat Stress — {heat.zoneInfo.riskLabel}</div>
          <div class="fg-det-grid">
            <div class="fg-dc"><span class="fg-dv">{rawData?.tempC}°C</span><span class="fg-dl">Temp</span></div>
            <div class="fg-dc"><span class="fg-dv">{rawData?.humidity}%</span><span class="fg-dl">Humidity</span></div>
            <div class="fg-dc"><span class="fg-dv">{heat.apparentTemp1}°C</span><span class="fg-dl">App.T A</span></div>
            <div class="fg-dc"><span class="fg-dv" style="color:{heat.zoneInfo.color}">{heat.apparentTempFinal===999?'NW':heat.apparentTempFinal+'°C'}</span><span class="fg-dl">App.T B</span></div>
            <div class="fg-dc"><span class="fg-dv">{heat.wbgtBase}°C</span><span class="fg-dl">WBGT</span></div>
            <div class="fg-dc"><span class="fg-dv">{heat.wbgtAdjusted}°C</span><span class="fg-dl">WBGT+PPE</span></div>
          </div>
          <div class="fg-ds">
            <div class="fg-dr"><span class="fg-drl">🕐 Light work</span><span class="fg-drv">{heat.workRestSchedule.light}</span></div>
            <div class="fg-dr"><span class="fg-drl">💪 Heavy work</span><span class="fg-drv">{heat.workRestSchedule.heavy}</span></div>
            <div class="fg-dr"><span class="fg-drl">💧 Hydration</span><span class="fg-drv">{heat.hydration}</span></div>
            <div class="fg-dr"><span class="fg-drl">👁 Monitoring</span><span class="fg-drv fg-drv-sm">{heat.zoneInfo.monitoringSchedule}</span></div>
          </div>
          <div class="fg-dct">⚠ Mandatory Controls</div>
          {#each heat.zoneInfo.mandatoryControls as c}<div class="fg-dci">▸ {c}</div>{/each}
          <div class="fg-dppe">PPE: {PPE_PROFILES[settings.ppeProfile].label} (+{PPE_PROFILES[settings.ppeProfile].adjustment}°C)</div>
        </div>
      {:else if dActive === 'wind'}
        <div class="fg-pdet" style="border-color:{windResult?.riskColor}">
          <div class="fg-det-title" style="color:{windResult?.riskColor}">💨 Wind — {windResult?.riskLabel}</div>
          <div class="fg-det-grid">
            <div class="fg-dc"><span class="fg-dv">{rawData?.windMs.toFixed(1)}</span><span class="fg-dl">m/s</span></div>
            <div class="fg-dc"><span class="fg-dv">{((rawData?.windMs??0)*3.6).toFixed(1)}</span><span class="fg-dl">km/h</span></div>
            <div class="fg-dc"><span class="fg-dv">Bft {windResult?.beaufort}</span><span class="fg-dl">{windResult?.beaufortDesc}</span></div>
          </div>
          <div class="fg-dthr">Warn ≥ {settings.windWarnMs} m/s · Danger ≥ {settings.windDangerMs} m/s</div>
        </div>
      {:else if dActive === 'rain'}
        <div class="fg-pdet" style="border-color:{rainResult?.riskColor}">
          <div class="fg-det-title" style="color:{rainResult?.riskColor}">🌧 Rain — {rainResult?.riskLabel}</div>
          <div class="fg-det-grid">
            <div class="fg-dc"><span class="fg-dv">{rawData?.rainMmH.toFixed(1)}</span><span class="fg-dl">mm/h</span></div>
            <div class="fg-dc"><span class="fg-dv">{rainResult?.intensityLabel}</span><span class="fg-dl">Intensity</span></div>
          </div>
          <div class="fg-dthr">Warn ≥ {settings.rainWarnMmh} mm/h · Danger ≥ {settings.rainDangerMmh} mm/h</div>
        </div>
      {:else if dActive === 'solar'}
        <div class="fg-pdet" style="border-color:{solarColor}">
          <div class="fg-det-title" style="color:{solarColor}">{isNight?'🌙 Night — No Solar':'☀ Solar — '+solarLabel}</div>
          {#if isNight}
            <div class="fg-night-msg">
              <div style="font-size:22px;margin-bottom:4px">🌙</div>
              <div>Solar radiation is <strong>zero</strong> at night.</div>
              <div style="color:#4a6090;font-size:9px;margin-top:3px">Sunrise: ~{sunriseTime} · Sunset: ~{sunsetTime}</div>
            </div>
          {:else}
            <div class="fg-det-grid">
              <div class="fg-dc"><span class="fg-dv">{rawData?.solarWm2}</span><span class="fg-dl">W/m²</span></div>
              <div class="fg-dc"><span class="fg-dv">UV ~{uvIndex}</span><span class="fg-dl">Index</span></div>
              <div class="fg-dc"><span class="fg-dv">{solarElevDeg}°</span><span class="fg-dl">Sun angle</span></div>
            </div>
            <div class="fg-ds">
              <div class="fg-dr"><span class="fg-drl">Sunrise</span><span class="fg-drv">{sunriseTime}</span></div>
              <div class="fg-dr"><span class="fg-drl">Solar noon</span><span class="fg-drv">{solarNoonTime}</span></div>
              <div class="fg-dr"><span class="fg-drl">Sunset</span><span class="fg-drv">{sunsetTime}</span></div>
              <div class="fg-dr"><span class="fg-drl">WBGT solar +</span><span class="fg-drv">+{wbgtSolarContrib}°C</span></div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Model row -->
      <div class="fg-pmr">
        <select class="fg-pmr-sel" bind:value={selectedModel} on:change={refreshData}>
          {#each MODELS as m}<option value={m.key}>{m.label}</option>{/each}
        </select>
        <label class="fg-pmr-wc {!license.valid?'fg-disabled':''}">
          <input type="checkbox" bind:checked={worstCaseMode} on:change={refreshData} disabled={!license.valid}/>
          Worst-case ⚡
          {#if !license.valid}<span class="fg-proch">PRO</span>{/if}
        </label>
      </div>

      <!-- Model comparison table (pro) -->
      {#if worstCaseMode && modelResults.length > 1}
        <div class="fg-ptbl">
          <table class="fg-tbl">
            <thead><tr><th>Model</th><th>Zone</th><th>App.T</th><th>Wind</th></tr></thead>
            <tbody>
              {#each modelResults as mr}
                <tr class="{mr.isWorst?'fg-tbl-best':''}">
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

  <!-- ── SOS TAB ── -->
  {:else if tab === 'sos'}
    {#if !license.valid}
      <div class="fg-gate"><div class="fg-gate-ic">🚨</div><div class="fg-gate-ti">SOS — Pro Feature</div><a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a></div>
    {:else}
      <div class="fg-psec">🚨 Emergency Response</div>
      <div class="fg-pemg">
        <div class="fg-pemg-warn">⚠ Heat Stress Is Life-Threatening</div>
        <div class="fg-pemg-sub">The body starts shutting down and cannot recover without help.</div>
        <div class="fg-pemg-hd">🔴 Symptoms (monitor every 2 hours)</div>
        <div class="fg-pemg-syms">
          {#each HEAT_STRESS_SYMPTOMS as s}<span class="fg-sym">{s}</span>{/each}
        </div>
        <div class="fg-pemg-hd">🚑 Response Steps</div>
        {#each EMERGENCY_RESPONSE as step, i}
          <div class="fg-pemg-step {step.includes('SEVERE')?'fg-pemg-crit':''}">
            <span class="fg-pemg-n">{i+1}</span> {step}
          </div>
        {/each}
      </div>
      <div class="fg-psec" style="margin-top:6px">📋 Alert Log</div>
      {#if alertLog.length===0}
        <div class="fg-empty">No alerts this session.</div>
      {:else}
        {#each [...alertLog].reverse().slice(0,15) as a}
          <div class="fg-alog" style="border-left-color:{a.color}">
            <div class="fg-alog-t">{a.type}</div>
            <div class="fg-alog-m">{a.message}</div>
            <div class="fg-alog-tm">{a.time}</div>
          </div>
        {/each}
      {/if}
    {/if}

  <!-- ── REPORT TAB ── -->
  {:else if tab === 'report'}
    {#if !license.valid}
      <div class="fg-gate"><div class="fg-gate-ic">📄</div><div class="fg-gate-ti">Reports — Pro Feature</div><div class="fg-gate-desc">ISO 7933 weekly audit reports with FIDIC 8.4 evidence</div><a class="fg-gate-btn" href="https://fieldguard-hse.com" target="_blank">Upgrade at fieldguard-hse.com</a></div>
    {:else}
      <div class="fg-psec">📄 ISO 7933 Weekly Report</div>
      <div class="fg-prform">
        <label>Project Name<input bind:value={reportMeta.projectName} placeholder="Site/Project"/></label>
        <label>Contract No.<input bind:value={reportMeta.contractNumber} placeholder="CONTRACT-001"/></label>
        <label>Country<input bind:value={reportMeta.country} placeholder="Oman, UAE…"/></label>
        <label>Client<input bind:value={reportMeta.clientName}/></label>
        <label>Contractor<input bind:value={reportMeta.contractorName}/></label>
        <label>HSE Manager<input bind:value={reportMeta.hseManagerName}/></label>
        <label>Regulatory Ref<input bind:value={reportMeta.regulatoryRef}/></label>
        <label>Ban Start<input bind:value={reportMeta.banStart} placeholder="12:30"/></label>
        <label>Ban End<input bind:value={reportMeta.banEnd} placeholder="15:30"/></label>
        <label>FIDIC<select bind:value={reportMeta.fidic}><option>ELIGIBLE</option><option>NOT ELIGIBLE</option><option>UNDER REVIEW</option></select></label>
      </div>
      <button class="fg-pbtn" on:click={generateReport}>📋 Generate ISO 7933 Report</button>
      {#if reportText}
        <div class="fg-prep">
          <div class="fg-prep-bar">
            <span>Report ready</span>
            <button class="fg-prep-btn" on:click={copyReport}>📋 Copy</button>
            <button class="fg-prep-btn" on:click={downloadReport}>⬇ .txt</button>
          </div>
          <pre class="fg-prep-txt">{reportText}</pre>
        </div>
      {/if}
    {/if}

  <!-- ── CONFIG TAB ── -->
  {:else if tab === 'settings'}
    <!-- License -->
    <div class="fg-pgrp fg-lic-grp">
      <div class="fg-pgrp-hd">🔑 License</div>
      {#if license.valid}
        <div class="fg-lic-act">
          <span class="fg-lic-badge">✓ PRO</span>
          <span class="fg-lic-info">{license.tier?.toUpperCase()} · expires {license.expires?.slice(0,10)}</span>
          <button class="fg-lic-deact" on:click={deactivateLicense}>Deactivate</button>
        </div>
      {:else}
        <div class="fg-lic-free">
          <div class="fg-lic-free-tag">FREE TIER</div>
          <div class="fg-lic-free-list">⚡ Multi-model worst-case engine<br/>📄 ISO 7933 weekly reports<br/>🚨 SOS emergency tab<br/>🎛 Custom thresholds · 🔄 Auto-refresh</div>
          <a class="fg-pbtn fg-pbtn-amber" href="https://fieldguard-hse.com" target="_blank">Get Pro — fieldguard-hse.com</a>
        </div>
        <div class="fg-lic-row">
          <input class="fg-lic-input" bind:value={licenseKeyInput} placeholder="Paste license key…" disabled={licenseLoading}/>
          <button class="fg-lic-act-btn" on:click={activateLicense} disabled={licenseLoading||!licenseKeyInput.trim()}>{licenseLoading?'…':'Activate'}</button>
        </div>
        {#if licenseError}<div class="fg-lic-err">⚠ {licenseError}</div>{/if}
      {/if}
    </div>
    <!-- PPE -->
    <div class="fg-pgrp">
      <div class="fg-pgrp-hd">👷 PPE Profile (ISO 7933)</div>
      {#each Object.entries(PPE_PROFILES) as [key, prof]}
        <label class="fg-radio"><input type="radio" bind:group={settings.ppeProfile} value={key} on:change={saveSettings}/><span>{prof.label}</span><span class="fg-adjch">+{prof.adjustment}°C</span></label>
      {/each}
    </div>
    <!-- Thresholds (pro) -->
    {#if license.valid}
    <div class="fg-pgrp">
      <div class="fg-pgrp-hd">🌡 WBGT Thresholds</div>
      <label class="fg-slbl">Warning (°C)<div class="fg-srow"><input type="range" min="28" max="38" step="0.5" bind:value={settings.wbgtWarnC} on:change={saveSettings}/><span>{settings.wbgtWarnC}°C</span></div></label>
      <label class="fg-slbl">Danger (°C)<div class="fg-srow"><input type="range" min="30" max="42" step="0.5" bind:value={settings.wbgtDangerC} on:change={saveSettings}/><span>{settings.wbgtDangerC}°C</span></div></label>
      <div class="fg-pgrp-hd" style="margin-top:8px">💨 Wind Thresholds</div>
      <label class="fg-slbl">Warning (m/s)<div class="fg-srow"><input type="range" min="5" max="25" step="0.5" bind:value={settings.windWarnMs} on:change={saveSettings}/><span>{settings.windWarnMs} m/s</span></div></label>
      <label class="fg-slbl">Danger (m/s)<div class="fg-srow"><input type="range" min="10" max="35" step="0.5" bind:value={settings.windDangerMs} on:change={saveSettings}/><span>{settings.windDangerMs} m/s</span></div></label>
      <div class="fg-pgrp-hd" style="margin-top:8px">🌧 Rain Thresholds</div>
      <label class="fg-slbl">Warning (mm/h)<div class="fg-srow"><input type="range" min="1" max="25" step="0.5" bind:value={settings.rainWarnMmh} on:change={saveSettings}/><span>{settings.rainWarnMmh} mm/h</span></div></label>
      <label class="fg-slbl">Danger (mm/h)<div class="fg-srow"><input type="range" min="5" max="60" step="1" bind:value={settings.rainDangerMmh} on:change={saveSettings}/><span>{settings.rainDangerMmh} mm/h</span></div></label>
      <button class="fg-pbtn fg-pbtn-sec" style="margin-top:6px" on:click={resetSettings}>↩ Reset Defaults</button>
    </div>
    {/if}
    <!-- Alerts -->
    <div class="fg-pgrp">
      <div class="fg-pgrp-hd">🔔 Alerts</div>
      <label class="fg-tog"><input type="checkbox" bind:checked={settings.soundAlerts} on:change={saveSettings}/>Browser notifications for danger zones</label>
      <label class="fg-tog {!license.valid?'fg-disabled':''}"><input type="checkbox" bind:checked={settings.autoRefresh} on:change={setupAutoRefresh} disabled={!license.valid}/>Auto-refresh every 15 min {#if !license.valid}<span class="fg-proch">PRO</span>{/if}</label>
    </div>
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
  let dActive: string | null = 'heat'; // used in desktop full panel
  let mActive: string | null = null; // used in bottom bar pill taps

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

  function dToggle(id: string) {
    dActive = dActive === id ? null : id;
  }

  function mToggle(id: string) {
    mActive = mActive === id ? null : id;
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
  /* ════════════════════════════════════════════════════════
     FieldGuard v3.0 — matches approved preview exactly
     Brand: Navy #0a1228 / #111e3a / #1a2d55
            Amber #e8962a  Slate #8a9cc8 / #4a6090
  ════════════════════════════════════════════════════════ */
  :root {
    --amb: #e8962a; --n1: #050a18; --n2: #0a1228;
    --n3: #111e3a; --n4: #1a2d55; --sl: #8a9cc8; --sl2: #4a6090;
  }

  /* ── MOBILE TOP STRIP ──────────────────────────────────── */
  .fg-mbar {
    background: rgba(5,10,24,0.88) !important;
    border-bottom: 2px solid var(--amb) !important;
    padding: 6px 8px !important;
    display: flex !important; gap: 5px !important; align-items: stretch !important;
    min-height: 0 !important; border-radius: 0 !important;
  }
  .fg-mp {
    flex: 1; min-width: 0; display: flex; flex-direction: column;
    align-items: center; gap: 2px; padding: 6px 3px;
    background: rgba(10,18,40,0.75); border: 1px solid var(--c,#2d4080);
    border-radius: 8px; cursor: pointer; transition: all 0.15s;
  }
  .fg-mp:active { transform: scale(0.94); }
  .fg-mp.fg-mp-on { border-width: 2px; background: rgba(18,32,68,0.95); }
  .fg-mp-ic  { font-size: 14px; line-height: 1; }
  .fg-mp-vl  { font-size: 13px; font-weight: 800; color: #fff; line-height: 1.1; display: flex; align-items: baseline; gap: 1px; }
  .fg-mp-u   { font-size: 7px; color: var(--sl); }
  .fg-mp-lb  { font-size: 7px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; }
  .fg-mrf {
    width: 26px; flex-shrink: 0; align-self: center;
    background: rgba(10,18,40,0.7); border: 1px solid rgba(45,64,128,0.5);
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--sl); padding: 5px; transition: all 0.15s;
  }
  .fg-mrf:hover { border-color: var(--amb); color: var(--amb); }
  .fg-mbar-load { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--sl); padding: 8px; }
  .fg-mbar-tap { font-size: 11px; color: var(--sl); background: transparent; border: 1px dashed rgba(45,64,128,0.5); border-radius: 7px; padding: 7px 14px; cursor: pointer; width: 100%; }

  /* Mobile detail dropdown */
  .fg-mdet {
    background: rgba(5,10,24,0.95);
    border-bottom: 1px solid rgba(232,150,42,0.3);
    padding: 10px 10px 14px;
    animation: slideDown 0.18s ease-out;
  }
  @keyframes slideDown { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: none; } }
  .fg-mdet-close {
    display: block; width: 100%; margin-top: 10px;
    background: rgba(15,29,66,0.6); border: 1px solid rgba(45,64,128,0.4);
    border-radius: 6px; color: var(--sl); padding: 6px; cursor: pointer; font-size: 11px;
  }

  /* ── DESKTOP PANEL (plugin__content) ──────────────────── */
  .fg-panel {
    background: transparent !important;
    padding: 0 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px; color: #e8edf8;
    overflow-y: auto;
  }

  /* Panel header */
  .fg-ph {
    display: flex; align-items: center; gap: 7px; padding: 6px 9px;
    background: rgba(5,10,24,0.82);
    border: 1px solid rgba(232,150,42,0.35); border-bottom: none;
    border-radius: 10px 10px 0 0;
  }
  .fg-ph-logo { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }
  .fg-ph-shield { width: 22px; height: 22px; background: #1e3a8a; border-radius: 4px; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
  .fg-ph-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .fg-ph-title { font-size: 12px; font-weight: 800; color: #fff; line-height: 1.1; }
  .fg-ph-sub   { font-size: 7px; color: var(--sl2); text-transform: uppercase; letter-spacing: 0.8px; }
  .fg-ph-btn {
    width: 22px; height: 22px; background: rgba(15,29,66,0.7);
    border: 1px solid rgba(45,64,128,0.5); border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--sl); transition: all 0.15s; flex-shrink: 0; padding: 0;
  }
  .fg-ph-btn:hover { border-color: var(--amb); color: var(--amb); }

  /* Loc bar */
  .fg-ploc {
    display: flex; align-items: center; gap: 4px; padding: 3px 9px;
    background: rgba(5,10,24,0.75);
    border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3);
    font-size: 9px; color: var(--sl);
  }
  .fg-ploc-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .fg-ploc-r { display: flex; align-items: center; gap: 3px; flex-shrink: 0; }
  .fg-ploc-time { color: var(--sl2); }
  .fg-dbadge { background: #78350f; color: #fcd34d; border-radius: 3px; padding: 1px 4px; font-size: 7px; font-weight: 700; }
  .fg-nbadge { background: #1e1b4b; color: #a5b4fc; border-radius: 3px; padding: 1px 4px; font-size: 7px; font-weight: 700; }

  /* Tabs */
  .fg-ptabs {
    display: flex;
    background: rgba(5,10,24,0.82);
    border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3);
  }
  .fg-ptab {
    flex: 1; padding: 5px 2px; background: transparent; border: none;
    color: var(--sl2); cursor: pointer; font-size: 8px;
    border-bottom: 2px solid transparent; transition: all 0.15s;
    display: flex; flex-direction: column; align-items: center; gap: 1px;
  }
  .fg-ptab span:first-child { font-size: 12px; }
  .fg-ptab.fg-ptab-on { color: var(--amb); border-bottom-color: var(--amb); }

  /* Status grid */
  .fg-pgrid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 6px 6px 3px;
    background: rgba(5,10,24,0.75);
    border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3);
  }
  .fg-psb {
    background: rgba(10,18,40,0.8); border: 1px solid var(--c,#2d4080);
    border-radius: 8px; padding: 10px 4px; cursor: pointer; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    transition: all 0.15s; width: 100%;
  }
  .fg-psb:hover { filter: brightness(1.15); }
  .fg-psb.fg-psb-on { border-width: 2px; background: rgba(18,32,68,0.95); }
  .fg-psb-ic { font-size: 17px; line-height: 1; }
  .fg-psb-zo { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .fg-psb-vl { font-size: 15px; font-weight: 800; color: #fff; line-height: 1.2; }
  .fg-psb-lb { font-size: 8px; color: var(--sl); }
  .fg-psb-ch { font-size: 7px; color: var(--sl2); }

  /* Detail panel */
  .fg-pdet {
    background: rgba(5,10,24,0.88); border: 1px solid; border-top: none;
    padding: 9px 7px 7px;
    border-left-color: rgba(232,150,42,0.3) !important;
    border-right-color: rgba(232,150,42,0.3) !important;
  }

  /* Shared detail internals */
  .fg-det-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 7px; }
  .fg-det-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 3px; margin-bottom: 6px; }
  .fg-dc { background: rgba(5,10,22,0.6); border-radius: 4px; padding: 5px 2px; text-align: center; }
  .fg-dv { font-size: 12px; font-weight: 800; color: #fff; display: block; }
  .fg-dl { font-size: 7px; color: var(--sl2); text-transform: uppercase; letter-spacing: 0.3px; }
  .fg-ds { background: rgba(5,10,22,0.4); border-radius: 4px; padding: 5px; margin-bottom: 4px; }
  .fg-dr { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid rgba(10,18,38,0.9); font-size: 8px; }
  .fg-dr:last-child { border: none; }
  .fg-drl { color: var(--sl2); } .fg-drv { color: var(--sl); font-weight: 500; } .fg-drv-sm { font-size: 7px; }
  .fg-dct { font-size: 8px; color: var(--amb); text-transform: uppercase; font-weight: 700; letter-spacing: 0.4px; margin: 5px 0 3px; }
  .fg-dci { font-size: 8px; color: var(--sl); padding: 2px 0; border-bottom: 1px solid rgba(10,18,38,0.7); }
  .fg-dci:last-child { border: none; }
  .fg-dppe { font-size: 8px; color: var(--sl2); margin-top: 5px; }
  .fg-dthr { font-size: 8px; color: var(--sl2); text-align: center; margin-top: 4px; }
  .fg-night-msg { background: rgba(30,27,75,0.5); border-radius: 6px; padding: 10px; text-align: center; font-size: 10px; color: #c7d2fe; display: flex; flex-direction: column; gap: 4px; }
  .fg-night-msg strong { color: #a5b4fc; }

  /* Model row */
  .fg-pmr {
    display: flex; align-items: center; gap: 5px; padding: 5px 6px 6px;
    background: rgba(5,10,24,0.82);
    border: 1px solid rgba(232,150,42,0.3); border-top: none;
    border-radius: 0 0 10px 10px;
  }
  .fg-pmr-sel { background: rgba(10,18,40,0.8); border: 1px solid rgba(45,64,128,0.5); color: #e8edf8; padding: 3px 5px; border-radius: 4px; font-size: 9px; }
  .fg-pmr-wc { display: flex; align-items: center; gap: 3px; margin-left: auto; font-size: 8px; color: var(--sl); cursor: pointer; }
  .fg-proch { background: var(--amb); color: #0f1d42; font-size: 7px; font-weight: 800; padding: 1px 3px; border-radius: 2px; }

  /* Model table */
  .fg-ptbl { padding: 0 6px 6px; background: rgba(5,10,24,0.75); border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); border-bottom: 1px solid rgba(232,150,42,0.3); border-radius: 0 0 10px 10px; }
  .fg-tbl { width: 100%; border-collapse: collapse; font-size: 9px; }
  .fg-tbl th { color: var(--sl2); text-align: left; padding: 3px 3px; border-bottom: 1px solid rgba(45,64,128,0.4); font-weight: 600; }
  .fg-tbl td { padding: 2px 3px; color: var(--sl); }
  .fg-tbl-best td { color: #fff; font-weight: 700; background: rgba(10,18,40,0.6); }

  /* Loading/error inside panel */
  .fg-pload { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px; color: var(--sl); font-size: 10px; background: rgba(5,10,24,0.75); border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); border-bottom: 1px solid rgba(232,150,42,0.3); border-radius: 0 0 10px 10px; }
  .fg-perr { padding: 10px 9px; background: rgba(61,10,10,0.85); color: #fca5a5; font-size: 10px; border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); border-bottom: 1px solid #7f1d1d; border-radius: 0 0 10px 10px; }
  .fg-ban { padding: 6px 9px; background: rgba(124,45,18,0.85); color: #fed7aa; font-size: 10px; font-weight: 700; text-align: center; border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); border-bottom: 1px solid var(--amb); }

  /* Spinner */
  .fg-spin { width: 16px; height: 16px; border: 2px solid rgba(45,64,128,0.5); border-top-color: var(--amb); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Sections inside tabs */
  .fg-psec { padding: 7px 9px 3px; font-size: 9px; color: var(--amb); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; background: rgba(5,10,24,0.75); border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); }
  .fg-empty { padding: 14px; text-align: center; color: var(--sl2); font-size: 10px; background: rgba(5,10,24,0.75); border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); border-bottom: 1px solid rgba(232,150,42,0.3); border-radius: 0 0 10px 10px; }

  /* SOS */
  .fg-pemg { background: rgba(5,10,24,0.75); border: 1px solid rgba(220,38,38,0.5); border-top: none; border-radius: 0 0 10px 10px; padding: 10px 9px; }
  .fg-pemg-warn { font-size: 11px; font-weight: 700; color: #f87171; margin-bottom: 4px; }
  .fg-pemg-sub  { font-size: 9px; color: var(--sl); margin-bottom: 8px; }
  .fg-pemg-hd   { font-size: 8px; color: var(--sl2); text-transform: uppercase; font-weight: 700; margin-bottom: 5px; }
  .fg-pemg-syms { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 8px; }
  .fg-sym       { background: rgba(61,10,10,0.8); color: #fca5a5; border-radius: 3px; padding: 2px 5px; font-size: 8px; }
  .fg-pemg-step { display: flex; gap: 6px; align-items: flex-start; padding: 3px 0; font-size: 9px; color: var(--sl); border-bottom: 1px solid rgba(10,18,38,0.8); }
  .fg-pemg-step:last-child { border: none; }
  .fg-pemg-n    { background: rgba(45,64,128,0.6); color: #e8edf8; border-radius: 3px; padding: 1px 4px; font-size: 8px; font-weight: 700; flex-shrink: 0; }
  .fg-pemg-crit { color: #f87171 !important; font-weight: 700; }
  .fg-pemg-crit .fg-pemg-n { background: #dc2626; }

  /* Alert log */
  .fg-alog { margin: 3px 9px; padding: 6px 8px; background: rgba(10,18,40,0.7); border-radius: 5px; border-left: 3px solid; }
  .fg-alog-t  { font-size: 10px; font-weight: 700; color: #fff; }
  .fg-alog-m  { font-size: 9px; color: var(--sl); }
  .fg-alog-tm { font-size: 8px; color: var(--sl2); }

  /* Report form */
  .fg-prform { padding: 6px 9px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: rgba(5,10,24,0.75); border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); }
  label { display: block; color: var(--sl); font-size: 9px; }
  label input, label select { display: block; width: 100%; background: rgba(5,10,22,0.9); border: 1px solid rgba(45,64,128,0.5); color: #e8edf8; padding: 4px 6px; border-radius: 4px; font-size: 9px; margin-top: 2px; box-sizing: border-box; }
  label input:focus, label select:focus { outline: none; border-color: var(--amb); }
  .fg-pbtn { display: block; width: calc(100% - 0px); margin: 0; padding: 8px; border: none; border-radius: 0; font-size: 11px; font-weight: 800; cursor: pointer; background: var(--amb); color: #0f1d42; border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); }
  .fg-pbtn-sec { background: rgba(10,18,40,0.8); color: var(--sl); border: 1px solid rgba(45,64,128,0.4); border-radius: 5px; width: calc(100%); }
  .fg-pbtn-amber { display: block; text-align: center; text-decoration: none; background: var(--amb); color: #0f1d42 !important; padding: 7px; border-radius: 5px; font-size: 10px; font-weight: 800; margin-top: 5px; }
  .fg-prep { background: rgba(5,10,22,0.9); border: 1px solid rgba(45,64,128,0.4); border-radius: 0 0 10px 10px; overflow: hidden; }
  .fg-prep-bar { display: flex; align-items: center; gap: 6px; padding: 5px 8px; background: rgba(10,18,40,0.9); border-bottom: 1px solid rgba(45,64,128,0.3); font-size: 9px; color: var(--sl2); }
  .fg-prep-bar span { flex: 1; }
  .fg-prep-btn { background: rgba(45,64,128,0.5); border: none; color: var(--sl); padding: 2px 7px; border-radius: 3px; cursor: pointer; font-size: 9px; }
  .fg-prep-txt { padding: 8px; font-size: 8px; color: var(--sl); white-space: pre; overflow: auto; max-height: 220px; font-family: 'Courier New', monospace; line-height: 1.4; }

  /* Settings groups */
  .fg-pgrp { background: rgba(5,10,24,0.75); border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); border-bottom: 1px solid rgba(45,64,128,0.2); padding: 8px 9px; }
  .fg-pgrp:last-child { border-bottom: 1px solid rgba(232,150,42,0.3); border-radius: 0 0 10px 10px; }
  .fg-lic-grp { border-top: none; }
  .fg-pgrp-hd { font-size: 9px; font-weight: 700; color: var(--amb); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
  .fg-lic-act { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
  .fg-lic-badge { background: rgba(5,46,22,0.8); color: #4ade80; border: 1px solid #16a34a; border-radius: 4px; padding: 2px 7px; font-size: 10px; font-weight: 700; }
  .fg-lic-info  { font-size: 10px; color: #86efac; flex: 1; }
  .fg-lic-deact { background: rgba(10,18,40,0.8); border: 1px solid rgba(45,64,128,0.5); color: var(--sl); padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; }
  .fg-lic-free  { background: rgba(5,10,22,0.6); border-radius: 5px; padding: 8px; margin-bottom: 7px; border: 1px solid rgba(45,64,128,0.3); }
  .fg-lic-free-tag  { font-size: 8px; font-weight: 700; color: var(--sl2); text-transform: uppercase; margin-bottom: 5px; }
  .fg-lic-free-list { font-size: 9px; color: var(--sl2); line-height: 1.7; margin-bottom: 5px; }
  .fg-lic-row   { display: flex; gap: 4px; }
  .fg-lic-input { flex: 1; background: rgba(5,10,22,0.9); border: 1px solid rgba(45,64,128,0.5); color: #e8edf8; padding: 4px 6px; border-radius: 4px; font-size: 9px; font-family: monospace; }
  .fg-lic-input:disabled { opacity: 0.5; }
  .fg-lic-act-btn { background: var(--amb); border: none; color: #0f1d42; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: 800; white-space: nowrap; }
  .fg-lic-act-btn:disabled { background: rgba(45,64,128,0.4); color: var(--sl2); cursor: not-allowed; }
  .fg-lic-err { margin-top: 5px; font-size: 9px; color: #f87171; padding: 4px 6px; background: rgba(61,10,10,0.8); border-radius: 4px; }
  .fg-radio { display: flex; align-items: center; gap: 6px; padding: 4px 0; cursor: pointer; border-bottom: 1px solid rgba(5,10,22,0.8); font-size: 9px; color: #c8d4f0; }
  .fg-radio:last-child { border-bottom: none; }
  .fg-radio span { flex: 1; }
  .fg-adjch { background: rgba(5,10,22,0.8); color: var(--sl); border-radius: 2px; padding: 1px 4px; font-size: 8px; }
  .fg-slbl { display: block; color: var(--sl); font-size: 9px; margin-bottom: 4px; }
  .fg-srow { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .fg-srow input[type="range"] { flex: 1; accent-color: var(--amb); }
  .fg-srow span { min-width: 48px; text-align: right; color: var(--amb); font-size: 9px; font-weight: 700; }
  .fg-tog { display: flex; align-items: center; gap: 6px; padding: 4px 0; cursor: pointer; font-size: 9px; color: #c8d4f0; border-bottom: 1px solid rgba(5,10,22,0.8); }
  .fg-tog:last-child { border-bottom: none; }
  input[type="checkbox"] { accent-color: var(--amb); }

  /* Gate */
  .fg-gate { padding: 16px 12px; background: rgba(5,10,24,0.75); border-left: 1px solid rgba(232,150,42,0.3); border-right: 1px solid rgba(232,150,42,0.3); border-bottom: 1px solid rgba(232,150,42,0.3); border-radius: 0 0 10px 10px; text-align: center; }
  .fg-gate-ic { font-size: 28px; margin-bottom: 6px; }
  .fg-gate-ti { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .fg-gate-desc { font-size: 10px; color: var(--sl2); margin-bottom: 10px; }
  .fg-gate-btn { display: block; background: var(--amb); color: #0f1d42 !important; text-decoration: none; padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; }
  .fg-disabled { opacity: 0.4; pointer-events: none; }

  /* ── SHOW/HIDE BY PLATFORM ─────────────────────────────────
     Windy sets id="device-mobile" on <html> for mobile/tablet.
     Source: docs.windy-plugins.com/styles/section-media.html
     
     Built-in Windy classes (add directly to HTML elements):
       .mobilehide       — hidden on mobile
       .desktophide      — hidden on desktop
       .mobiletablethide — hidden on mobile + tablet
  ─────────────────────────────────────────────────────────── */

  /* Mobile strip: hidden on desktop by default */
  .plugin__mobile-header {
    display: none !important;
  }
  /* Show on mobile/tablet via Windy's #device-mobile on <html> */
  #device-mobile .plugin__mobile-header {
    display: flex !important;
  }

  /* Desktop panel: hidden on mobile */
  #device-mobile .plugin__content {
    display: none !important;
  }

  /* Mobile detail dropdown: hidden on desktop */
  .fg-mdet {
    display: none;
  }
  #device-mobile .fg-mdet {
    display: block;
  }
</style>