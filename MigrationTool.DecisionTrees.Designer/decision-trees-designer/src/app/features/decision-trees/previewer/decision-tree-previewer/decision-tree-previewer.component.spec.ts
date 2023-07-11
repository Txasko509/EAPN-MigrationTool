import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTreePreviewerComponent } from './decision-tree-previewer.component';

describe('DecisionTreePreviewerComponent', () => {
  let component: DecisionTreePreviewerComponent;
  let fixture: ComponentFixture<DecisionTreePreviewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionTreePreviewerComponent]
    });
    fixture = TestBed.createComponent(DecisionTreePreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
