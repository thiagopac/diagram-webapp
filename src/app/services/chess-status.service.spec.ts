import { TestBed } from '@angular/core/testing';

import { ChessStatusService } from './chess-status.service';
import { ChessTimeoutService } from './chess-timeout.service';

describe('ChessStatusService', () => {
  let service: ChessStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChessStatusService, ChessTimeoutService]
    });
    service = TestBed.inject(ChessStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
