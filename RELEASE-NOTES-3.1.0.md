# FieldGuard Plugin — Release Notes

## 3.1.0 (planned / unreleased)

- ✅ **Unit-aware email alerts (DONE — 13 Aug).** David's Imperial toggle only changed the
  on-screen panel; the 24/7 email alerts (`alerts@fieldguard-hse.com`) still sent metric.
  Now the plugin sends the site's `units` in the `/monitor` registration payload, the worker
  stores it in `monitors.cfg`, and the alert composer renders **temp/WBGT/WBGT+PPE in °F and
  wind in mph** when Imperial (metric default). Solar (W/m²) and lightning (miles) unchanged.
  - Files: `windy-plugin-fieldguard/src/plugin.svelte` (registration cfg sends `units`);
    `fieldguard-monitor/src/index.ts` (`evaluateHazards` uses `fmtTemp`/`fmtWind`/`fmtRain`;
    `/monitor` POST persists `units`). Conversion helpers already existed in `hse-calculations.ts`.
  - **Ships as:** worker `wrangler deploy` (fieldguard-monitor) + plugin republish. Backward-
    compatible — existing monitors with no `units` default to metric. Users on Imperial must
    **re-register** their site (click Monitor) so the units flag is stored.

- ✅ **Lightning rings — metric (km) display (DONE — 13 Aug).** The ring value spans now show
  **km for metric sites** and **mi for imperial**, via a `ringLbl(mi, units)` helper (takes
  `units` as an arg so Svelte re-renders on toggle). **Miles stays the canonical stored/sent
  value** — the monitor `cfg.rings`, `/api/lightning` math, and Technip's 6/8/10/20 mi spec are
  untouched; km is display only. `src/plugin.svelte` ring section + summary note.

- ✅ **Reinstate the site pin + tighter zoom (DONE — 13 Aug).** `panMap()` now `map.setView`s to
  the site at a zoom of **≥11 (zoom-in only, never out)** and **re-opens Windy's own picker** at
  the point via `broadcast.emit('rqstOpen', 'picker', {lat,lon})`.
  - ✅ **MAP-SAFE.** Uses Windy's **native picker** + viewport navigation only — **no** custom
    Leaflet layer/marker/overlay, no `store.set`, no click-handler changes. Falls back to `panTo`
    and is fully wrapped in try/catch (no-op if the picker target differs on a given Windy build).
  - ⚠️ **Confirm on the live map during tomorrow's test** that `'picker'` is the correct
    `rqstOpen` target on the current Windy build (it's the conventional name; harmless if not).

- ✅ **Higher-precision pin (DONE — 13 Aug).** The pin coordinates sent/stored were already
  full-precision (`map.getCenter()`); the only rounding was cosmetic. The "Registers the current
  pin" note now shows **5 decimals** (~1 m) instead of 3 (~110 m). Weather-cache keys stay coarse
  by design.

### ⛔ Rejected — do NOT build: live lightning rings drawn on the Windy map
A Dispatch session (13 Aug) proposed drawing live concentric proximity rings (≤8/≤10/≤20 mi)
around the pin **on the map** so users can watch strikes close in. **This violates map-safety
rule #1 and must not be implemented.** On-map rings were built once before, recognised as
re-breaking the rule, and reverted; altering Windy's map is what nearly got FieldGuard delisted.
Lightning rings stay as **config sliders + the in-panel strike card + email alerts** — never
Leaflet layers/overlays on Windy's map. If richer real-time visibility is wanted, build it
**inside the FieldGuard panel**, not on the map.

## 3.0.9 (LIVE on Windy as of ~13 Aug 2026)

> Now serving on the Windy plugin directory (the 11 Aug "Publish Plugin" GitHub run did not
> propagate immediately — it appeared ~13 Aug). Customers notified the same day.

- Per-hazard UI, worst-monitored status, cold-first display, unit + map fixes
  (commit `8ad3654`). Adds the real-time lightning stop-work ring configuration UI.
