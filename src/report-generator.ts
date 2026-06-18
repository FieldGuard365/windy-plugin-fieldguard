/**
 * FieldGuard Weekly Report Generator
 * Heat-stress zone method: 2-step Apparent Temperature (Temp×RH, then ×Wind)
 * Standards: ISO 7933:2004 / ISO 7243:2017 / ACGIH TLV / FIDIC Clause 8.4
 */

export interface WeeklyLogEntry {
    date: string; time: string; durationH: number;
    wbgtBase: number; wbgtAdj: number; ppe: string;
    zone: string; action: string;
}
export interface MorningGapEntry {
    date: string; threshold: number; time: string;
    minsBeforeBan: number; peakAdj: number;
}
export interface SuspensionEntry {
    date: string; startTime: string; endTime: string;
    hours: number; trigger: string; trades: string; workers: number;
}
export interface DailyMet {
    day: string; maxTemp: number; minTemp: number;
    maxRH: number; maxWind: number; peakSolar: number;
}
export interface WeeklyReportData {
    projectName: string; contractNumber: string; siteAddress: string;
    lat: number; lon: number; country: string;
    clientName: string; contractorName: string; hseManagerName: string;
    regulatoryRef: string;
    weekStart: string; weekEnd: string;
    ppeProfile: string; ppeAdjustment: number;
    dailyMet: DailyMet[];
    wbgtLog: WeeklyLogEntry[];
    morningGap: MorningGapEntry[];
    suspensions: SuspensionEntry[];
    banStart: string; banEnd: string; banMonths: string;
    totalSuspensionHours: number; cumulativeSuspensionHours: number;
    fidic: string; delayDays: number;
    forecastNarrative: string;
}

function pad(s: string | number, n = 8): string { return String(s).padEnd(n); }
function getWeekNumber(d: Date): number {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const ys = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - ys.getTime()) / 86400000) + 1) / 7);
}

