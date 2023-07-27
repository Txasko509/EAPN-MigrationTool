import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthConfig, OAuthModule, OAuthModuleConfig, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { authConfig } from './auth-config';
import { authModuleConfig } from './auth-module.config';

// We need a factory since localStorage is not available at AOT build time
export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: AuthConfig, useExisting: authConfig},
        { provide: OAuthModuleConfig, useExisting: authModuleConfig }, 
        { provide: OAuthStorage, useFactory: storageFactory },
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error('AuthModule is already loaded. Import it in the AppModule only');
    }
  }
}