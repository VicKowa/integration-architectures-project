import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEvaluationComponent } from './list-evaluation.component';

describe('ListedBonusesPageComponent', () => {
  let component: ListEvaluationComponent;
  let fixture: ComponentFixture<ListEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEvaluationComponent]
    });
    fixture = TestBed.createComponent(ListEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
