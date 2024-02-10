import {
  AfterContentInit,
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chessground } from 'chessground';
import { NgxChessgroundComponent } from 'ngx-chessground';
import * as ChessJS from 'chess.js';
import { BoardMouseEventHelper } from './helpers/BoardMouseEventHelper';
import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';
import { ChessTimerService } from 'src/app/services/chess-timer.service';
import { ChessStatusService } from 'src/app/services/chess-status.service';
import { PeerToPeerService } from 'src/app/services/peer-to-peer.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { AudioService } from 'src/app/services/audio.service';
import {
  promoteIfNecessary,
  removeEnPassantIfNecessary,
} from './helpers/ChessgroundHelpers';
import { Subscription } from 'rxjs';
import { ChessTimeoutService } from 'src/app/services/chess-timeout.service';
import { CommandService } from 'src/app/services/command.service';
import { IMessage } from 'src/app/shared/peer-to-peer/defs';
import { getLogger } from 'src/app/services/logger';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import hotkeys from 'hotkeys-js';
import { ChessBoardHistoryControllerService } from 'src/app/services/chess-board-history-controller.service';
import { MoveHandlerResolverService } from 'src/app/services/move-handler-resolver.service';
export const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;

const HOTKEYS_SCOPE = 'chess-board';
const logger = getLogger('chess-board.component');

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss'],
  providers: [
    ChessStatusService,
    ChessTimerService,
    ChessTimeoutService,
    ChessBoardHistoryControllerService,
    MoveHandlerResolverService,
  ],
})
export class ChessBoardComponent
  implements OnInit, OnDestroy, AfterContentInit, AfterViewInit
{
  readonly myTeam: Color;
  private readonly isSinglePlayer;
  private chessTimerSubscription!: Subscription;
  private peerToPeerSubscription!: Subscription;
  private numNamesSubscription!: Subscription;

  @ViewChild('chess') private ngxChessgroundComponent!: NgxChessgroundComponent;
  private cg!: Api;

  constructor(
    private chessTimerService: ChessTimerService,
    private chessStatusService: ChessStatusService,
    private peerToPeerService: PeerToPeerService,
    private sharedDataService: SharedDataService,
    private audioService: AudioService,
    private chessTimeoutService: ChessTimeoutService,
    private commandService: CommandService,
    private localStorageService: LocalStorageService,
    private chessBoardHistoryController: ChessBoardHistoryControllerService,
    private moveHandlerResolverService: MoveHandlerResolverService
  ) {
    this.isSinglePlayer = !this.peerToPeerService.getIsConnected();
    this.myTeam = this.chessStatusService.playersTurnInfo.getTeam(
      this.peerToPeerService.getId()
    );
  }

  ngOnInit() {
    this.updateMoveHandlerResolver();
  }

  ngAfterViewInit(): void {
    this.ngxChessgroundComponent.runFn = this.run.bind(this);

    this.chessTimerSubscription = this.chessTimeoutService
      .getTimeoutObservable()
      .subscribe((color) => {
        this.chessStatusService.setTimeout(color);
        this.onGameOver();
      });

    this.numNamesSubscription = this.sharedDataService.numNames.subscribe(
      (num) => {
        this.updateMoveHandlerResolver();
        this.setBoardMouseEvents();
      }
    );

    this.peerToPeerSubscription = this.peerToPeerService
      .getMessageObservable()
      .subscribe(this.peerToPeerHandler.bind(this));

    hotkeys('alt+r', HOTKEYS_SCOPE, (event: any) => {
      event.preventDefault();
      this.commandService.resign(this.myTeam);
    });

    hotkeys.setScope(HOTKEYS_SCOPE);
  }

  ngAfterContentInit() {
    this.setupTimer();
  }

  ngOnDestroy() {
    this.cg.destroy();
    this.chessTimerSubscription.unsubscribe();
    this.peerToPeerSubscription.unsubscribe();
    this.numNamesSubscription.unsubscribe();
    hotkeys.deleteScope(HOTKEYS_SCOPE);
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.chessBoardHistoryController.handleKeyEvent(event);
  }

  private run(el: HTMLElement) {
    const sharedData = this.sharedDataService.getSharedDataSync();

    this.cg = Chessground(el, {
      turnColor: 'white',
      animation: {
        enabled: true,
      },
      movable: {
        free: false,
      },
      draggable: {
        showGhost: true,
      },
      highlight: {
        check: true,
      },
      fen: sharedData.startFen,
      events: { move: (orig, dest) => this.cgMoveHandler(orig, dest, 'q') },
      orientation: this.myTeam,
    });

    if (sharedData.startFen) {
      this.chessStatusService.setFen(sharedData.startFen);
    }

    this.setupDebug();
    this.getAndApplyCPUMove();
    this.setBoardMouseEvents();
    this.chessBoardHistoryController.setCg(this.cg, () =>
      this.setBoardMouseEvents()
    );

    return this.cg;
  }

  private setupTimer() {
    const sharedData = this.sharedDataService.getSharedDataSync();
    const timerSettings = sharedData.timerSettings;
    this.chessTimerService.setupTimer(
      timerSettings,
      this.chessStatusService.getColor()
    );
  }

  private setupDebug() {
    const anyWindow = window as any;
    anyWindow.cg = this.cg;
    anyWindow.chess = this.chessStatusService.chess;
  }

  private cgMoveHandler(
    from: Key,
    to: Key,
    promotion?: Exclude<ChessJS.PieceType, 'p'>
  ) {
    if (from === 'a0' || to === 'a0') throw new Error('should not be a0');
    this.movePieceWithEnPassantAndPromotion({ from, to, promotion });

    this.chessTimerService.setTurn(this.chessStatusService.getColor());
    if (this.chessStatusService.getNumMoves() === 2) {
      this.chessTimerService.startTimer();
    }
    if (this.chessStatusService.getNumMoves() >= 2) {
      this.chessTimerService.unpauseTimer();
    }
    this.chessTimeoutService.cancelHostTimeoutDeclaration();
    this.setBoardMouseEvents();
    this.cg.playPremove();

    this.chessBoardHistoryController.afterMove();
    if (this.chessStatusService.isGameOver()) {
      return this.onGameOver();
    }
    this.getAndApplyCPUMove();
  }

  private movePieceWithEnPassantAndPromotion(move: ChessJS.ShortMove) {
    const oldColor = this.chessStatusService.getColor();

    if (
      !this.isSinglePlayer &&
      this.chessStatusService.didMoveBelongToPlayer(
        this.peerToPeerService.getId()
      )
    ) {
      this.peerToPeerService.broadcast({
        command: 'MOVE',
        numMoves: this.chessStatusService.getNumMoves(),
        from: move.from,
        to: move.to,
        matchId: this.sharedDataService.getSharedDataSync().matchCount,
        promotion: move.promotion,
        claimedTime: this.chessTimerService.getCurrentTime(),
      });
    }

    const resMove = this.chessStatusService.move(move);
    if (!resMove) {
      logger.warn('invalid move');
      return;
    }

    promoteIfNecessary(resMove, this.cg, oldColor);
    removeEnPassantIfNecessary(resMove, this.cg);

    this.audioService.playMoveSound(resMove.captured != null);
    this.cg.set({
      check: this.chessStatusService.chess.in_check()
        ? this.chessStatusService.getColor()
        : undefined,
    });

    return move;
  }

  private peerToPeerHandler = (message: IMessage) => {
    const correctMatchId = (data: { matchId: number }) => {
      return (
        data.matchId === this.sharedDataService.getSharedDataSync().matchCount
      );
    };
    if (!('matchId' in message.data) || !correctMatchId(message.data)) {
      return;
    }

    if (message.data.command === 'MOVE') {
      this.processMoveFromExternal(
        {
          from: message.data.from,
          to: message.data.to,
          promotion: message.data.promotion,
        },
        message.data.claimedTime
      );
    } else if (message.data.command === 'DECLARE_TIMEOUT') {
      this.chessStatusService.setTimeout(message.data.color);
    } else if (message.data.command === 'RESIGN') {
      this.chessStatusService.resign(message.data.team);
      this.onGameOver();
    }
  };

  private onGameOver() {
    BoardMouseEventHelper.setUnmovable(this.cg);
    this.audioService.genericNotify.play();
    this.chessTimerService.pauseTimer();
    this.localStorageService.addGame(this.chessStatusService.getPgn());
  }

  private setBoardMouseEvents() {
    if (this.chessStatusService.isGameOver()) {
      return BoardMouseEventHelper.setUnmovable(this.cg);
    }
    if (this.chessStatusService.isPlayersMove(this.peerToPeerService.getId())) {
      return BoardMouseEventHelper.setMovable(
        this.chessStatusService.chess,
        this.cg
      );
    }
    if (
      this.chessStatusService.isPlayersMoveNext(this.peerToPeerService.getId())
    ) {
      return BoardMouseEventHelper.setPremovable(
        this.chessStatusService.chess,
        this.cg
      );
    }
    return BoardMouseEventHelper.setUnmovable(this.cg);
  }

  private async getAndApplyCPUMove() {
    const moveHandler = this.moveHandlerResolverService.getMoveHander(
      this.chessStatusService.getColor(),
      this.chessStatusService.getNumMoves()
    );
    const move = await moveHandler.getMove(this.chessStatusService.chess);
    if (this.chessStatusService.isGameOver()) return;
    if (move != null) {
      logger.info('APPLY CPU MOVE');
      this.processMoveFromExternal(move);
    }
  }

  private processMoveFromExternal(
    move: ChessJS.ShortMove,
    claimedTime?: number
  ) {
    if (claimedTime !== undefined) {
      this.chessTimerService.setTimeForCurrentTurn(claimedTime);
      this.chessTimerService.pauseTimer();
    }
    this.chessBoardHistoryController.resetHistoryIfRequired();
    this.cg.move(move.from, move.to);
  }

  private updateMoveHandlerResolver() {
    this.moveHandlerResolverService.rebuild();
  }

  resign() {
    console.log('resigning: ', this.myTeam);
    this.commandService.resign(this.myTeam);
  }

  flip() {
    this.cg.toggleOrientation();
  }
}
