import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTreeDesignerComponent } from './decision-tree-designer.component';

describe('DecisionTreeDesignerComponent', () => {
  let component: DecisionTreeDesignerComponent;
  let fixture: ComponentFixture<DecisionTreeDesignerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionTreeDesignerComponent]
    });
    fixture = TestBed.createComponent(DecisionTreeDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
