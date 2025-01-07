import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanRegisterPageComponent } from './salesman-register-page.component';

describe('SalesmanRegisterPageComponent', () => {
  let component: SalesmanRegisterPageComponent;
  let fixture: ComponentFixture<SalesmanRegisterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanRegisterPageComponent]
    });
    fixture = TestBed.createComponent(SalesmanRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
