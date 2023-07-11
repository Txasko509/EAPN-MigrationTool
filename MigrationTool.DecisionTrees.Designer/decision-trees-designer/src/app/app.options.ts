import { NgxConfigureOptions } from 'ngx-configure';

export class AppOptions extends NgxConfigureOptions {
  override ConfigurationURL = 'assets/appconfig.json';
  override AppVersion = '0.0.0';
  override BustCache = false;
}