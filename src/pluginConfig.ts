import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-fieldguard',
    version: '2.1.5',
    icon: '🧪',
    title: 'FieldGuard TEST',
    description: 'Diagnostic test build — not for production.',
    author: 'FieldGuard HSE',
    repository: 'https://github.com/FieldGuard365/windy-plugin-fieldguard',
    desktopUI: 'embedded',
    mobileUI: 'small',
    routerPath: '/fieldguard/:lat?/:lon?',
    listenToLocationChange: true,
};

export default config;
