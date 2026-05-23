import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '2.1.4',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description: 'Real-time HSE safety monitor. Heat stress zones (ISO 7243/7933), wind & rain alerts, multi-model worst-case engine, ISO 7933 weekly reports.',
    author: 'FieldGuard HSE',
    // Same pattern as SoarCalc and the official airspace example:
    // embedded = stays open, plain div, we control CSS position
    // small = bottom strip on mobile, Windy controls placement
    desktopUI: 'embedded',
    mobileUI: 'small',
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    addToContextmenu: true,
};

export default config;
