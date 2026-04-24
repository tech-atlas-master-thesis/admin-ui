import { AuthConfig } from 'angular-oauth2-oidc';
import { isDevMode } from '@angular/core';
import environment from '../environment/environment';

export const authCodeFlowConfig: AuthConfig = {
  ...environment.auth,
  redirectUri: globalThis.location.origin,
  showDebugInformation: isDevMode(),
  options: {
    disableNonceCheck: !isDevMode(),
  },
  strictDiscoveryDocumentValidation: false,
};
