import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../transloco-loader';
import { providePrimeNG } from 'primeng/config';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { Preset } from './preset';
import { errorInterceptor } from '@shared/error/error.interceptor';
import { API_BASE_URL } from '@api/service/api-base-url.token';
import environment from '../environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withXhr(), withInterceptorsFromDi(), withInterceptors([errorInterceptor])),
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
    {
      provide: API_BASE_URL,
      useValue: environment.baseUrl + environment.adminBackendBaseUrl,
    },
  ],
};
