import { Injectable, OnDestroy } from '@angular/core';
import { Color } from 'chessground/types';
import { Subject, Subscription, timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { ChessStatusService } from './chess-status.service';
import { ChessTimerService } from './chess-timer.service';
import { PeerToPeerService } from './peer-to-peer.service';
import { SharedDataService } from './shared-data.service';

const HOST_TIMEOUT_DELAY = 1000;

@Injectable()
export class ChessTimeoutService implements OnDestroy {
  private timerSubscription: Subscription;
  private hostTimeoutDeclSubscription?: Subscription;
  private timeout = new Subject<Color>();

  constructor(
    private chessTimerService: ChessTimerService,
    private chessStatusService: ChessStatusService,
    private peerToPeerService: PeerToPeerService,
    private sharedDataService: SharedDataService
  ) {
      this.timerSubscription = this.chessTimerService.getTimeoutObservable().subscribe(color => {
        // @ts-ignore: noUnusedLocals
        const [_, currentPlayer] = this.chessStatusService.currentTurn.getValue();
        if (currentPlayer?.owner === this.peerToPeerService.getId()) {
          this.doTimeout(color);
        } else if (this.peerToPeerService.getIsHost()) {
          this.cancelHostTimeoutDeclaration();
          this.hostTimeoutDeclSubscription = timer(HOST_TIMEOUT_DELAY).pipe(first()).subscribe(() => {
            this.doTimeout(color, true);
          });
        }
      });
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
    this.hostTimeoutDeclSubscription?.unsubscribe();
  }

  cancelHostTimeoutDeclaration() {
    this.hostTimeoutDeclSubscription?.unsubscribe();
  }

  getTimeoutObservable() {
    return this.timeout.asObservable();
  }

  private doTimeout(color: Color, sendTimeoutMessage = false) {
    this.timeout.next(color);
    this.chessStatusService.setTimeout(color);
    if (sendTimeoutMessage) {
      this.peerToPeerService.broadcast({
        command: 'DECLARE_TIMEOUT',
        matchId: this.sharedDataService.getSharedDataSync().matchCount,
        color
      });
    }
  }
}
