import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../transloco-loader';
import { providePrimeNG } from 'primeng/config';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { Preset } from './preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideTransloco({
      config: {
        availableLangs: [
          { id: 'en', label: '🇬🇧 English' },
          { id: 'de', label: '🇦🇹 Deutsch' },
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: {
          logMissingKey: true,
        },
      },
      loader: TranslocoHttpLoader,
    }),
    providePrimeNG({
      theme: {
        preset: Preset,
        options: { darkModeSelector: '.app-dark-mode' },
      },
    }),
    provideOAuthClient({
      resourceServer: {
        sendAccessToken: true,
        allowedUrls: ['./api/'],
      },
    }),
  ],
};
