import { EnvironmentInterface } from './environment.interface';

export default {
  baseUrl: '.',
  scraperBaseUrl: '/api/scraper',
  transformerBaseUrl: '/api/transformer',
  auth: {
    issuer: 'http://localhost:7000/default',
    clientId: 'NjrD7i3pcLYKUPRlzdCpqLJGlbUwCq2DPY9ceeIh',
    responseType: 'code',
    scope: 'openid profile email offline_access api entitlements',
  },
} satisfies EnvironmentInterface;
