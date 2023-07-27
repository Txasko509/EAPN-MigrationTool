import { inject, InjectionToken } from '@angular/core';
import { OAuthModuleConfig } from 'angular-oauth2-oidc';
import { AppConfigService } from 'src/app/app.config.service';

export const authModuleConfig = new InjectionToken<OAuthModuleConfig>('OAuth Module Configuration', {
  providedIn: 'root',
  factory: () => {
    return {
      resourceServer: {
        allowedUrls: [ "http://localhost:5000" /*inject(AppConfigService).apiEndpoint*/, /*inject(AppConfigService).issuer*/"http://localhost:10000" ],
        sendAccessToken: true,
      }
    }
  }
}); 



