import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChessBoardResetService } from 'src/app/services/chess-board-reset.service';
import { PeerToPeerService } from 'src/app/services/peer-to-peer.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { default as sleep } from 'sleep-promise';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-rematch-button',
  templateUrl: './rematch-button.component.html',
  styleUrls: ['./rematch-button.component.scss']
})
export class RematchButtonComponent implements OnInit, OnDestroy {
  private numNamesSubscription: Subscription;
  private namesSubscription: Subscription;

  numUniqNames = 0;
  numReady = 0;
  isReady = false;
  resetStarted = false;

  constructor(
    private sharedDataService: SharedDataService,
    private chessBoardResetService: ChessBoardResetService,
    private peerToPeerService: PeerToPeerService,
    private commandService: CommandService) {

    this.numNamesSubscription = this.sharedDataService.numNames.subscribe(t => {
      this.numUniqNames = new Set(Object.entries(this.sharedDataService.getNamesSync()).map(([k, val]) => val.owner)).size;
      this.checkRematchReady();
    });

    this.namesSubscription = this.sharedDataService.getNames().subscribe(t => {
      this.numReady = Object.entries(this.sharedDataService.getNamesSync())
        .filter(([k, val]) => val.owner === k && val.rematchRequested).length;
      this.isReady = this.sharedDataService.getPlayerSync(this.peerToPeerService.getId()).rematchRequested === true;
      this.checkRematchReady();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.numNamesSubscription.unsubscribe();
    this.namesSubscription.unsubscribe();
  }

  rematch() {
    this.sharedDataService.setRematchRequested(true);
  }

  private async checkRematchReady() {
    if (this.numUniqNames > 0 && this.numUniqNames === this.numReady && !this.resetStarted) {
      this.resetStarted = true;
      await sleep(500);
      this.commandService.swapAllTeamsAndRematch();
      this.chessBoardResetService.doReset();
    }
  }
}
