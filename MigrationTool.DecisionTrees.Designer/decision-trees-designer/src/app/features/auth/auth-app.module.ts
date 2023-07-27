import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared/shared.module';
import { LogInComponent } from './log-in/log-in.component';

@NgModule({
  declarations: [
    LogInComponent
  ],
  imports: [
    CommonModule, SharedModule
  ]
})
export class AuthAppModule { }
