import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '2.0.0',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description:
        'Real-time HSE safety monitor for field workers. Heat stress zones (ISO 7243/7933), wind & rain alerts, worst-case multi-model engine, ISO 7933 weekly reports.',
    author: 'FieldGuard HSE',
    desktopUI: 'rhpane',   // top-left transparent panel — doesn't push map
    mobileUI: 'small',     // top strip under search bar
    desktopWidth: 270,
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    hooks: 'contextmenu',
};

export default config;
