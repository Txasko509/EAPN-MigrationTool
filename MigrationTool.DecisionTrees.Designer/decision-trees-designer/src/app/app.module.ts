import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HomeModule } from './features/home/home.module';
import { DecisionTreesModule } from './features/decision-trees/decision-trees.module';
import { AppToasterService } from 'src/core/services/app-toaster.service';
import { SpinnerService } from 'src/core/services/spinner.service';
import { ErrorModule } from 'src/core/error/error.module';
import { SharedModule } from 'src/shared/shared.module';
import { HttpInterceptorService } from 'src/core/interceptors/httpinterceptor-service';
import { GenericPagesModule } from './features/generic-pages/generic-pages.module';
import { AppConfigService } from './app.config.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

registerLocaleData(localeEs, 'es');

export function appConfigInit(appConfigService: AppConfigService) {
  return () => {
    return appConfigService.load()
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ErrorModule,
    GenericPagesModule,
    SharedModule,
    HomeModule,
    DecisionTreesModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [AppToasterService, SpinnerService, { provide: LOCALE_ID, useValue: 'es-ES' }, 
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  },
  {
    provide: APP_INITIALIZER,
    useFactory: appConfigInit,
    multi: true,
    deps: [AppConfigService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
