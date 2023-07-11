import { animate, state, style, transition, trigger } from '@angular/animations';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';

export interface ActionEvent {
  id: number;
  action: Action;
}

export interface Action {
  name: string;
  icon: string;
  color: string;
  toolTip?: string;
  actionHideCallback?: Function;
  hide?: boolean;
}

export interface Column {
  id: string;
  visible?: boolean;
  label: string;
  hideOrder: number;
  width?: number;
  type?: string;
  isAction?: boolean;
  actions?: Action[];
  actionsHideCallback?: Function;
  sortable?: boolean;
  align?: string;
  columnStyle?: string;
  cellStyle?: string;
  columnIcon?: string;
  toolTip?: string;
  tooltipCallback?: Function;
  dateFormat?: string;
}

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = 'Primera página';
  itemsPerPageLabel = 'Registros por página:';
  lastPageLabel = 'Última página';

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Página siguiente';
  previousPageLabel = 'Página anterior';

  constructor(public translate: TranslateService) {
    this.firstPageLabel = this.translate.instant('SHARED.PAGINATOR.LABEL-FIRST-PAGE');
    //this.itemsPerPageLabel = this.translate.instant('SHARED.PAGINATOR.LABEL-ITEMS-PER-PAGE');
    this.lastPageLabel = this.translate.instant('SHARED.PAGINATOR.LABEL-LAST-PAGE');
    this.nextPageLabel = this.translate.instant('SHARED.PAGINATOR.LABEL-NEXT-PAGE');
    this.previousPageLabel = this.translate.instant('SHARED.PAGINATOR.LABEL-PREVIOUS-PAGE');
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return this.translate.instant('SHARED.PAGINATOR.LABEL-PAGE-1');
    }
    const amountPages = Math.ceil(length / pageSize);
    return this.translate.instant('SHARED.PAGINATOR.LABEL-PAGE') + " " + (page + 1) + " " + this.translate.instant('SHARED.PAGINATOR.LABEL-OF') + " " + amountPages + ". " + this.translate.instant('SHARED.PAGINATOR.LABEL-TOTAL-RECORDS') + ": " + length;
  }
}

@Component({
  selector: 'app-shared-static-table',
  templateUrl: './shared-static-table.component.html',
  styleUrls: ['./shared-static-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SharedStaticTableComponent implements AfterContentInit, AfterViewInit, OnDestroy, OnInit {
  public MIN_COLUMN_WIDTH: number = 200;

  // Visible Hidden Columns
  visibleColumns: Column[] = [];
  hiddenColumns: Column[] = [];
  expandedElement = [];

  @Input()
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  @Input()
  columnsdef!: Column[];
  @Input()
  sortActive!: string;
  @Input()
  sortDirection!: SortDirection;
  @Input()
  pageSize!: number;
  @Input()
  pageSizeOptions!: number[];
  @Input()
  resultsLength!: number;
  @Input()
  hidePaginator!: string;

  @Output() actionClick = new EventEmitter<ActionEvent>();
  @Output() columnClick = new EventEmitter<string>();

  // MatTable
  @ViewChild('staticdataTable', { static: true })
  dataTable!: MatTable<Element>;

  private rulerSubscription: Subscription;

  get visibleColumnsIds() {
    const visibleColumnsIds = this.visibleColumns.map(column => column.id);
    return this.hiddenColumns.length ? ['trigger', ...visibleColumnsIds] : visibleColumnsIds;
  }

  get hiddenColumnsIds() {
    return this.hiddenColumns.map(column => column.id);
  }

  isExpansionDetailRow = (index: any, item: { hasOwnProperty: (arg0: string) => any; }) => item.hasOwnProperty('detailRow');

  constructor(private ruler: ViewportRuler, private _changeDetectorRef: ChangeDetectorRef, private zone: NgZone) {
    this.rulerSubscription = this.ruler.change(100).subscribe(data => {
      this.toggleColumns(this.dataTable['_elementRef'].nativeElement.clientWidth);
    });
  }

  ngOnInit(): void {
    this.dataSource.connect().subscribe(data => {
      if (data !== undefined) {
        data.forEach((element: any, index: number) => {
          element['rowId'] = index + 1;
        });

        setTimeout(() => {
          this._changeDetectorRef.detectChanges();
        }, 10);
      }
    });
  }  

  ngAfterContentInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewChecked() {
    this.toggleColumns(this.dataTable['_elementRef'].nativeElement.clientWidth);
  }

  ngOnDestroy() {
    this.rulerSubscription.unsubscribe();
  }

  onToogleElement(elem: { [x: string]: any; }, row: { rowId: string | number; }) {
    elem[row.rowId] = !elem[row.rowId];
    this._changeDetectorRef.detectChanges();
  }

  onColumnClick(id: string) {
    this.columnClick.emit(id);
  }

  onActionClick(id: any, action: Action) {
    this.actionClick.emit({
      id: id,
      action: action
    });
  }

  toggleColumns(tableWidth: number) {
    this.zone.runOutsideAngular(() => {
      const sortedColumns = this.columnsdef.slice()
        .map((column, index) => ({ ...column, order: index }))
        .sort((a, b) => a.hideOrder - b.hideOrder);

      for (const column of sortedColumns) {
        const columnWidth = column.width ? column.width : this.MIN_COLUMN_WIDTH;

        if (column.hideOrder && tableWidth < columnWidth) {
          column.visible = false;

          continue;
        }

        tableWidth -= columnWidth;
        column.visible = true;
      }

      this.columnsdef = sortedColumns.sort((a, b) => a.order - b.order);
      this.visibleColumns = this.columnsdef.filter(column => column.visible);
      this.hiddenColumns = this.columnsdef.filter(column => !column.visible)
    })

    this._changeDetectorRef.detectChanges();
  }

  tooltip(column: Column):string{
    return  column.tooltipCallback ?  column.tooltipCallback(column) : '';
  }

  public isActionDisabled(row: any, action: any) {
    if (action.actionHideCallback !== undefined) {
      return action.actionHideCallback(row);
    }

    return false;
  }
}
