import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChessTimerFormatPipe } from 'src/app/pipes/chess-timer-format.pipe';
import { ChessTimerService } from 'src/app/services/chess-timer.service';
import { DEFAULT_ID, PeerToPeerService } from 'src/app/services/peer-to-peer.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { PlayerTeamDict } from '../chess-board/helpers/PlayerTeamHelper';
import { ChessStatusService } from 'src/app/services/chess-status.service';

@Component({
  selector: 'app-chess-timer',
  templateUrl: './chess-timer.component.html',
  styleUrls: ['./chess-timer.component.scss'],
  providers: [ChessTimerFormatPipe]
})
export class ChessTimerComponent implements OnInit {
  whiteTime: Observable<number>;
  blackTime: Observable<number>;
  currentStatus: Observable<string>;
  currentTurn: Observable<string>;
  currentId: Observable<string>;
  nextId: Observable<string>;
  myName: Observable<string>;
  myId: string;

  whiteNames!: Observable<PlayerTeamDict>;
  blackNames!: Observable<PlayerTeamDict>;

  @Input() inverted = false;
  flexDirection = 'column';

  constructor(
    private chessTimerService: ChessTimerService,
    private chessStatusService: ChessStatusService,
    private peerToPeerService: PeerToPeerService,
    private sharedDataService: SharedDataService
  ) {
    this.whiteTime = this.chessTimerService.getTimerObservable('white');
    this.blackTime = this.chessTimerService.getTimerObservable('black');
    this.currentStatus = this.chessStatusService.currentStatus.asObservable();

    this.currentId = this.chessStatusService.currentTurn.asObservable().pipe(map(([key, value]) => key));
    this.nextId = this.chessStatusService.nextTurn.asObservable().pipe(map(([key, value]) => key));
    this.currentTurn = this.chessStatusService.currentTurn.asObservable().pipe(map(([key, value]) => value?.name ?? key));
    this.myId = this.peerToPeerService.getId();
    this.myName = this.sharedDataService.getNames().pipe(map(t => t[this.peerToPeerService.getId()]?.name ?? DEFAULT_ID));
  }

  ngOnInit() {
    this.flexDirection = !this.inverted ? 'column' : 'column-reverse';
    this.whiteNames = this.sharedDataService.getNames('white');
    this.blackNames = this.sharedDataService.getNames('black');
  }
}
