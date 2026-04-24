import { EnvironmentInterface } from './environment.interface';

export default {
  baseUrl: '.',
  scraperBaseUrl: './api/scraper',
  auth: {
    issuer: 'https://auth.mooslechner.dev/application/o/tech-atlas/',
    clientId: 'NjrD7i3pcLYKUPRlzdCpqLJGlbUwCq2DPY9ceeIh',
    responseType: 'code',
    scope: 'openid profile email offline_access api',
  },
} satisfies EnvironmentInterface;
