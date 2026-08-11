/**
 * FieldGuard HSE Calculations
 *
 * Standards alignment:
 *   - ISO 7243:2017 — WBGT heat-stress index
 *   - ISO 7933:2004 — Analytical determination of thermal strain (PHS)
 *   - ACGIH TLV® — heat- and cold-stress action levels
 *
 * Core method: 2-step Apparent Temperature lookup
 *   Step 1: Temp (°C) + Humidity (%) → Apparent Temp (°C) [Chart A]
 *   Step 2: Apparent Temp + Wind (m/s) → Final Apparent Temp [Chart B]
 *   Output zone: Green / Amber / Red / Purple / Black (No Work)
 *
 * Midday outdoor work ban (configurable): 12:30–15:30, June/July/August.
 * Stop work when temp exceeds 50°C ambient (when monitor unavailable).
 */

export interface WeatherInputs {
    tempC: number;
    humidity: number;   // %
    windMs: number;     // m/s
    solarWm2: number;   // W/m²
    rainMmH: number;    // mm/h
    cloudCoverPct?: number; // % total cloud cover - gates CAPE storm risk (fuel needs a trigger: clouds/rain).
    capeJkg?: number;   // J/kg — Convective Available Potential Energy (thunderstorm/lightning risk). Optional: some models (ECMWF) do not expose it to plugins.
}

export type HeatZone = 'green' | 'amber' | 'red' | 'purple' | 'black';

export interface ZoneInfo {
    key: HeatZone;
    label: string;
    riskLabel: string;
    color: string;
    bgColor: string;
    hydrationLow: number;
    hydrationHigh: number;
    workRestLight: string;
    workRestHeavy: string;
    monitoringSchedule: string;
    mandatoryControls: string[];
    workAllowed: boolean;
    stopWork: boolean;
}

// Heat-stress zones (Apparent Temperature bands → controls)
export const ZONES: Record<HeatZone, ZoneInfo> = {
    green: {
        key: 'green', label: 'Unrestricted — Low Risk',
        riskLabel: 'GREEN', color: '#16a34a', bgColor: '#14532d',
        hydrationLow: 0.6, hydrationHigh: 1.0,
        workRestLight: 'Continuous self-paced',
        workRestHeavy: 'Continuous self-paced',
        monitoringSchedule: 'Daily measurement and calculation only',
        workAllowed: true, stopWork: false,
        mandatoryControls: [
            'No limits on self-paced work for educated, hydrated workers',
            'Hydration: 0.6–1.0 L/hr',
        ],
    },
    amber: {
        key: 'amber', label: 'Attention — Medium Risk',
        riskLabel: 'AMBER', color: '#d97706', bgColor: '#451a03',
        hydrationLow: 1.0, hydrationHigh: 1.2,
        workRestLight: 'Continuous self-paced',
        workRestHeavy: '45 min work / 15 min rest',
        monitoringSchedule: 'Verification of controls before validation/start work',
        workAllowed: true, stopWork: false,
        mandatoryControls: [
            'Provide shade, improve ventilation',
            'Working alone to be avoided',
            'No un-acclimatized workers on site',
            'Heat stress trained responder on site',
            'Light work: continuous self-paced',
            'Heavy work: 45 min work / 15 min rest',
            'Hydration: 1.0–1.2 L/hr',
        ],
    },
    red: {
        key: 'red', label: 'Alert — High Risk',
        riskLabel: 'RED', color: '#dc2626', bgColor: '#450a0a',
        hydrationLow: 1.2, hydrationHigh: 1.2,
        workRestLight: '45 min work / 15 min rest',
        workRestHeavy: '20 min work / 30 min rest',
        monitoringSchedule: 'Verification at start + at least twice per day',
        workAllowed: true, stopWork: false,
        mandatoryControls: [
            'All Amber controls apply',
            'No person works alone',
            'Test risk awareness in toolbox talk',
            'Strict work/rest cycle compliance',
            'No un-acclimatized person on site',
            'Stand-by vehicle with A/C for emergency response',
            'Light work: 45/15 | Heavy work: 20/30 (min work/rest)',
            'Hydration: 1.2 L/hr + isotonic supplements',
        ],
    },
    purple: {
        key: 'purple', label: 'Extreme — Extreme Risk',
        riskLabel: 'PURPLE', color: '#7c3aed', bgColor: '#2e1065',
        hydrationLow: 1.2, hydrationHigh: 1.2,
        workRestLight: '10 min work / 20 min rest',
        workRestHeavy: '5 min work / 20 min rest',
        monitoringSchedule: 'Continuous monitoring',
        workAllowed: true, stopWork: false,
        mandatoryControls: [
            'All Red controls apply',
            'Business-critical activities ONLY — approved by senior HSE representative',
            'Continuous monitoring for heat stress symptoms',
            'Must be within 30 minutes of Tier 2 medical response',
            'Crew must have support vehicle with A/C + heat stress kit',
            'Light work: 10/20 | Heavy work: 5/20 (min work/rest)',
            'Hydration: 1.2 L/hr + isotonic supplements',
        ],
    },
    black: {
        key: 'black', label: 'No Work',
        riskLabel: 'NO WORK', color: '#6b7280', bgColor: '#030712',
        hydrationLow: 0.6, hydrationHigh: 1.0,
        workRestLight: 'No work', workRestHeavy: 'No work',
        monitoringSchedule: 'Suspend work authorisation',
        workAllowed: false, stopWork: true,
        mandatoryControls: [
            'ALL OUTDOOR WORK STOPPED',
            'Standby in shaded, air-conditioned environment or return to camp',
            'Maintain hydration: 0.6–1.0 L/hr',
        ],
    },
};

