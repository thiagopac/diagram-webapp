import { Injectable } from '@angular/core';
import { Api } from 'chessground/api';
import { BoardMouseEventHelper } from '../components/chess-board/helpers/BoardMouseEventHelper';
import { AudioService } from './audio.service';
import { ChessStatusService } from './chess-status.service';
import * as ChessJS from 'chess.js';

@Injectable()
export class ChessBoardHistoryControllerService {
  private cg!: Api;
  private setBoardMouseEvents!: () => void;
  private historicalMoveNumber = 0;

  constructor(
    private chessStatusService: ChessStatusService,
    private audioService: AudioService
  ) { }

  setCg(cg: Api, setBoardMouseEvents: () => void) {
    this.cg = cg;
    this.setBoardMouseEvents = setBoardMouseEvents;
  }

  handleKeyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.navigatePosition(-1);
    }

    if (event.key === 'ArrowRight') {
      this.navigatePosition(1);
    }
  }

  afterMove() {
    this.historicalMoveNumber = this.chessStatusService.getNumMoves();
  }

  resetHistoryIfRequired() {
    if (this.historicalMoveNumber !== this.chessStatusService.getNumMoves()) {
      this.historicalMoveNumber = this.chessStatusService.getNumMoves();
      const oldAnimation = this.cg.state.animation.enabled;
      this.cg.set({animation: {enabled: false}});
      this.cg.set({fen: this.chessStatusService.getFenForMove(this.historicalMoveNumber)});
      this.cg.set({animation: {enabled: oldAnimation}});
    }
  }

  private navigatePosition(offset: number) {
    if (offset < 0 && this.historicalMoveNumber + offset >= 0) {
      this.historicalMoveNumber += offset;
      this.setCgForHistoricalMove(this.historicalMoveNumber, true);
      BoardMouseEventHelper.setUnmovable(this.cg);
    }
    else if (offset > 0 && this.historicalMoveNumber + offset <= this.chessStatusService.getNumMoves()) {
      this.historicalMoveNumber += offset;
      this.setCgForHistoricalMove(this.historicalMoveNumber);
      if (this.historicalMoveNumber === this.chessStatusService.getNumMoves()) {
        this.setBoardMouseEvents();
      }
    }
  }

  private setCgForHistoricalMove(moveNumber: number, movingBackward: boolean = false) {
    const fen = this.chessStatusService.getFenForMove(moveNumber);
    const toMoveArray = (move: ChessJS.Move) => [move.from, move.to];
    const lastMove = moveNumber !== 0
      ? toMoveArray(this.chessStatusService.getPreviousMoveForMove(moveNumber))
      : undefined;
    this.cg.set({
      fen,
      lastMove,
      check: this.chessStatusService.isInCheck(moveNumber) ? this.chessStatusService.getColorForMove(moveNumber) : false
    });
    this.playSoundForMoveNumber(moveNumber + (movingBackward ? 1 : 0));
  }

  private playSoundForMoveNumber(moveNumber: number) {
    if (moveNumber <= 0) return;
    const lastMove = this.chessStatusService.getPreviousMoveForMove(moveNumber);
    this.audioService.playMoveSound(lastMove.captured != null);
  }
}
