import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanTableComponent } from './salesman-table.component';

describe('SalesmanTableComponent', () => {
  let component: SalesmanTableComponent;
  let fixture: ComponentFixture<SalesmanTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanTableComponent]
    });
    fixture = TestBed.createComponent(SalesmanTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
