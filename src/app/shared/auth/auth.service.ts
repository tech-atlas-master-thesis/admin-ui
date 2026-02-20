import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../oauth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends OAuthService {
  async initialize() {
    this.configure(authCodeFlowConfig);
    this.loadDiscoveryDocumentAndTryLogin().then(async (loaded) => console.log(loaded));
  }
}
