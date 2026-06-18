# 🛡️ FieldGuard — HSE Field Safety Monitor for Windy.com

**"All models. Worst case. Zero compromise."**

FieldGuard is a professional Windy.com plugin for HSE (Health, Safety & Environment) managers and field professionals. It provides real-time thermal stress monitoring, customizable wind/rain alerts, and generates ISO 7933-compliant weekly audit reports.

---

## Features

### 🌡️ Heat Stress Engine
- **WBGT (Wet-Bulb Globe Temperature)** — Liljegren (2008) method
- **PPE Thermal Adjustment** per ISO 7933:2004 (up to +10°C for encapsulating suits)
- **Heat Index** via NOAA/Rothfusz formula
- **ACGIH TLV® action levels**: Safe / Caution / Warning / Danger / Extreme

### 💨 Wind & 🌧️ Rain Alerts
- Beaufort scale classification
- Fully customizable warning and danger thresholds
- Per-user threshold storage

### 📊 Multi-Model Worst-Case Engine
Queries **all available Windy models simultaneously**:
- ECMWF, GFS, ICON, MEPS, GEM, ACCESS-G
- Presents the **worst-case scenario** across all models
- Model comparison table shows each model's output

### 📋 ISO 7933 Weekly Report Generator
Generates a full audit report compatible with:
- **ISO 7933:2004** — Ergonomics of the Thermal Environment (PHS Model)
- **ISO 7243:2017** — WBGT Heat Stress Standard
- **ACGIH TLV®** thresholds
- **FIDIC Clause 8.4** — Extension of Time claim evidence

Report sections include:
- Project & Site Identification (Section A)
- Executive Summary (Section B)
- Meteorological Data Table (Section C)
- PPE-Adjusted WBGT Exceedance Log (Section D)
- Morning Gap Analysis (Section E)
- Work Suspension Log (Section F)
- FIDIC Clause 8.4 Claim Evidence (Section G)
- Regulatory Compliance Checklist (Section H)
- AI Risk Assessment Narrative (Section I)
- Signature & Certification Block (Section J)

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/windy-plugin-fieldguard.git
cd windy-plugin-fieldguard
npm install
npm start
```

Then open `https://www.windy.com/?plugin=windy-plugin-fieldguard` in your browser.

Load it in development at `https://localhost:9999/plugin.js`.

---

## Usage

1. **Open FieldGuard** from the Windy.com plugins menu or right-click any location on the map
2. **Click any location** on the Windy map to set the monitoring point
3. **Enable Worst-Case Mode** to query all available forecast models
4. **Configure thresholds** in the Settings tab for your specific work type and PPE
5. **Generate weekly reports** in the Report tab — fill in project metadata and download

---

## PPE Profiles (ISO 7933)

| Profile | Thermal Adjustment |
|---|---|
| Light clothing (summer work wear) | +0°C |
| Coverall (cotton) | +1°C |
| FR (flame-resistant) suit | +2°C |
| FR impermeable suit | +4°C |
| Fully encapsulating chemical suit | +10°C |

---

## WBGT Action Levels (ACGIH TLV® — Moderate Work)

| Adjusted WBGT | Risk Level | Required Action |
|---|---|---|
| < 28°C | ✅ SAFE | Normal work, stay hydrated |
| 28–30°C | ⚡ CAUTION | Increased hydration mandatory |
| 30–32°C | ⚠️ WARNING | 15-min rest/hour mandatory |
| 32–35°C | 🛑 DANGER | Stop heavy outdoor work |
| > 35°C | 🚨 EXTREME | All outdoor work halted |

---

## Technical Details

- **WBGT Method**: Liljegren (2008) simplified outdoor model
- **Heat Index**: Rothfusz / NWS polynomial regression
- **Wind**: Beaufort scale + configurable thresholds
- **Data Source**: Windy.com interpolator API (primary) + Open-Meteo fallback
- **Report Format**: ISO 7933 / FIDIC-compatible plain-text audit document

---

## Legal Notice

FieldGuard is a decision-support tool for qualified HSE professionals. Reports must be reviewed by a certified HSE Manager before use as contractual or legal evidence. See full disclaimer in generated reports.

---

## License

MIT License — FieldGuard HSE Plugin
