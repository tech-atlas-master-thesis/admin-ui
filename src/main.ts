import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { loadRuntimeConfig } from './app/runtime-config';

// The OIDC settings have to be known before the app (and with it the login) starts.
loadRuntimeConfig()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
