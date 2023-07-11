import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DecisionTreeCreateComponent } from './decision-tree-create/decision-tree-create.component';
import { DecisionTreeListComponent } from './decision-tree-list/decision-tree-list.component';
import { SharedModule } from 'src/shared/shared.module';
import { DecisionTreeDesignerComponent } from './designer/decision-tree-designer/decision-tree-designer.component';
import { QuestionChoicesComponent } from './designer/question-choices/question-choices.component';
import { ChoiceComponent } from './designer/choice/choice.component';
import { TextEditorComponent } from './designer/text-editor/text-editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DecisionTreePreviewerComponent } from './previewer/decision-tree-previewer/decision-tree-previewer.component';
import { DecisionTreesFilterComponent } from './shared/decision-trees-filter/decision-trees-filter.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { UtcToLocalTimePipe } from 'src/core/pipes/utc-to-local-time.pipe';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxLeaderLineModule } from 'ngx-leader-line';
import { DecisionTreeEditComponent } from './decision-tree-edit/decision-tree-edit.component';
import { TooltipModule } from 'src/shared/components/tooltip/tooltip.module';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMM'
  }
};

@NgModule({
  declarations: [
    DecisionTreeCreateComponent,
    DecisionTreeListComponent,
    DecisionTreeDesignerComponent,
    QuestionChoicesComponent,
    ChoiceComponent,
    TextEditorComponent,
    DecisionTreePreviewerComponent,
    DecisionTreesFilterComponent,
    DecisionTreeEditComponent
  ],
  imports: [
    CommonModule, SharedModule, EditorModule, NgxLeaderLineModule, TooltipModule
  ],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, DatePipe, UtcToLocalTimePipe]
})
export class DecisionTreesModule { }
