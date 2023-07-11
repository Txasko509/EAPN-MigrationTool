import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule, FlexLayoutModule, TranslateModule, SharedModule
  ],
  exports: [ErrorComponent]
})
export class ErrorModule { }

