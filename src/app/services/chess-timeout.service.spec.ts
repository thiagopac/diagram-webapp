import { TestBed } from '@angular/core/testing';
import { ChessStatusService } from './chess-status.service';

import { ChessTimeoutService } from './chess-timeout.service';
import { ChessTimerService } from './chess-timer.service';

describe('ChessTimeoutService', () => {
  let service: ChessTimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChessTimeoutService, ChessTimerService, ChessStatusService]
    });
    service = TestBed.inject(ChessTimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
