import { inject, InjectionToken } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { AppConfigService } from 'src/app/app.config.service';

export const authConfig = new InjectionToken<AuthConfig>('Auth Configuration', {
  providedIn: 'root',

  factory: () => {

    return {
      issuer: "http://localhost:10000", //inject(AppConfigService).issuer,
      redirectUri: window.location.origin,
      clientId: 'angularclient',
      responseType: 'code',
      oidc: false,
      //logoutUrl: window.location.origin,
      scope: 'openid profile roles decisiontrees.api',
      tokenEndpoint : /*inject(AppConfigService).issuer*/ "http://localhost:10000" + "/connect/token-by-password",
      userinfoEndpoint : /*inject(AppConfigService).issuer*/ "http://localhost:10000" + "/connect/userinfo",
      requireHttps : /*inject(AppConfigService).requireHttps,*/ false,
      useSilentRefresh: true,
      silentRefreshRedirectUri: window.location.origin,
    }
  }
}); 
