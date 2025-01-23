import { TestBed } from '@angular/core/testing';

import { BonusServiceService } from './bonus-service.service';

describe('BonusServiceService', () => {
  let service: BonusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
