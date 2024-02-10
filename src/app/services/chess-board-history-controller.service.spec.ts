import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ChessBoardHistoryControllerService } from './chess-board-history-controller.service';
import { ChessStatusService } from './chess-status.service';

describe('ChessBoardHistoryControllerService', () => {
  let service: ChessBoardHistoryControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChessBoardHistoryControllerService, ChessStatusService,
        { provide: APP_BASE_HREF, useValue: '' }
      ]
    });
    service = TestBed.inject(ChessBoardHistoryControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
