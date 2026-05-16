/**
 * FieldGuard HSE Calculations — v2.0
 *
 * Standard: ISO 7933:2004 / ISO 7243:2017
 *
 * Core method: 2-step Apparent Temperature lookup
 *   Step 1: Temp (°C) + Humidity (%) → Apparent Temp (°C) [Chart A]
 *   Step 2: Apparent Temp + Wind (m/s) → Final Apparent Temp [Chart B]
 *   Output zone: Green / Amber / Red / Purple / Black (No Work)
 *
 * Zone thresholds and work/rest schedules per ISO 7243 field standard.
 * Work ban: 12:30–15:30, June/July/August (outdoor workers).
 * Stop work when temp exceeds 50°C ambient (when monitor unavailable).
 */

export interface WeatherInputs {
    tempC: number;
    humidity: number;   // %
    windMs: number;     // m/s
    solarWm2: number;   // W/m²
    rainMmH: number;    // mm/h
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

// Zones from ISO 7243 / field standard
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

// ─── Chart A: Temp × Humidity → Apparent Temp ─────────────────────────────────
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

// ─── Chart B: Apparent Temp × Wind → Final Apparent Temp ──────────────────────
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
): HeatAssessment {
    const appTemp1 = calcApparentTemp(inputs.tempC, inputs.humidity);
    const appTempFinal = calcFinalApparentTemp(appTemp1, inputs.windMs);
    const zone = apparentTempToZone(appTempFinal, inputs.tempC);
    const zoneInfo = ZONES[zone];
    const wbgtBase = calcWBGT(inputs);
    const wbgtAdj = calcAdjustedWBGT(wbgtBase, ppeKey);
    const heatIdx = calcHeatIndex(inputs.tempC, inputs.humidity);
    // Legal work ban: 12:30–15:30, June/July/August
    const isBanPeriod = [6, 7, 8].includes(month) && localHour >= 12.5 && localHour < 15.5;
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

// ─── Symptom & Emergency reference (ISO 7243) ─────────────────────────────────
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
