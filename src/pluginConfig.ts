import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '1.0.2',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description:
        'Real-time HSE safety monitor for field workers. Calculates Heat Index (WBGT), Wind & Rain alerts across all Windy models. Worst-case scenario engine, customizable thresholds, and ISO 7933-compliant weekly PDF reports.',
    author: 'FieldGuard HSE',
    desktopUI: 'rhpane',
    mobileUI: 'small',
    desktopWidth: 300,
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    hooks: ['menu', 'contextmenu'],
};

export default config;
