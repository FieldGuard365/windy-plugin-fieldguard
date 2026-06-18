import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '3.0.4',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description:
        'Real-time HSE safety monitor for field workers. Heat stress (WBGT), cold stress (wind chill), wind, rain and thunderstorm/lightning risk across all Windy models. Metric or imperial units (°C/°F, m/s/mph), worst-case engine, customizable thresholds, and ISO 7933-compliant weekly reports.',
    author: 'FieldGuard HSE',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    hooks: 'contextmenu',
};

export default config;
