import { HostListener, Injectable } from '@angular/core';
import { OAuthEvent, OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../oauth.config';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUserInfo } from '@shared/auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends OAuthService {
  private readonly AUTH_REDIRECT_URI_STORAGE_KEY = 'mship-design_authRedirectUri';
  private readonly AUTH_DATA_UPDATED_STORAGE_KEY = 'mship-design_authDataUpdated';
  private readonly AUTH_SILENT_REFRESH_LOCK = 'mship-design_authSilentRefreshLock';

  private lastUpdateToken?: string;

  private readonly isAuthenticatedSubject = new BehaviorSubject(false);
  private readonly userInfoSubject = new BehaviorSubject<AuthUserInfo | undefined>(undefined);
  private readonly userRolesSubject = new BehaviorSubject<string[]>([]);

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userInfo$(): Observable<AuthUserInfo | undefined> {
    return this.userInfoSubject.asObservable();
  }

  get userRoles$(): Observable<string[]> {
    return this.userRolesSubject.asObservable();
  }

  @HostListener('storage', ['$event'])
  private checkAuth(event: StorageEvent) {
    if ((event.key === this.AUTH_DATA_UPDATED_STORAGE_KEY && event.newValue !== null) || event.key === null) {
      this.isAuthenticatedSubject.next(this.hasValidAccessToken());
      if (!this.hasValidAccessToken()) {
        this.initLoginFlow();
      }
    }
  }

  initialize() {
    this.configure(authCodeFlowConfig);
    this.subscribeEvents();
    this.setupAutomaticSilentRefresh();
    this.loadDiscoveryDocumentAndLogin({ disableNonceCheck: true }).then(async (loaded) => {
      const login = loaded && this.hasValidAccessToken() && this.hasValidIdToken();
      this.lastUpdateToken = this.hasValidAccessToken() ? this.getAccessToken() : undefined;

      this.isAuthenticatedSubject.next(login);
      if (login) {
        const userProfileRaw = await this.loadUserProfile();
        const userProfile = 'info' in userProfileRaw ? (userProfileRaw['info'] as AuthUserInfo) : undefined;
        this.userInfoSubject.next(userProfile);
        this.userRolesSubject.next(userProfile?.groups ?? []);
        const redirectUri = localStorage.getItem(this.AUTH_REDIRECT_URI_STORAGE_KEY);
        if (redirectUri) {
          localStorage.removeItem(this.AUTH_REDIRECT_URI_STORAGE_KEY);
          if (!location.href.startsWith(redirectUri)) {
            location.href = redirectUri;
          }
        }
      } else {
        localStorage.setItem(this.AUTH_REDIRECT_URI_STORAGE_KEY, location.pathname + location.search);
        return this.initLoginFlow();
      }
      return new Promise<void>((resolve, reject) => (login ? resolve() : reject));
    });
  }

  override async silentRefresh(params?: object, noPrompt?: boolean): Promise<OAuthEvent> {
    return await navigator.locks.request(this.AUTH_SILENT_REFRESH_LOCK, async () => {
      if (this.lastUpdateToken === this.getAccessToken()) {
        return await super.silentRefresh(params, noPrompt);
      }
      this.eventsSubject.next(new OAuthSuccessEvent('token_received'));
      this.eventsSubject.next(new OAuthSuccessEvent('token_refreshed'));
      const event = new OAuthSuccessEvent('silently_refreshed');
      this.eventsSubject.next(event);
      this.lastUpdateToken = this.getAccessToken();
      return event;
    });
  }

  override hasValidIdToken() {
    if (this.getIdToken()) {
      const expiresAt = this._storage.getItem('id_token_expires_at');
      const now = this.dateTimeService.new();
      return !(expiresAt && Number.parseInt(expiresAt, 10) < now.getTime());
    }
    return false;
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
          this.isAuthenticatedSubject.next(this.hasValidAccessToken());
        }),
      )
      .subscribe();
  }
}
