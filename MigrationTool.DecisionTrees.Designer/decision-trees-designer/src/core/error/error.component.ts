// ------------------------------------------------------------------------------
// Import Angular libs
// ------------------------------------------------------------------------------
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  constructor(private translate: TranslateService,
     @Inject(LOCAL_STORAGE) private storage: WebStorageService) { 
    if(translate.store.langs.length == 0){
      translate.addLangs(storage.get("langs"));
      translate.use(storage.get('default-lang'));
    }
  }

  ngOnInit(): void {  
  }
}
