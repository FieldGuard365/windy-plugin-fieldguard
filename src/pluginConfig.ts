import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '2.1.6',
    icon: '🛡️',
    title: 'FieldGuard — HSE Field Safety',
    description: 'Real-time HSE safety monitor. Heat stress zones (ISO 7243/7933), wind & rain alerts, multi-model worst-case engine, ISO 7933 weekly reports.',
    author: 'FieldGuard HSE',
    repository: 'https://github.com/FieldGuard365/windy-plugin-fieldguard',
    desktopUI: 'embedded',
    mobileUI: 'small',
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
    addToContextmenu: true,
};

export default config;
