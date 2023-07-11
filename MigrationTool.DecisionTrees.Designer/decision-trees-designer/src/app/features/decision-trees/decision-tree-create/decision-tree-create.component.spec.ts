import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTreeCreateComponent } from './decision-tree-create.component';

describe('DecisionTreeCreateComponent', () => {
  let component: DecisionTreeCreateComponent;
  let fixture: ComponentFixture<DecisionTreeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionTreeCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionTreeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
