import { Injectable } from '@angular/core';
import { OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../oauth.config';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends OAuthService {
  private readonly AUTH_REDIRECT_URI_STORAGE_KEY = 'mship-design_authRedirectUri';

  lastUpdateToken?: string;

  isAuthenticated$ = new BehaviorSubject(false);
  userProfile$ = new BehaviorSubject<UserInfo | undefined>(undefined);
  userRoles$ = new BehaviorSubject<string[]>([]);

  initialize() {
    this.setupAutomaticSilentRefresh();
    this.configure(authCodeFlowConfig);
    this.loadDiscoveryDocumentAndLogin().then(async (loaded) => {
      const login = loaded && this.hasValidAccessToken();
      this.lastUpdateToken = this.hasValidAccessToken() ? this.getAccessToken() : undefined;
      this.isAuthenticated$.next(login);
      if (login) {
        const userProfile = (await this.loadUserProfile()) as UserInfo;
        this.userProfile$.next(userProfile);
        this.userRoles$.next(this.getUserRoles(userProfile));
        const redirectUri = localStorage.getItem(this.AUTH_REDIRECT_URI_STORAGE_KEY);
        if (redirectUri) {
          localStorage.removeItem(this.AUTH_REDIRECT_URI_STORAGE_KEY);
          if (!location.href.startsWith(redirectUri)) {
            location.href = redirectUri;
          }
        }
      } else {
        localStorage.setItem(this.AUTH_REDIRECT_URI_STORAGE_KEY, location.pathname + location.search);
      }
      return new Promise<void>((resolve, reject) => (login ? resolve() : reject));
    });

    this.subscribeEvents();
  }

  private getUserRoles(userInfo?: UserInfo): string[] {
    const groups = userInfo?.['info']?.['groups'];
    return groups ?? [];
  }

  private subscribeEvents() {
    this.events
      .pipe(
        tap((oAuthEvent) => {
          switch (oAuthEvent.type) {
            case 'session_terminated':
            case 'session_error':
              this.initLoginFlow();
              break;
            case 'code_error':
              localStorage.removeItem(this.AUTH_REDIRECT_URI_STORAGE_KEY);
              break;
          }
          this.isAuthenticated$.next(this.hasValidAccessToken());
        }),
      )
      .subscribe();
  }
}
