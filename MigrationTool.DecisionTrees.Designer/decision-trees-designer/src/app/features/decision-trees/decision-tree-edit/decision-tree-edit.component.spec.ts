import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTreeEditComponent } from './decision-tree-edit.component';

describe('DecisionTreeEditComponent', () => {
  let component: DecisionTreeEditComponent;
  let fixture: ComponentFixture<DecisionTreeEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionTreeEditComponent]
    });
    fixture = TestBed.createComponent(DecisionTreeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
