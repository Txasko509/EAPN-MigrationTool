import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedStaticTableComponent } from './shared-static-table.component';

describe('SharedStaticTableComponent', () => {
  let component: SharedStaticTableComponent;
  let fixture: ComponentFixture<SharedStaticTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedStaticTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedStaticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
