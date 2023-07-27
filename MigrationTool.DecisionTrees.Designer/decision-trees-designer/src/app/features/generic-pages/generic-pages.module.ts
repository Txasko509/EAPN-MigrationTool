import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageNotAuthorizedComponent } from './page-not-authorized/page-not-authorized.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    PageNotAuthorizedComponent
  ],
  imports: [
    CommonModule, FlexLayoutModule, TranslateModule
  ]
})
export class GenericPagesModule { }
