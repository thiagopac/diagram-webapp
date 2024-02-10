import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPlayerTeam } from 'src/app/components/chess-board/helpers/PlayerTeamHelper';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-player-config',
  templateUrl: './player-config.component.html',
  styleUrls: ['./player-config.component.scss']
})
export class PlayerConfigComponent implements OnInit, OnDestroy {
  @Input() playerId = '';
  player: IPlayerTeam | null = null;

  namesSubscription: Subscription;

  updateTimeForMove = (val: number) => this.sharedDataService.setEngineSettings(this.playerId, {timeForMove: val});
  updateElo = (val: number) => this.sharedDataService.setEngineSettings(this.playerId, {elo: val});
  updateSkillLevel = (val: number) => this.sharedDataService.setEngineSettings(this.playerId, {skillLevel: val});

  roundTo100 = (val: number) => Math.round(val / 100) * 100;
  roundTo50 = (val: number) => Math.round(val / 50) * 50;

  constructor(private sharedDataService: SharedDataService) {
    this.namesSubscription = this.sharedDataService.getNames().subscribe(names => {
      this.player = names[this.playerId];
    });
  }

  ngOnInit(): void {
    this.player = this.sharedDataService.getPlayerSync(this.playerId);
  }

  ngOnDestroy() {
    this.namesSubscription.unsubscribe();
  }
}
