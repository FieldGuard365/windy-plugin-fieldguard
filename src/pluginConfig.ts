import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '1.1.0',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description:
        'Real-time HSE safety monitor for field workers. Heat stress zones (ISO 7243/7933), wind & rain alerts, worst-case multi-model engine, ISO 7933 weekly reports.',
    author: 'FieldGuard HSE',
    desktopUI: 'rhpane',
    mobileUI: 'small',
    desktopWidth: 260,
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    addToContextmenu: true,
};

export default config;
