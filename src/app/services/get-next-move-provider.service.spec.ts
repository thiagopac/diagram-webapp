import { TestBed } from '@angular/core/testing';

import { GetNextMoveProviderService } from './get-next-move-provider.service';

describe('GetNextMoveProviderService', () => {
  let service: GetNextMoveProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetNextMoveProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
