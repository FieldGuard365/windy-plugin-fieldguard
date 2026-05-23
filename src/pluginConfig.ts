import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '2.1.1',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description:
        'Real-time HSE safety monitor for field workers. Heat stress zones (ISO 7243/7933), wind & rain alerts, worst-case multi-model engine, ISO 7933 weekly reports.',
    author: 'FieldGuard HSE',
    desktopUI: 'embedded',  // floating bottom-left, stays open, we control position
    mobileUI: 'small',      // Windy puts at bottom of screen as strip
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    addToContextmenu: true,
};

export default config;
