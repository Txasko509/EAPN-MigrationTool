import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { SpinnerService } from 'src/core/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'decision-trees-designer';
  showSpinner: boolean = false;

  constructor(private spinnerService: SpinnerService, public translate: TranslateService, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    if (!storage.get("langs")) {
      storage.set("langs", ['es', 'en']);
    }
    if (!storage.get('default-lang')) {
      let browserLang = translate.getBrowserLang();
      const defaultLang = browserLang !== undefined && browserLang.match(/es|en/) ? browserLang : 'es';

      this.storage.set("default-lang", defaultLang);
    }

    translate.addLangs(storage.get("langs"));
    translate.use(storage.get('default-lang'));
  }

  ngOnInit() {
    this.spinnerService.status.subscribe((val: boolean) => {
      this.showSpinner = val;
    });
  }
}
