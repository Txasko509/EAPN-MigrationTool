import {
  Component, Input, ChangeDetectionStrategy, AfterContentInit,
  EventEmitter, Output, OnDestroy, ViewChild, ChangeDetectorRef, NgZone, OnInit, AfterViewInit
} from "@angular/core";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { merge, Subscription } from "rxjs";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { MatSort, SortDirection } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { tap } from "rxjs/operators";

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
}

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SharedTableComponent implements AfterContentInit, AfterViewInit, OnDestroy, OnInit {
  public MIN_COLUMN_WIDTH: number = 200;

  // Visible Hidden Columns
  visibleColumns: Column[] = [];
  hiddenColumns: Column[] = [];
  expandedElement = [];

  // MatPaginator Output
  pageEvent!: PageEvent;

  // Shared Variables
  @Input()
  dataSource!: DataSource<any>;
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

  @Output() sortChange = new EventEmitter<MatSort>();
  @Output() pageChange = new EventEmitter<MatPaginator>();

  // MatTable
  @ViewChild('dataTable', { static: true })
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
    this.dataSource.connect(this.dataTable).subscribe(data => {
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
    this.toggleColumns(this.dataTable['_elementRef'].nativeElement.clientWidth);
  }

  ngAfterViewInit() {
    merge(this.sort.sortChange)
      .pipe(
        tap(() => this.sortChange.emit(this.sort))
      )
      .subscribe();

    if (this.paginator !== undefined) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.paginator.page)
        .pipe(
          tap(() => this.pageChange.emit(this.paginator))
        )
        .subscribe();
    }
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

  public isActionDisabled(row: any, action: any) {
    if (action.actionHideCallback !== undefined) {
      return action.actionHideCallback(row);
    }

    return false;
  }
}
