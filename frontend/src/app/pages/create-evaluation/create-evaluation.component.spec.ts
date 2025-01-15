import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEvaluationComponent } from './create-evaluation.component';

describe('CreateBonusComponent', () => {
  let component: CreateEvaluationComponent;
  let fixture: ComponentFixture<CreateEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEvaluationComponent]
    });
    fixture = TestBed.createComponent(CreateEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
