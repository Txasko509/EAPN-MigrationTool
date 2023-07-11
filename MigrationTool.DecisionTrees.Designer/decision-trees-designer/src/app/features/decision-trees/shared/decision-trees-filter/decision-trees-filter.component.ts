import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';
import { DateGreaterOrEqualThan } from 'src/shared/validators/date-greather-or-equal.validator';

@Component({
  selector: 'app-decision-trees-filter',
  templateUrl: './decision-trees-filter.component.html',
  styleUrls: ['./decision-trees-filter.component.scss']
})
export class DecisionTreesFilterComponent implements OnInit, AfterViewInit {
  @Input() formGroup!: FormGroup;
  @Output() change = new EventEmitter();

  filterForm!: FormGroup;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      from: new FormControl('', []),
      to: new FormControl('', []),
      searchText: new FormControl('', []),
    }, {
      // Used custom form validator name
      validator: DateGreaterOrEqualThan("to", "from")
    });

    this.formGroup.addControl('from', this.filterForm.controls['from']);
    this.formGroup.addControl('to', this.filterForm.controls['to']);
    this.formGroup.addControl('searchText', this.filterForm.controls['searchText']);
  }

  ngAfterViewInit() {
    this.filterForm.controls['from'].valueChanges.pipe(distinctUntilChanged()).subscribe(values => {
      this.change.emit();
    });

    this.filterForm.controls['to'].valueChanges.pipe(distinctUntilChanged()).subscribe(values => {
      this.change.emit();
    });

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.change.emit();
        })
      )
      .subscribe();
  }
}

