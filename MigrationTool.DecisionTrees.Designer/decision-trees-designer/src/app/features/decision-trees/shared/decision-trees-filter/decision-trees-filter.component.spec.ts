import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTreesFilterComponent } from './decision-trees-filter.component';

describe('DecisionTreesFilterComponent', () => {
  let component: DecisionTreesFilterComponent;
  let fixture: ComponentFixture<DecisionTreesFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionTreesFilterComponent]
    });
    fixture = TestBed.createComponent(DecisionTreesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
