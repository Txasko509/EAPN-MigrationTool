import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DecisionTreeCreateComponent } from '../decision-tree-create/decision-tree-create.component';
import { FormGroup } from '@angular/forms';
import { ActionEvent, Column } from 'src/shared/components/shared-static-table/shared-static-table.component';
import { SortParams } from 'src/core/interfaces/shared/table-params';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from 'src/core/services/spinner.service';
import { DecisionTreeService } from 'src/core/services/decision-tree.service';
import { AppToasterService } from 'src/core/services/app-toaster.service';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { DecisionTree } from 'src/core/interfaces/decision-tree';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent, DialogModel } from 'src/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { DecisionTreeEditComponent } from '../decision-tree-edit/decision-tree-edit.component';

@Component({
  selector: 'app-decision-tree-list',
  templateUrl: './decision-tree-list.component.html',
  styleUrls: ['./decision-tree-list.component.scss']
})
export class DecisionTreeListComponent implements OnInit {
  filterFormGroup!: FormGroup;

  dataSource: MatTableDataSource<DecisionTree>;

  columns!: Column[];
  sort!: SortParams;

  constructor(private dialog: MatDialog, private decisionTreeService: DecisionTreeService, private spinnerService: SpinnerService,
    private appToasterService: AppToasterService, public translate: TranslateService, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    this.filterFormGroup = new FormGroup({});

    this.dataSource = new MatTableDataSource();

    this.sort = {
      active: "name",
      direction: "asc"
    };

    this.columns = [];

    this.createTable();
  }

  async createTable(): Promise<void> {
    await this.translate.get(this.storage.get('default-lang')).toPromise();

    var self = this;
    self.columns = [
      { id: 'id', label: this.translate.instant('DECISION-TREES.LIST.LABEL-IDREF'), hideOrder: 1, sortable: true, width: 100 },
      { id: 'date', label: this.translate.instant('DECISION-TREES.LIST.LABEL-DATE'), hideOrder: 2, type: 'date', sortable: true },
      { id: 'name', label: this.translate.instant('DECISION-TREES.LIST.LABEL-NAME'), hideOrder: 0, isAction: false, sortable: true },
      {
        id: 'action', label: '', hideOrder: 3, isAction: true, actions: [
          { name: 'edit', icon: 'edit', color: 'primary', toolTip: this.translate.instant('DECISION-TREES.LIST.TEXT-TOOLTIP-BTN-EDIT') },
          { name: 'remove', icon: 'delete', color: 'warn', toolTip: this.translate.instant('DECISION-TREES.LIST.TEXT-TOOLTIP-BTN-REMOVE') }]
      }
    ];
  }

  ngOnInit(): void {
    //this.loadDecisionTrees();
    this.onCreateDecisionTreeClick();
  }

  onChangeFilter(): void {
    this.loadDecisionTrees();
  }

  onCreateDecisionTreeClick() {
    const dialogRef = this.dialog.open(DecisionTreeCreateComponent, {
      data: {},
      maxWidth: '98vw',
      width: '98%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === null) return;

      if (result === true) {
        this.appToasterService.success(this.translate.instant('DECISION-TREES.LIST.TEXT-DECISION-TREE-CREATE-SUCCESS'), "Crear árbol de decisión");

        // Refresh
        this.loadDecisionTrees();
      }
      else {
        this.appToasterService.error(this.translate.instant('DECISION-TREES.LIST.TEXT-DECISION-TREE-CREATE-ERROR'), "Crear árbol de decisión");
      }
    });
  }

  onEditDecisionTreeClick(id: number) {
    this.spinnerService.display(true);

    this.decisionTreeService.get(id)
      .subscribe((result: any) => {
        this.spinnerService.display(false);

        const dialogRef = this.dialog.open(DecisionTreeEditComponent, {
          data: { decisionTree: result },
          maxWidth: '98vw',
          width: '98%'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === undefined || result === null) return;

          if (result === true) {
            this.appToasterService.success(this.translate.instant('DECISION-TREES.LIST.TEXT-DECISION-TREE-EDIT-SUCCESS'), "Actualizar árbol de decisión");

            // Refresh
            this.loadDecisionTrees();
          }
          else {
            this.appToasterService.error(this.translate.instant('DECISION-TREES.LIST.TEXT-DECISION-TREES-EDIT-ERROR'), "Actualizar árbol de decisión");
          }
        });

      }, (error: any) => console.error(error));
  }

  onRemoveDecisionTreeClick(id: number) {
    const message = this.translate.instant('DECISION-TREES.LIST.DIALOG-DESC-REMOVE');

    const dialogData = new DialogModel(this.translate.instant('DECISION-TREES.LIST.DIALOG-TITLE-REMOVE'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      var result = dialogResult;

      if (result === true) {
        this.spinnerService.display(true);

        this.decisionTreeService.remove(id)
          .subscribe({
            next: (data: boolean) => {
              this.spinnerService.display(false);

              if (data === true) {
                this.appToasterService.success(this.translate.instant('DECISION-TREES.LIST.TEXT-DECISION-TREE-REMOVE-SUCCESS'), "Eliminar árbol de decisión");

                this.loadDecisionTrees();
              }
              else {
                this.appToasterService.error(this.translate.instant('DECISION-TREES.LIST.TEXT-DECISION-TREE-REMOVE-ERROR'), "Eliminar árbol de decisión");
              }
            },
            error: (error: any) => {
              this.spinnerService.display(false);
            }
          });
      }
    });
  }

  onActionClick(actionEvent: ActionEvent) {
    if (actionEvent.action.name === 'edit') {
      this.onEditDecisionTreeClick(actionEvent.id);
    }
    else if (actionEvent.action.name === 'remove') {
      this.onRemoveDecisionTreeClick(actionEvent.id);
    }
  }

  private loadDecisionTrees() {
    this.spinnerService.display(true);

    this.decisionTreeService.search<DecisionTree>(
      this.filterFormGroup.get("from")?.value !== '' ? this.filterFormGroup.get("from")?.value : null,
      this.filterFormGroup.get("to")?.value !== '' ? this.filterFormGroup.get("to")?.value : null,
      {
        searchText: this.filterFormGroup.get("searchText")?.value,
        sort: {
          active: this.sort.active,
          direction: this.sort.direction
        }
      }
    )
      .subscribe((result: DecisionTree[]) => {
        this.dataSource.data = result;

        this.spinnerService.display(false);
      }, (error: any) => console.error(error));
  }
}
