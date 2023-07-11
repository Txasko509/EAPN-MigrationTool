import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTreeListComponent } from './decision-tree-list.component';

describe('DecisionTreeListComponent', () => {
  let component: DecisionTreeListComponent;
  let fixture: ComponentFixture<DecisionTreeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionTreeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionTreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
