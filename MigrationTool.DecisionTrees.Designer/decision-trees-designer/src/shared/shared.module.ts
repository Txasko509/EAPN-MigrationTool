import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyCustomPaginatorIntl, SharedStaticTableComponent } from './components/shared-static-table/shared-static-table.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import { UtcToLocalTimePipe } from '../core/pipes/utc-to-local-time.pipe';
import { TooltipModule } from './components/tooltip/tooltip.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
    SharedTableComponent,
    SharedStaticTableComponent,
    UtcToLocalTimePipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule, 
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    HeaderComponent, 
    FooterComponent,
    FormsModule, 
    ReactiveFormsModule,
    SharedTableComponent,
    SharedStaticTableComponent,
    UtcToLocalTimePipe
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}
  ]
})
export class SharedModule { }