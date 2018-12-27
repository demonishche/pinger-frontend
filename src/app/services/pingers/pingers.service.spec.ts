import { TestBed } from '@angular/core/testing';

import { PingersService } from './pingers.service';

describe('PingersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PingersService = TestBed.get(PingersService);
    expect(service).toBeTruthy();
  });
});
