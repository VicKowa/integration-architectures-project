import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanListPageComponent } from './salesman-list-page.component';

describe('TestPageComponent', () => {
  let component: SalesmanListPageComponent;
  let fixture: ComponentFixture<SalesmanListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanListPageComponent]
    });
    fixture = TestBed.createComponent(SalesmanListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