// ─── Chart A: Temp × Humidity → Apparent Temp ───────────────────────────────
const CHART_A_TEMPS = [25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54];
const CHART_A_RH    = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];
const CHART_A: number[][] = [
    [25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26],
    [26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,28,28,28,28,28],
    [27,27,27,27,27,27,27,27,27,27,27,27,28,28,29,29,30,30,31,32,33],
    [28,28,28,28,28,28,28,28,28,28,28,28,29,30,31,31,32,33,34,35,36],
    [29,29,29,29,29,29,29,29,29,29,30,30,31,32,33,34,35,36,37,39,40],
    [30,30,30,30,30,30,30,30,30,30,31,32,33,34,35,36,38,39,41,43,44],
    [31,31,31,31,31,31,31,31,31,32,33,34,36,36,38,39,41,43,45,47,49],
    [32,32,32,32,32,32,32,32,32,33,34,36,37,39,40,42,44,47,49,51,54],
    [33,33,33,33,33,33,33,33,34,35,36,38,40,41,43,46,48,51,54,57,60],
    [34,34,34,34,34,34,34,35,35,37,38,40,42,44,47,49,52,55,58,60,60],
    [35,35,35,35,35,35,35,36,37,39,41,43,45,48,50,53,57,60,60,60,60],
    [36,36,36,36,36,36,36,38,39,41,43,46,48,51,54,58,60,60,60,60,60],
    [37,37,37,37,37,37,38,39,41,43,46,48,51,44,58,60,60,60,60,60,60],
    [38,38,38,38,38,38,39,41,43,46,49,52,55,59,60,60,60,60,60,60,60],
    [39,39,39,39,39,39,41,43,46,49,52,55,59,60,60,60,60,60,60,60,60],
    [40,40,40,40,40,41,43,46,48,51,55,59,60,60,60,60,60,60,60,60,60],
    [41,41,41,41,41,43,45,48,51,54,58,60,60,60,60,60,60,60,60,60,60],
    [42,42,42,42,42,45,47,50,54,57,60,60,60,60,60,60,60,60,60,60,60],
    [43,43,43,43,44,46,49,53,57,60,60,60,60,60,60,60,60,60,60,60,60],
    [44,44,44,44,46,48,52,55,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [45,45,45,45,47,50,54,58,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [46,46,46,46,49,53,57,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [47,47,47,47,51,55,59,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [48,48,48,48,53,57,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [49,49,49,50,55,59,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [50,50,50,52,57,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [51,51,51,54,59,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [52,52,52,55,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [53,53,53,57,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
    [54,54,53,59,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
];

// ─── Chart B: Apparent Temp × Wind → Final Apparent Temp ────────────────────
const CHART_B_APPTEMPS = [25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
const CHART_B_WINDS    = [0,1,3,4,6,7,8,10,11,13,14,15,17,18,19,21,22,24,25,26,28];
const NW = 999;
const CHART_B: number[][] = [
    [25,25,26,26,26,26,26,26,26,26,26,27,27,27,28,28,28,28,29,29,29],
    [26,26,27,27,27,27,27,28,28,28,28,28,29,29,29,29,30,30,30,31,31],
    [27,27,28,28,28,28,28,29,29,29,30,30,30,30,31,31,33,33,34,35,36],
    [28,28,29,29,29,29,30,30,30,31,33,31,31,33,33,34,36,37,39,40,42],
    [29,29,30,30,30,30,31,31,31,32,33,33,34,36,36,38,40,41,43,46,47],
    [30,30,31,31,31,31,32,32,33,33,34,36,37,39,40,41,44,46,49,51,52],
    [31,31,32,32,32,32,33,33,34,36,37,39,40,42,45,46,48,51,53,NW,NW],
    [32,32,33,33,33,33,34,34,37,37,40,41,43,46,48,50,52,NW,NW,NW,NW],
    [33,33,34,34,34,34,36,37,38,39,41,44,47,49,51,54,NW,NW,NW,NW,NW],
    [34,34,35,35,35,36,37,38,39,42,44,47,50,52,NW,NW,NW,NW,NW,NW,NW],
    [35,35,36,36,36,38,40,41,43,45,47,51,53,NW,NW,NW,NW,NW,NW,NW,NW],
    [36,36,37,38,38,39,41,43,45,48,51,54,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [37,37,38,39,40,40,44,45,48,51,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [38,38,39,40,41,43,45,47,51,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [39,39,40,41,43,44,48,51,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [40,40,41,42,44,47,50,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [41,41,43,44,45,49,53,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [42,42,45,44,47,52,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [43,43,45,47,49,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [44,44,47,48,53,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [45,45,49,51,55,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [46,46,50,52,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [47,47,51,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [48,48,53,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [49,49,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [50,50,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [51,51,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [52,52,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [53,53,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [54,54,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
    [NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW,NW],
];

function findNearestIndex(arr: number[], val: number): number {
    let best = 0, bestDist = Math.abs(arr[0] - val);
    for (let i = 1; i < arr.length; i++) {
        const d = Math.abs(arr[i] - val);
        if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
}

export function calcApparentTemp(tempC: number, rh: number): number {
    const ti = findNearestIndex(CHART_A_TEMPS, tempC);
    const ri = findNearestIndex(CHART_A_RH, rh);
    return CHART_A[ti][ri];
}

export function calcFinalApparentTemp(apparentTemp: number, windMs: number): number {
    const ai = findNearestIndex(CHART_B_APPTEMPS, apparentTemp);
    const wi = findNearestIndex(CHART_B_WINDS, windMs);
    return CHART_B[ai][wi];
}

export function apparentTempToZone(finalApparent: number, tempC: number): HeatZone {
    if (finalApparent >= NW || tempC >= 50) return 'black';
    if (finalApparent >= 55) return 'black';
    if (finalApparent >= 50) return 'purple';
    if (finalApparent >= 43) return 'red';
    if (finalApparent >= 35) return 'amber';
    return 'green';
}

export interface HeatAssessment {
    apparentTemp1: number;
    apparentTempFinal: number;
    zone: HeatZone;
    zoneInfo: ZoneInfo;
    wbgtBase: number;
    wbgtAdjusted: number;
    heatIndex: number;
    isNoWork: boolean;
    isBanPeriod: boolean;
    workRestSchedule: { light: string; heavy: string };
    hydration: string;
}

export function assessHeatStress(
    inputs: WeatherInputs,
    ppeKey: string,
    localHour: number,
    month: number,
    ban?: MiddayBan | null,
): HeatAssessment {
    const appTemp1 = calcApparentTemp(inputs.tempC, inputs.humidity);
    const appTempFinal = calcFinalApparentTemp(appTemp1, inputs.windMs);
    const zone = apparentTempToZone(appTempFinal, inputs.tempC);
    const zoneInfo = ZONES[zone];
    const wbgtBase = calcWBGT(inputs);
    const wbgtAdj = calcAdjustedWBGT(wbgtBase, ppeKey);
    const heatIdx = calcHeatIndex(inputs.tempC, inputs.humidity);
    // Statutory midday outdoor-work ban for the pin's country (if any).
    const isBanPeriod = !!ban && ban.months.includes(month) && localHour >= ban.start && localHour < ban.end;
    return {
        apparentTemp1: appTemp1,
        apparentTempFinal: appTempFinal,
        zone, zoneInfo,
        wbgtBase, wbgtAdjusted: wbgtAdj,
        heatIndex: heatIdx,
        isNoWork: zoneInfo.stopWork || isBanPeriod,
        isBanPeriod,
        workRestSchedule: { light: zoneInfo.workRestLight, heavy: zoneInfo.workRestHeavy },
        hydration: `${zoneInfo.hydrationLow}–${zoneInfo.hydrationHigh} L/hr`,
    };
}

// ─── WBGT (Liljegren 2008 simplified outdoor) ────────────────────────────────
export function calcWBGT(inputs: WeatherInputs): number {
    const { tempC, humidity, solarWm2 } = inputs;
    const Tw = tempC * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659))
        + Math.atan(tempC + humidity)
        - Math.atan(humidity - 1.676331)
        + 0.00391838 * humidity ** 1.5 * Math.atan(0.023101 * humidity)
        - 4.686035;
    const Tk = tempC + 273.15;
    const emissGlobe = 0.95, albedo = 0.37, sigma = 5.67e-8;
    let Tg = tempC + 15 * (solarWm2 / 800);
    for (let i = 0; i < 5; i++) {
        Tg = Math.pow((1 - albedo) * solarWm2 / (emissGlobe * sigma) + Tk ** 4, 0.25) - 273.15;
    }
    return Math.round((0.7 * Tw + 0.2 * Tg + 0.1 * tempC) * 10) / 10;
}

// ─── PPE Profiles (ISO 7933:2004) ────────────────────────────────────────────
export const PPE_PROFILES: Record<string, { label: string; adjustment: number }> = {
    light:      { label: 'Light clothing (summer work wear)',  adjustment: 0   },
    coverall:   { label: 'Coverall (cotton)',                  adjustment: 1.0 },
    fr:         { label: 'FR (flame-resistant) suit',         adjustment: 2.0 },
    fr_imperm:  { label: 'FR impermeable suit',               adjustment: 4.0 },
    encapsulat: { label: 'Fully encapsulating chemical suit',  adjustment: 10.0},
};

export function calcAdjustedWBGT(wbgtBase: number, ppeKey: string): number {
    return Math.round((wbgtBase + (PPE_PROFILES[ppeKey]?.adjustment ?? 0)) * 10) / 10;
}

// ─── Heat Index (Rothfusz/NWS) ────────────────────────────────────────────────
export function calcHeatIndex(tempC: number, rh: number): number {
    const T = tempC * 9 / 5 + 32;
    if (T < 80) return Math.round(((0.5 * (T + 61 + (T - 68) * 1.2 + rh * 0.094) - 32) * 5 / 9) * 10) / 10;
    let hi = -42.379 + 2.04901523*T + 10.14333127*rh - 0.22475541*T*rh
        - 0.00683783*T*T - 0.05481717*rh*rh + 0.00122874*T*T*rh
        + 0.00085282*T*rh*rh - 0.00000199*T*T*rh*rh;
    if (rh < 13 && T >= 80 && T <= 112) hi -= ((13-rh)/4)*Math.sqrt((17-Math.abs(T-95))/17);
    else if (rh > 85 && T >= 80 && T <= 87) hi += ((rh-85)/10)*((87-T)/5);
    return Math.round(((hi - 32) * 5 / 9) * 10) / 10;
}

// ─── Wind ─────────────────────────────────────────────────────────────────────
export const BEAUFORT_SCALE = [
    {max:0.5,bf:0,desc:'Calm'},{max:1.5,bf:1,desc:'Light air'},{max:3.3,bf:2,desc:'Light breeze'},
    {max:5.5,bf:3,desc:'Gentle breeze'},{max:7.9,bf:4,desc:'Moderate breeze'},{max:10.7,bf:5,desc:'Fresh breeze'},
    {max:13.8,bf:6,desc:'Strong breeze'},{max:17.1,bf:7,desc:'Near gale'},{max:20.7,bf:8,desc:'Gale'},
    {max:24.4,bf:9,desc:'Severe gale'},{max:28.4,bf:10,desc:'Storm'},{max:32.6,bf:11,desc:'Violent storm'},
    {max:Infinity,bf:12,desc:'Hurricane'},
];

export interface WindResult {
    beaufort: number; beaufortDesc: string;
    riskColor: string; riskLabel: string; exceedsThreshold: boolean;
}

export function assessWind(windMs: number, warnMs: number, dangerMs: number): WindResult {
    const e = BEAUFORT_SCALE.find(b => windMs <= b.max) ?? BEAUFORT_SCALE[12];
    let riskColor = '#16a34a', riskLabel = 'SAFE';
    if (windMs >= dangerMs)          { riskColor = '#dc2626'; riskLabel = 'DANGER'; }
    else if (windMs >= warnMs)       { riskColor = '#f97316'; riskLabel = 'WARNING'; }
    else if (windMs >= warnMs * 0.7) { riskColor = '#d97706'; riskLabel = 'CAUTION'; }
    return { beaufort: e.bf, beaufortDesc: e.desc, riskColor, riskLabel, exceedsThreshold: windMs >= warnMs };
}

// ─── Rain ─────────────────────────────────────────────────────────────────────
export interface RainResult {
    intensityLabel: string; riskColor: string; riskLabel: string; exceedsThreshold: boolean;
}
export function assessRain(mmh: number, warnMmh: number, dangerMmh: number): RainResult {
    let intensityLabel = 'None';
    if (mmh > 0 && mmh < 0.5) intensityLabel = 'Trace';
    else if (mmh < 2.5) intensityLabel = 'Light';
    else if (mmh < 7.6) intensityLabel = 'Moderate';
    else if (mmh < 50)  intensityLabel = 'Heavy';
    else if (mmh > 0)   intensityLabel = 'Violent';
    let riskColor = '#16a34a', riskLabel = 'CLEAR';
    if (mmh >= dangerMmh)        { riskColor = '#dc2626'; riskLabel = 'DANGER'; }
    else if (mmh >= warnMmh)     { riskColor = '#f97316'; riskLabel = 'WARNING'; }
    else if (mmh >= warnMmh*0.5) { riskColor = '#d97706'; riskLabel = 'CAUTION'; }
    return { intensityLabel, riskColor, riskLabel, exceedsThreshold: mmh >= warnMmh };
}

// ─── Symptom & Emergency reference ───────────────────────────────────────────
export const HEAT_STRESS_SYMPTOMS = [
    'Weakness', 'Headache', 'Loss of Consciousness',
    'Nausea and Vomiting', 'Muscle Cramps', 'Dizziness',
];
export const EMERGENCY_RESPONSE = [
    'Quit activity immediately',
    'Move to shaded, air-conditioned area',
    'Use water and isotonic water/powder supplements',
    'Loosen clothing',
    'Wet cloth to dampen neck, head and arms',
    'Consult Doctor — Notify site representative',
    'FOR SEVERE SYMPTOMS: GET IMMEDIATE MEDICAL CARE',
];

// ════════════════════════════════════════════════════════════════════════════
//  COLD STRESS / WIND CHILL — winter field safety
//  Wind chill: Environment Canada / US NWS index (2001).
//  Cold zones & frostbite times: Environment Canada Wind Chill chart + ACGIH
//  Cold Stress TLV® work/warm-up guidance.
// ════════════════════════════════════════════════════════════════════════════

export interface ColdResult {
    windChillC: number;          // wind chill temperature, °C
    riskLabel: string;           // SAFE / COOL / COLD / VERY COLD / EXTREME / DANGER
    riskColor: string;
    bgColor: string;
    frostbite: string;           // exposed-skin frostbite time guidance
    exceedsThreshold: boolean;   // true once cold risk is real (≥ COLD)
    controls: string[];
    active: boolean;             // true when conditions are cold enough to matter (≤ 10°C)
}

/** Wind chill in °C (Environment Canada / NWS 2001). Valid for T ≤ 10°C and wind ≥ ~5 km/h. */
export function calcWindChill(tempC: number, windMs: number): number {
    const vKmh = windMs * 3.6;
    if (tempC > 10 || vKmh < 4.8) return Math.round(tempC * 10) / 10;
    const v16 = Math.pow(vKmh, 0.16);
    const wc = 13.12 + 0.6215 * tempC - 11.37 * v16 + 0.3965 * tempC * v16;
    return Math.round(wc * 10) / 10;
}

export function assessColdStress(tempC: number, windMs: number): ColdResult {
    const wc = calcWindChill(tempC, windMs);
    const active = tempC <= 10;

    // Environment Canada wind-chill risk bands
    let riskLabel = 'SAFE', riskColor = '#16a34a', bgColor = '#14532d',
        frostbite = 'Low risk', exceeds = false;
    let controls = [
        'No cold-stress controls required',
        'Keep dry; carry a windproof layer if conditions change',
    ];

    if (wc <= -55) {
        riskLabel = 'DANGER'; riskColor = '#6b7280'; bgColor = '#030712';
        frostbite = 'Frostbite in UNDER 2 min on exposed skin';
        exceeds = true;
        controls = [
            'OUTDOOR WORK STOPPED — conditions dangerous for any exposed skin',
            'Only emergency work, fully covered, with continuous buddy checks',
            'Heated shelter within immediate reach; rotate crews continuously',
        ];
    } else if (wc <= -48) {
        riskLabel = 'EXTREME'; riskColor = '#7c3aed'; bgColor = '#2e1065';
        frostbite = 'Frostbite in 2–5 min on exposed skin';
        exceeds = true;
        controls = [
            'Business-critical work only; cover ALL exposed skin',
            'Heated warm-up shelter ≤ a few minutes away; scheduled warm-up breaks',
            'Continuous buddy system; watch for frostnip (white/waxy skin)',
            'Insulated, windproof PPE + face/eye protection',
        ];
    } else if (wc <= -40) {
        riskLabel = 'VERY COLD'; riskColor = '#dc2626'; bgColor = '#450a0a';
        frostbite = 'Frostbite in 5–10 min on exposed skin';
        exceeds = true;
        controls = [
            'Frequent scheduled warm-up breaks (ACGIH Cold Stress TLV)',
            'Cover all exposed skin; windproof outer layer mandatory',
            'Buddy system; monitor for hypothermia & frostbite',
            'Warm, sweet drinks; no alcohol/caffeine before exposure',
        ];
    } else if (wc <= -28) {
        riskLabel = 'COLD'; riskColor = '#f97316'; bgColor = '#451a03';
        frostbite = 'Frostbite possible in 10–30 min on exposed skin';
        exceeds = true;
        controls = [
            'Layer clothing; keep dry; add windproof shell',
            'Scheduled warm-up breaks; limit continuous exposure',
            'Watch extremities (fingers, toes, ears, nose)',
        ];
    } else if (wc <= -10) {
        riskLabel = 'COOL'; riskColor = '#d97706'; bgColor = '#451a03';
        frostbite = 'Low frostbite risk; hypothermia risk with long exposure';
        controls = [
            'Dress in layers; keep dry',
            'Take warm-up breaks on long shifts',
        ];
    } else if (active) {
        riskLabel = 'MILD COLD'; riskColor = '#16a34a'; bgColor = '#14532d';
        frostbite = 'Low risk';
        controls = [
            'Light cold-weather layers; keep dry',
        ];
    }

    return { windChillC: wc, riskLabel, riskColor, bgColor, frostbite, exceedsThreshold: exceeds, controls, active };
}

// ════════════════════════════════════════════════════════════════════════════
//  THUNDERSTORM / LIGHTNING RISK
//  Derived from CAPE (Convective Available Potential Energy, J/kg) where the
//  selected Windy model exposes it. CAPE indicates atmospheric INSTABILITY /
//  storm potential — it is NOT a live lightning-strike detector. Crews should
//  apply the 30-30 rule for live strikes (see guidance below).
// ════════════════════════════════════════════════════════════════════════════

export interface ThunderResult {
    available: boolean;          // false when the model did not return CAPE
    capeJkg: number;
    riskLabel: string;           // N/A / LOW / MODERATE / HIGH / SEVERE
    riskColor: string;
    instability: string;         // human description
    exceedsThreshold: boolean;
    guidance: string[];
}

export function assessThunderstorm(capeJkg?: number, cloudCoverPct?: number, precipMmH?: number): ThunderResult {
    if (capeJkg === undefined || capeJkg === null || Number.isNaN(capeJkg)) {
        return {
            available: false, capeJkg: 0,
            riskLabel: 'N/A', riskColor: '#475569',
            instability: 'CAPE not provided by this model — switch model or enable Worst-case',
            exceedsThreshold: false,
            guidance: [
                'Live lightning-strike detection is not part of the weather model.',
                'Apply the 30-30 rule: if thunder follows a flash within 30 s (≈10 km),',
                'suspend outdoor work; resume only 30 min after the last thunder.',
            ],
        };
    }
    const cape = Math.max(0, Math.round(capeJkg));
    let riskLabel = 'LOW', riskColor = '#16a34a',
        instability = 'Stable — thunderstorms unlikely', exceeds = false;

    if (cape >= 2500) {
        riskLabel = 'SEVERE'; riskColor = '#7c3aed';
        instability = 'Extreme instability — severe thunderstorm / lightning potential';
        exceeds = true;
    } else if (cape >= 1000) {
        riskLabel = 'HIGH'; riskColor = '#dc2626';
        instability = 'Strong instability — thunderstorms likely';
        exceeds = true;
    } else if (cape >= 300) {
        riskLabel = 'MODERATE'; riskColor = '#f97316';
        instability = 'Marginal instability — isolated storms possible';
        exceeds = false;
    }

    // CAPE is only the fuel; a storm also needs a trigger (cloud build-up or
    // precipitation). High CAPE under clear, dry skies is LATENT instability, not an
    // active storm, so we do not raise a storm warning on it. Gate only when sky data
    // is present; with no cloud/precip info, fall back to CAPE alone (never miss).
    const _cloud = Number.isFinite(cloudCoverPct as number) ? (cloudCoverPct as number) : undefined;
    const _precip = Number.isFinite(precipMmH as number) ? (precipMmH as number) : 0;
    const _skyKnown = _cloud !== undefined || _precip > 0;
    const _hasTrigger = _precip > 0 || (_cloud !== undefined && _cloud >= 40);
    if (exceeds && _skyKnown && !_hasTrigger) {
        riskLabel = 'NO STORM'; riskColor = '#16a34a';
        instability = `Skies clear/dry - no storm developing (unstable air only, CAPE ${cape})`;
        exceeds = false;
    }

    return {
        available: true, capeJkg: cape, riskLabel, riskColor, instability, exceedsThreshold: exceeds,
        guidance: [
            'CAPE shows storm POTENTIAL, not live strikes.',
            '30-30 rule: suspend work if thunder follows a flash within 30 s (≈10 km).',
            'Resume only 30 min after the last thunder; clear elevated/exposed areas.',
        ],
    };
}

// ════════════════════════════════════════════════════════════════════════════
//  UNIT HELPERS (metric ⇄ imperial) — display only; all logic stays in SI.
// ════════════════════════════════════════════════════════════════════════════

export type UnitSystem = 'metric' | 'imperial';

/** Format a Celsius value; NW sentinel (999) renders as the no-work marker. */
export function fmtTemp(c: number, units: UnitSystem, withUnit = true): string {
    if (c === NW || c === 999) return 'NO WORK';
    if (units === 'imperial') {
        const f = c * 9 / 5 + 32;
        return (Math.round(f * 10) / 10) + (withUnit ? '°F' : '');
    }
    return (Math.round(c * 10) / 10) + (withUnit ? '°C' : '');
}

/** Primary wind speed: m/s (metric) or mph (imperial). */
export function fmtWind(ms: number, units: UnitSystem, withUnit = true): string {
    if (units === 'imperial') return (Math.round(ms * 2.23694 * 10) / 10) + (withUnit ? ' mph' : '');
    return (Math.round(ms * 10) / 10) + (withUnit ? ' m/s' : '');
}

/** Secondary wind speed: km/h (metric) or knots (imperial). */
export function fmtWindSecondary(ms: number, units: UnitSystem): { val: string; lbl: string } {
    if (units === 'imperial') return { val: (Math.round(ms * 1.94384 * 10) / 10).toString(), lbl: 'knots' };
    return { val: (Math.round(ms * 3.6 * 10) / 10).toString(), lbl: 'km/h' };
}

/** Rainfall rate: mm/h (metric) or in/h (imperial). */
export function fmtRain(mmh: number, units: UnitSystem, withUnit = true): string {
    if (units === 'imperial') return (Math.round(mmh * 0.0393701 * 100) / 100) + (withUnit ? ' in/h' : '');
    return (Math.round(mmh * 10) / 10) + (withUnit ? ' mm/h' : '');
}

/** Distance: km (metric) or miles (imperial). */
export function fmtDistance(km: number, units: UnitSystem, withUnit = true): string {
    if (units === 'imperial') return (Math.round(km * 0.621371 * 10) / 10) + (withUnit ? ' mi' : '');
    return (Math.round(km * 10) / 10) + (withUnit ? ' km' : '');
}

// ════════════════════════════════════════════════════════════════════════════
//  SOLAR POSITION (day/night + elevation) and SOLAR IRRADIANCE BAND
// ════════════════════════════════════════════════════════════════════════════

/** Solar elevation angle (degrees above horizon) for a lat/lon at a given time. */
export function solarElevationDeg(lat: number, lon: number, date: Date): number {
    const rad = Math.PI / 180;
    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
    const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000);
    const decl = 23.45 * Math.sin(rad * (360 / 365) * (dayOfYear + 284));      // solar declination
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
    const solarTime = utcHours + lon / 15;                                      // approx local solar time
    const H = 15 * (solarTime - 12);                                            // hour angle (deg)
    const elev = Math.asin(
        Math.sin(lat * rad) * Math.sin(decl * rad) +
        Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(H * rad),
    ) / rad;
    return Math.round(elev * 10) / 10;
}

export function isDaytime(lat: number, lon: number, date: Date): boolean {
    return solarElevationDeg(lat, lon, date) > 0;
}

/** Qualitative solar-radiation band from irradiance (W/m²). At night returns NIGHT
 *  regardless of irradiance; by day, low irradiance is LOW (e.g. high-latitude sun). */
export function solarBand(wm2: number, day = true): { label: string; color: string } {
    if (!day) return { label: 'NIGHT', color: '#475569' };
    if (wm2 < 200) return { label: 'LOW',      color: '#16a34a' };
    if (wm2 < 500) return { label: 'MODERATE', color: '#d97706' };
    if (wm2 < 800) return { label: 'HIGH',     color: '#f97316' };
    return { label: 'EXTREME', color: '#dc2626' };
}

// ════════════════════════════════════════════════════════════════════════════
//  LEGAL MIDDAY OUTDOOR-WORK BANS (by country, where a statutory rule exists)
//  Months are 1-based; start/end are local clock hours in decimal (12.5 = 12:30).
//  These are summaries — always verify against the current national regulation.
// ════════════════════════════════════════════════════════════════════════════

export interface MiddayBan {
    country: string;
    months: number[];
    start: number;
    end: number;
    label: string;
}

export const MIDDAY_BANS: Record<string, MiddayBan> = {
    OM: { country: 'Oman',                 months: [6, 7, 8],    start: 12.5, end: 15.5, label: '12:30–15:30, Jun–Aug' },
    AE: { country: 'United Arab Emirates', months: [6, 7, 8, 9], start: 12.5, end: 15.0, label: '12:30–15:00, 15 Jun–15 Sep' },
    SA: { country: 'Saudi Arabia',         months: [6, 7, 8, 9], start: 12.0, end: 15.0, label: '12:00–15:00, 15 Jun–15 Sep' },
    QA: { country: 'Qatar',                months: [6, 7, 8, 9], start: 10.0, end: 15.5, label: '10:00–15:30, 1 Jun–15 Sep' },
    KW: { country: 'Kuwait',               months: [6, 7, 8],    start: 11.0, end: 16.0, label: '11:00–16:00, Jun–Aug' },
    BH: { country: 'Bahrain',              months: [7, 8],       start: 12.0, end: 16.0, label: '12:00–16:00, Jul–Aug' },
};

export function getMiddayBan(countryCode: string): MiddayBan | null {
    return MIDDAY_BANS[(countryCode || '').toUpperCase()] ?? null;
}

// ════════════════════════════════════════════════════════════════════════════
//  MULTI-HAZARD EMERGENCY REFERENCE (SOS page)
//  Warning signs + immediate response steps for every hazard FieldGuard tracks,
//  not just heat. Heat reuses the legacy HEAT_STRESS_SYMPTOMS / EMERGENCY_RESPONSE
//  arrays so existing references stay in sync.
// ════════════════════════════════════════════════════════════════════════════

export interface HazardEmergency {
    key: 'heat' | 'cold' | 'wind' | 'rain' | 'thunder' | 'solar';
    icon: string;
    title: string;
    danger: string;        // one-line reason it is life-/safety-critical
    signsLabel: string;    // heading for the "signs" list
    signs: string[];       // warning signs / when it applies
    response: string[];    // immediate response steps (last item may be CRITICAL)
}

export const HAZARD_EMERGENCIES: HazardEmergency[] = [
    {
        key: 'heat', icon: '🌡️', title: 'Heat Stress',
        danger: 'The body starts shutting down and cannot recover without help.',
        signsLabel: 'SYMPTOMS TO MONITOR (every 2 hours)',
        signs: HEAT_STRESS_SYMPTOMS,
        response: EMERGENCY_RESPONSE,
    },
    {
        key: 'cold', icon: '❄️', title: 'Cold Stress / Hypothermia',
        danger: 'Hypothermia and frostbite develop silently — judgment fails before the body does.',
        signsLabel: 'SYMPTOMS TO MONITOR',
        signs: [
            'Uncontrollable shivering — then shivering STOPS (danger sign)',
            'Numb, waxy, white or grey skin (frostbite)',
            'Slurred speech, clumsiness, confusion',
            'Drowsiness or extreme exhaustion',
        ],
        response: [
            'Move to a heated shelter immediately',
            'Remove wet clothing; wrap in dry blankets',
            'Warm the core first (chest, neck, groin) — not the hands/feet',
            'Give warm sweet drinks only if fully conscious',
            'Do NOT rub frostbitten skin',
            'FOR NO SHIVERING / UNCONSCIOUS: handle gently — GET IMMEDIATE MEDICAL CARE',
        ],
    },
    {
        key: 'wind', icon: '💨', title: 'High Wind',
        danger: 'High wind topples lifts and scaffolds and turns loose material into projectiles.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Gusts making footing or balance difficult',
            'Suspended loads swinging / crane in-service limits reached',
            'Dust storm reducing visibility',
            'Loose sheeting, netting or tools starting to lift',
        ],
        response: [
            'Stop crane, MEWP and all working-at-height operations',
            'Land and secure suspended loads',
            'Secure or remove loose materials and light structures',
            'Move crews clear of scaffolds, signage and temporary structures',
            'Resume only when sustained wind AND gusts fall below limits',
        ],
    },
    {
        key: 'rain', icon: '🌧️', title: 'Heavy Rain / Flooding',
        danger: 'Heavy rain floods excavations, collapses trench walls and creates electrocution hazards.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Water pooling in or near excavations / trenches',
            'Ground becoming soft, slippery or unstable',
            'Reduced visibility for plant and traffic',
            'Water reaching live electrical equipment / temporary supplies',
        ],
        response: [
            'Evacuate excavations and trenches — risk of collapse',
            'De-energise exposed temporary electrical equipment',
            'Stop earthworks, hot works and road operations',
            'Move crews to a safe, dry muster point',
            'Inspect ground and shoring before resuming',
        ],
    },
    {
        key: 'thunder', icon: '⛈️', title: 'Thunderstorm / Lightning',
        danger: 'Lightning kills instantly and can strike up to 10 km from the storm — before the rain arrives.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Thunder heard — any thunder means lightning is in range',
            'Flash-to-bang under 30 seconds (≈10 km away)',
            'Towering dark cloud build-up, sudden wind shift',
            'Hair standing on end or buzzing metal (imminent strike)',
        ],
        response: [
            'Apply the 30-30 rule: suspend work when flash-to-bang < 30 s',
            'Get off elevated ground; leave cranes, scaffolds and roofs',
            'Shelter in a hard-roofed vehicle or building — never under trees',
            'Avoid metal, water and open ground',
            'Resume only 30 minutes after the last thunder',
        ],
    },
    {
        key: 'solar', icon: '☀️', title: 'Solar Radiation / UV',
        danger: 'Prolonged solar radiation causes burns, dehydration, heat load and long-term skin damage.',
        signsLabel: 'WARNING SIGNS',
        signs: [
            'Intense midday sun / high UV index',
            'Reddening skin or sunburn on exposed areas',
            'Glare reducing visibility',
            'Rising solar heat load adding to WBGT',
        ],
        response: [
            'Provide and use shade for rest and fixed tasks',
            'Cover exposed skin; apply SPF 30+ sunscreen',
            'Wear UV-rated eye protection',
            'Increase hydration and rest frequency',
            'Reschedule sustained tasks away from the solar peak (10:00–15:00)',
        ],
    },
];

// ════════════════════════════════════════════════════════════════════════════
//  FORECAST LOOKAHEAD — next hour / day / days
//  Scans an hourly forecast window and reports the first time each hazard is
//  predicted to cross its warning/danger threshold, plus the peak severity.
//  The scan itself lives in the plugin (it needs the user's thresholds & PPE);
//  this is the shared shape used by the dashboard card and the weekly report.
// ════════════════════════════════════════════════════════════════════════════

export interface HazardForecast {
    hazard: 'heat' | 'wind' | 'rain' | 'thunder' | 'cold' | 'solar';
    icon: string;
    label: string;              // hazard name, e.g. "Heat"
    willExceed: boolean;        // true if a threshold is crossed in the window
    firstISO: string | null;    // ISO timestamp of the first exceedance
    firstLocal: string | null;  // human-friendly local time of first exceedance
    hoursAway: number | null;   // whole hours from now to first exceedance
    peakLabel: string;          // worst risk label reached in the window (e.g. RED)
    peakColor: string;          // colour for that peak label
}
