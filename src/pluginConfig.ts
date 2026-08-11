import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '3.0.9',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description:
        'Real-time HSE safety monitor for outdoor crews. Six site hazards on one pin — heat stress (WBGT), cold (wind chill), wind, rain, storm/lightning and solar/UV — across all Windy models, with a worst-case engine, configurable thresholds and 24/7 email alerts (browser closed). Site tier adds real-time lightning strike stop-work rings, Forecast Watch lookahead, and one-click ISO 7933 / FIDIC 8.4 audit reports.',
    author: 'FieldGuard HSE',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    hooks: 'contextmenu',
};

export default config;
