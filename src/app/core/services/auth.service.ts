import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { defer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private socialAuthService: SocialAuthService,
  ) {
  }

  loginWithOAuth(): Observable<SocialUser> {
    const observableDefer$ = defer(() => this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID));
    return observableDefer$;
  }

  logoutOAuth(): Observable<void> {
    const observableDefer$ = defer(() => this.socialAuthService.signOut());
    return observableDefer$;
  }

  getAuthState(): Observable<SocialUser> {
    return this.socialAuthService.authState;
  }

}
