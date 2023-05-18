import { TestBed } from '@angular/core/testing';

import { BiketripService } from './biketrip.service';

describe('BiketripService', () => {
  let service: BiketripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiketripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