export function generateWeeklyReport(d: WeeklyReportData): string {
    const now = new Date().toISOString();
    const weekNo = getWeekNumber(new Date(d.weekStart));
    const year   = new Date(d.weekStart).getFullYear();
    const siteId = d.projectName.replace(/\s+/g, '-').toUpperCase().slice(0, 8);
    const reportId = `FG-${siteId}-W${weekNo}-${year}`;
    const totalExceedH = d.wbgtLog.reduce((s, e) => s + e.durationH, 0).toFixed(1);
    const peakEntry = d.wbgtLog.reduce((a, b) => b.wbgtAdj > a.wbgtAdj ? b : a, d.wbgtLog[0] ?? { wbgtAdj: 0, date: 'N/A', time: 'N/A' });

    const metTable = () => {
        const m = d.dailyMet;
        const cols = (fn: (x: DailyMet) => string | number) => m.map(x => String(fn(x)).padStart(7)).join('  ');
        return [
            `                   ${m.map(x => x.day.padStart(7)).join('  ')}`,
            '─'.repeat(88),
            `Max Temp (°C):     ${cols(x => x.maxTemp)}`,
            `Min Temp (°C):     ${cols(x => x.minTemp)}`,
            `Max RH (%):        ${cols(x => x.maxRH)}`,
            `Max Wind (m/s):    ${cols(x => x.maxWind)}`,
            `Peak Solar(W/m²):  ${cols(x => x.peakSolar)}`,
            '─'.repeat(88),
        ].join('\n');
    };

    const wbgtTable = () => {
        const sep = '━'.repeat(95);
        const hdr = '  DATE         TIME     DUR(H)  WBGT   WBGT+PPE  PPE                ZONE      ACTION';
        const rows = d.wbgtLog.map(e =>
            `  ${pad(e.date,14)}${pad(e.time,9)}${pad(e.durationH.toFixed(1),8)}${pad(e.wbgtBase+'°',7)} ${pad(e.wbgtAdj+'°',10)}${pad(e.ppe,19)}${pad(e.zone,10)}${e.action}`
        ).join('\n') || '  No exceedances recorded.';
        return [sep, hdr, sep, rows, sep, `  TOTAL: ${d.wbgtLog.length} events | ${totalExceedH} hrs above threshold`].join('\n');
    };

    const mgTable = () => {
        if (!d.morningGap.length) return '  None recorded this week.';
        const sep = '━'.repeat(75);
        const hdr = '  DATE         THRESHOLD   AT TIME   MINS BEFORE BAN   PEAK ADJ. WBGT';
        const rows = d.morningGap.map(e =>
            `  ${pad(e.date,14)} ${pad(e.threshold+'°C',11)} ${pad(e.time,10)}${pad(e.minsBeforeBan+' min',18)} ${e.peakAdj}°C`
        ).join('\n');
        return [sep, hdr, sep, rows, sep].join('\n');
    };

    const suspTable = () => {
        if (!d.suspensions.length) return '  No suspensions recorded.';
        const sep = '━'.repeat(90);
        const hdr = '  DATE         START   END     DUR(H)  TRIGGER        TRADES             WORKERS';
        const rows = d.suspensions.map(e =>
            `  ${pad(e.date,14)}${pad(e.startTime,8)}${pad(e.endTime,8)}${pad(e.hours.toFixed(1),8)}${pad(e.trigger,15)}${pad(e.trades,19)}${e.workers}`
        ).join('\n');
        const total = `\n  TOTAL SUSPENSION HOURS THIS WEEK: ${d.totalSuspensionHours.toFixed(1)} hours\n  CUMULATIVE (PROJECT TO DATE): ${d.cumulativeSuspensionHours.toFixed(1)} hours`;
        return [sep, hdr, sep, rows, sep, total].join('\n');
    };

    return `
================================================================================
FIELDGUARD — WEEKLY HEAT & WEATHER SAFETY AUDIT REPORT
Document Ref: HSE-WBGT-WEEKLY | Standard: ISO 7933:2004 / ISO 7243:2017
Method: 2-step Apparent Temperature + PPE-adjusted WBGT (ACGIH TLV)
Audit Period: ${d.weekStart} to ${d.weekEnd}
Generated: ${now} UTC | Report ID: ${reportId}
================================================================================

⚠  IMPORTANT LEGAL NOTICE
This report is generated by FieldGuard's automated HSE engine. It is intended as
a decision-support tool for qualified HSE professionals and must be reviewed by a
certified HSE Manager before use as contractual or legal evidence.
================================================================================

SECTION A — PROJECT & SITE IDENTIFICATION
──────────────────────────────────────────────────────────────────────────────
Project Name:           ${d.projectName}
Contract Number:        ${d.contractNumber}
Project Location:       ${d.siteAddress}
GPS Coordinates:        ${d.lat.toFixed(4)}, ${d.lon.toFixed(4)}
Country / Jurisdiction: ${d.country} — ${d.regulatoryRef}
Client / Employer:      ${d.clientName}
Main Contractor:        ${d.contractorName}
HSE Manager:            ${d.hseManagerName}
Report ID:              ${reportId}
FieldGuard Version:     v3.0.4
Heat Stress Method:     2-Step Apparent Temperature (Charts A & B)


SECTION B — EXECUTIVE SUMMARY
──────────────────────────────────────────────────────────────────────────────
During the week of ${d.weekStart} to ${d.weekEnd}, site "${d.projectName}" at
${d.siteAddress} recorded ${d.wbgtLog.length} heat stress exceedance events per
the FieldGuard zone system (ISO 7243 / ISO 7933, PPE-Adjusted WBGT).

Peak Adjusted WBGT:          ${peakEntry.wbgtAdj}°C at ${peakEntry.time} on ${peakEntry.date}
PPE Profile:                 ${d.ppeProfile} (+${d.ppeAdjustment}°C)
Total exceedance hours:      ${totalExceedH} hours across ${d.wbgtLog.length} events
Work suspension hours:       ${d.totalSuspensionHours.toFixed(1)} hours
Morning Gap events:          ${d.morningGap.length} events (WBGT exceedance before legal ban)
Legal Work Ban:              ${d.banStart}–${d.banEnd} (${d.banMonths})

FIDIC Clause 8.4 Assessment: ${d.fidic}
Estimated delay:             ${d.delayDays} calendar day(s)

Note: Zones determined by a 2-step Apparent Temperature method (Chart A: Temp×RH;
Chart B: Apparent Temp × Wind).
Zone system: Green (safe) → Amber (attention) → Red (alert) → Purple (extreme) → Black (no work)
Stop-work rule applied when ambient temp exceeds 50°C or NW (No Work) on Chart B.


SECTION C — METEOROLOGICAL DATA SUMMARY
──────────────────────────────────────────────────────────────────────────────
Data Source:     FieldGuard — Open-Meteo multi-model point forecast
                 (ECMWF, GFS, ICON, GEM, ARPEGE, ACCESS-G)
Method:          Worst-case across all available forecast models
Measurement:     Every 2 hours per field

${metTable()}
Weekly Max Temp:     ${Math.max(...d.dailyMet.map(m => m.maxTemp))}°C
Weekly Max Humidity: ${Math.max(...d.dailyMet.map(m => m.maxRH))}%
Weekly Max Wind:     ${Math.max(...d.dailyMet.map(m => m.maxWind))} m/s


SECTION D — HEAT STRESS ZONE ANALYSIS (ISO 7243 / ISO 7933)
──────────────────────────────────────────────────────────────────────────────
Zone System Reference: FieldGuard 2-step Apparent Temperature method
WBGT Supplement:      ISO 7933:2004 — Analytical Determination of Thermal Stress (PHS)

PPE Profile Applied:    ${d.ppeProfile}
ISO 7933 Adjustment:    +${d.ppeAdjustment}°C to base WBGT

ZONE THRESHOLDS (Apparent Temperature, °C):
  ● < 35°C  — GREEN  (Unrestricted): No limits on self-paced work
  ● 35–42°C — AMBER  (Attention):   Shade, no working alone, restricted heavy work
  ● 43–49°C — RED    (Alert):       Strict work/rest, stand-by vehicle, no solo work
  ● 50–54°C — PURPLE (Extreme):     Business-critical only, continuous monitoring, 30min from medical
  ● ≥ 55°C  — BLACK  (No Work):    All outdoor work STOPPED — A/C shelter only
  ● "NW"    — NO WORK on Chart B:  Stop work regardless of temperature

WORK/REST SCHEDULES:
  Zone     Light Work               Heavy Work
  AMBER    Continuous self-paced    45 min / 15 min rest
  RED      45 min / 15 min rest     20 min / 30 min rest
  PURPLE   10 min / 20 min rest     5 min / 20 min rest
  BLACK    No work                  No work

LEGAL WORK BAN (${d.country}): ${d.banStart}–${d.banEnd} during ${d.banMonths}
Reference: ${d.regulatoryRef}

WEEKLY EXCEEDANCE LOG:
${wbgtTable()}


SECTION E — THE MORNING GAP ANALYSIS
──────────────────────────────────────────────────────────────────────────────
"The Morning Gap is the period between operational start and the legal work ban
during which PPE-Adjusted WBGT exceeds safe thresholds, yet no legal protection
exists for workers. FieldGuard identifies this gap that regulatory clocks miss."
— Concept based on HeatProof Global methodology

Legal Work Ban: ${d.banStart}–${d.banEnd} (${d.banMonths}) per ${d.regulatoryRef}

Morning Gap Events This Week:
${mgTable()}


SECTION F — WORK SUSPENSION LOG
──────────────────────────────────────────────────────────────────────────────
Records suitable as contemporaneous evidence under FIDIC Clause 20.1.

${suspTable()}


SECTION G — FIDIC CLAUSE 8.4 WEATHER DELAY CLAIM EVIDENCE
──────────────────────────────────────────────────────────────────────────────
Contract Reference: FIDIC Sub-Clause 8.4 — Extension of Time for Completion
Assessment:         ${d.fidic}

Sub-Clause 8.4(d) provides EOT where Completion is delayed by "Exceptionally
Adverse Climatic Conditions."

Hours lost:         ${d.totalSuspensionHours.toFixed(1)} suspension hours
Delay claimed:      ${d.delayDays} calendar day(s)

SUPPORTING DOCUMENTS (attach):
  □ Appendix A: FieldGuard GPS-stamped alert log
  □ Appendix B: Open-Meteo API export (15-min intervals) — ECMWF/ICON best_match
  □ Appendix C: Site photographs with timestamps
  □ Appendix D: Supervisor attendance records (monitoring log)
  □ Appendix E: ISO 7933 PPE adjustment calculation worksheet
  □ Appendix F: FieldGuard Heat Stress dashboard screenshots
  □ Appendix G: National meteorological station records


SECTION H — REGULATORY COMPLIANCE CHECKLIST
──────────────────────────────────────────────────────────────────────────────
Based on: ISO 7933 / ISO 7243 / ACGIH TLV + ${d.regulatoryRef}

PLAN (Day Before):
  ☐ Weather forecast checked against Heat Stress Calculator (FieldGuard)
  ☐ If Amber/Red/Purple/Black: crew has trained heat stress responder
  ☐ If Purple: crew confirmed within 30 minutes of Tier 2 medical response
  ☐ Risk assessment updated with summer/heat hazards and controls

PREPARE (Before Leaving Camp):
  ☐ Summer hazards included in toolbox talk
  ☐ Support vehicle with A/C and heat stress response kit (Amber+ zones)
  ☐ All mandatory controls verified and in place

START-UP (Before Starting Work):
  ☐ All mandatory controls for current zone verified on site
  ☐ Toolbox talk: heat stress controls explained; symptoms and response confirmed
  ☐ Every worker acknowledged right and duty to raise concern
  ☐ Hydration schedule started

EXECUTION (During Work):
  ☐ Work/rest schedule followed per current zone
  ☐ Crew monitored for symptoms every 2 hours:
     Weakness, Headache, Loss of Consciousness, Nausea/Vomiting, Cramps, Dizziness
  ☐ Conditions measured and recorded every 2 hours
  ☐ Heat stress calculator rechecked when conditions change
  ☐ HSE representative spot checks conducted per schedule
  ☐ Legal work ban ${d.banStart}–${d.banEnd} observed (${d.banMonths})
  ☐ Hydration: ≥0.6–1.2 L/hr per zone; isotonic supplements for Red/Purple
  ☐ Stop work implemented when ambient temp exceeded 50°C (if monitor unavailable)

EMERGENCY RESPONSE:
  ☐ Trained first aider on site
  ☐ Emergency light vehicle available for medical response
  ☐ Emergency response steps posted (multi-language)
  ☐ Near-miss heat incidents this week: ___
  ☐ Notifiable incidents this week: ___

DEFICIENCIES / CORRECTIVE ACTIONS:
[Enter any compliance gaps and corrective actions here]


SECTION I — AI RISK ASSESSMENT & FORECAST
──────────────────────────────────────────────────────────────────────────────
FieldGuard Worst-Case Engine: All available forecast models queried simultaneously
(ECMWF, GFS, ICON, GEM, ARPEGE, ACCESS-G). Highest-severity result across all
models used for zone determination and alerts.

CURRENT WEEK ASSESSMENT:
${d.forecastNarrative}

IMPORTANT: Risk of heat stress increases when apparent temperature exceeds 35°C.
Heat is not defined by temperature alone but also depends on relative humidity and
wind speed.


SECTION J — SIGNATURES & CERTIFICATION
──────────────────────────────────────────────────────────────────────────────
FieldGuard Data: Windy.com API + Open-Meteo (ECMWF/ICON)
Method: 2-step Apparent Temperature (Charts A & B) + ISO 7933 WBGT
Report ID: ${reportId}

─────────────────────────────────────────────────────────────────────────────
Prepared by (HSE Manager):
Name: _________________________    Qualification: _________________________
Signature: _____________________    Date: _________________________________
FieldGuard User ID: ____________

Reviewed by (Project Director):
Name: _________________________    Title: _________________________________
Signature: _____________________    Date: _________________________________

Approved by (Client Representative / FIDIC Engineer):
Name: _________________________    Title: _________________________________
Signature: _____________________    Date: _________________________________
Reference: _____________________    (for FIDIC Engineer's record)
─────────────────────────────────────────────────────────────────────────────

DOCUMENT RETENTION: Retain minimum 10 years from project completion.
Archive Reference: FG-VAULT-${siteId}-${reportId}

================================================================================
FIELDGUARD HSE PLUGIN — Windy.com
"All models. Worst case. Zero compromise."
Standard: ISO 7933:2004 / ISO 7243:2017 / ACGIH TLV® / FIDIC Clause 8.4
Zone system: FieldGuard 2-step Apparent Temperature method
WBGT method: Liljegren (2008) | Apparent Temp: 2-step Chart A+B
================================================================================
END OF REPORT — ${reportId}
================================================================================
`;
}
