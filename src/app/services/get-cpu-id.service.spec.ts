import { TestBed } from '@angular/core/testing';

import { GetCpuIdService } from './get-cpu-id.service';

describe('GetCpuIdService', () => {
  let service: GetCpuIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCpuIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
