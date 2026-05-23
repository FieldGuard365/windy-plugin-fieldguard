import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '2.1.2',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description: 'Real-time HSE safety monitor. Heat stress zones (ISO 7243/7933), wind & rain alerts, multi-model worst-case engine, ISO 7933 weekly reports.',
    author: 'FieldGuard HSE',
    desktopUI: 'rhpane',
    mobileUI: 'small',
    desktopWidth: 280,
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    addToContextmenu: true,
};

export default config;
