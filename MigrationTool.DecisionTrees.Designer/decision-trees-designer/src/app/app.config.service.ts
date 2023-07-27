import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
  public version!: string;
  public apiEndpoint!: string;
  public issuer!: string;
  public requireHttps!: boolean;
  public tinyMceApiKey!: string;

	constructor(private http: HttpClient) {}

		load() :Promise<any>  {
      const promise = this.http.get('/assets/app.config.json')
        .toPromise()
        .then(data => {
          Object.assign(this, data);
          return data;
        });

      return promise;
  }
}