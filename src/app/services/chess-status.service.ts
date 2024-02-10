import { Injectable, OnDestroy } from '@angular/core';
import * as ChessJS from 'chess.js';
import { Color } from 'chessground/types';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IPlayerTeam } from '../components/chess-board/helpers/PlayerTeamHelper';
import { toColor } from '../shared/util/play';
import { PlayersTurnInfo } from '../shared/util/PlayersTurnInfo';
import { getLogger } from './logger';
import { SharedDataService } from './shared-data.service';
export const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;

const logger = getLogger('chess-status.service');

@Injectable()
export class ChessStatusService implements OnDestroy {
  currentStatus = new BehaviorSubject<string>('');
  currentTurn = new BehaviorSubject<[string, IPlayerTeam|null]>(['', null]);
  previousTurn = new BehaviorSubject<[string, IPlayerTeam|null]>(['', null]);
  nextTurn = new BehaviorSubject<[string, IPlayerTeam|null]>(['', null]);

  private moveToFen: {[key: number]: string} = {};
  private moveToPreviousMove: {[key: number]: ChessJS.Move} = {};
  private blackWentFirst = false;
  private numNamesSubscription: Subscription;

  chess: ChessJS.ChessInstance;
  playersTurnInfo: PlayersTurnInfo;

  constructor(private sharedDataService: SharedDataService) {
    this.chess = new Chess();
    this.playersTurnInfo = new PlayersTurnInfo(this.sharedDataService.getNamesSync());
    this.resetPlayersTurnInfo();
    this.numNamesSubscription = this.sharedDataService.numNames.subscribe(() => {
      this.resetPlayersTurnInfo();
    });
    this.updateCurrentTurn();
    this.updateMoveForFen();
  }

  ngOnDestroy() {
    this.numNamesSubscription.unsubscribe();
  }

  move(move: string | ChessJS.ShortMove): ChessJS.Move | null {
    const res = this.chess.move(move);
    if (!res) {
      throw new Error('invalid move');
    }
    this.updateStatusFromGame(this.chess);
    this.updateCurrentTurn();
    this.updateMoveForFen(res);
    return res;
  }

  getColor = () => toColor(this.chess);
  getPgn = () => this.chess.pgn();
  getColorForMove = (moveNumber: number) => ((this.blackWentFirst ? 1 : 0) + moveNumber) % 2 === 0 ? 'white' : 'black';
  getFenForMove = (moveNumber: number) => this.moveToFen[moveNumber];

  setFen(fen: string) {
    this.chess = new Chess(fen);
    this.blackWentFirst = this.getColor() === 'black';

    this.resetPlayersTurnInfo();
    this.updateCurrentTurn();
    this.updateMoveForFen();
  }


  getPreviousMoveForMove = (moveNumber: number) => this.moveToPreviousMove[moveNumber];
  isGameOver = () => this.currentStatus.getValue() !== '';

  setTimeout(color: Color) {
    this.currentStatus.next(`timeout ${color}`);
  }

  getNumMoves() {
    return this.chess.history().length;
  }

  isInCheck(moveNumber: number): boolean {
    return (new Chess(this.moveToFen[moveNumber])).in_check();
  }

  isPlayersMove(playersId: string) {
    return this.playersTurnInfo.isPlayersTurn(this.getNumMoves(), playersId);
  }

  didMoveBelongToPlayer(playersId: string) {
    return this.playersTurnInfo.didMoveBelongToPlayer(this.getNumMoves(), playersId);
  }

  isPlayersMoveNext(playersId: string) {
    return this.playersTurnInfo.isPlayersTurnNext(this.getNumMoves(), playersId);
  }

  resign(team: Color) {
    this.currentStatus.next(`${team} resigned`);
  }

  private resetPlayersTurnInfo() {
    this.playersTurnInfo = new PlayersTurnInfo(this.sharedDataService.getNamesSync(), this.blackWentFirst);
  }

  private updateMoveForFen(move?: ChessJS.Move) {
    this.moveToFen[this.getNumMoves()] = this.chess.fen();
    if (move) {
      this.moveToPreviousMove[this.getNumMoves()] = move;
    }
  }

  private updateCurrentTurn() {
    logger.debug(this.getNumMoves(), this.playersTurnInfo.getPlayer(this.getNumMoves()));
    this.previousTurn.next(this.currentTurn.getValue());
    this.currentTurn.next(this.getTupleForMoveNumber(this.getNumMoves()));
    this.nextTurn.next(this.getTupleForMoveNumber(this.getNumMoves() + 1));
  }

  private getTupleForMoveNumber(moveNumber: number): [string, IPlayerTeam] {
    const playerId = this.playersTurnInfo.getPlayer(moveNumber);
    const playerTeamDict = this.sharedDataService.getNamesSync()[playerId] || null;
    return [playerId, playerTeamDict];
  }

  private updateStatusFromGame(chess: ChessJS.ChessInstance) {
    if (chess.in_stalemate()) {
      this.currentStatus.next('stalemate');
    } else if (chess.in_checkmate()) {
      this.currentStatus.next('checkmate');
    } else if (chess.in_draw()) {
      this.currentStatus.next('draw');
    }
  }
}
