import { EnvironmentInterface } from './environment.interface';

export default {
  baseUrl: '.',
  scraperBaseUrl: './api/scraper',
  auth: {
    issuer: 'http://localhost:9000/application/o/tech-atlas/',
    clientId: 'NjrD7i3pcLYKUPRlzdCpqLJGlbUwCq2DPY9ceeIh',
    responseType: 'code',
    scope: 'openid profile email offline_access api',
  },
} satisfies EnvironmentInterface;
