import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private translate: TranslateService, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    if(translate.store.langs.length == 0){
      translate.addLangs(storage.get("langs"));
      translate.use(storage.get('default-lang'));
    }
  }

  ngOnInit(): void {
  }
}
