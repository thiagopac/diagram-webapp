import { TestBed } from '@angular/core/testing';

import { EngineProviderStockfishService } from './engine-provider-stockfish.service';

describe('EngineProviderStockfishService', () => {
  let service: EngineProviderStockfishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngineProviderStockfishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
