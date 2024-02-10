import { TestBed } from '@angular/core/testing';

import { ChessBoardResetService } from './chess-board-reset.service';

describe('ChessBoardResetService', () => {
  let service: ChessBoardResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessBoardResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
