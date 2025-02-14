import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanVaculonListPageComponent } from './salesman-vaculon-list-page.component';

describe('SalesmanVaculonListPageComponent', () => {
  let component: SalesmanVaculonListPageComponent;
  let fixture: ComponentFixture<SalesmanVaculonListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanVaculonListPageComponent]
    });
    fixture = TestBed.createComponent(SalesmanVaculonListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
