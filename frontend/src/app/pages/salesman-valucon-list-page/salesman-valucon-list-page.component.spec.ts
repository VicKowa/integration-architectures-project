import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanValuconListPageComponent } from './salesman-valucon-list-page.component';

describe('SalesmanValuconListPageComponent', () => {
  let component: SalesmanValuconListPageComponent;
  let fixture: ComponentFixture<SalesmanValuconListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanValuconListPageComponent]
    });
    fixture = TestBed.createComponent(SalesmanValuconListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
