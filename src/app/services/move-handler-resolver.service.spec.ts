import { TestBed } from '@angular/core/testing';
import { getEngineProviderStockfishMock } from '../mocks/services/engine-provider-stockfish.mock';
import { EngineProviderStockfishService } from '../services/engine-provider-stockfish.service';

import { MoveHandlerResolverService } from './move-handler-resolver.service';

describe('MoveHandlerResolverService', () => {
  let service: MoveHandlerResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MoveHandlerResolverService,
        { provide: EngineProviderStockfishService, useValue: getEngineProviderStockfishMock() }
      ]
    });
    service = TestBed.inject(MoveHandlerResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
