import { AuthConfig } from 'angular-oauth2-oidc';
import { isDevMode } from '@angular/core';
import { getAuthSettings } from './runtime-config';

// A function, not a constant: issuer and client id are only known once config.json is loaded.
export const createAuthCodeFlowConfig = (): AuthConfig => ({
  ...getAuthSettings(),
  redirectUri: globalThis.location.origin,
  showDebugInformation: isDevMode(),
  options: {
    disableNonceCheck: !isDevMode(),
  },
  strictDiscoveryDocumentValidation: false,
});
