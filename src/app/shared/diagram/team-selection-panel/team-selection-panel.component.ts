import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Color } from 'chessground/types';
import { Subscription } from 'rxjs';
import {
  getSortedTeamKeys,
  PlayerTeamDict,
} from 'src/app/components/chess-board/helpers/PlayerTeamHelper';
import { CommandService } from 'src/app/services/command.service';
import { getLogger } from 'src/app/services/logger';
import { SharedDataService } from 'src/app/services/shared-data.service';

const logger = getLogger('team-selection-panel');

@Component({
  selector: 'app-team-selection-panel',
  templateUrl: './team-selection-panel.component.html',
  styleUrls: ['./team-selection-panel.component.scss'],
})
export class TeamSelectionPanelComponent implements OnInit, OnDestroy {
  @Input() team: Color = 'white';
  teamDict!: PlayerTeamDict;
  teamDictSubscription!: Subscription;
  sortedKeys!: string[];

  setSortNumberFns: { [n: string]: (n: number) => void } = {};

  constructor(
    private sharedDataService: SharedDataService,
    private commandService: CommandService
  ) {}

  ngOnInit(): void {
    logger.debug('team selection init...');
    this.teamDictSubscription = this.sharedDataService
      .getNames(this.team)
      .subscribe((t) => {
        console.log('t: ', t);
        this.teamDict = t;
        this.sortedKeys = getSortedTeamKeys(this.teamDict);
        logger.info('sortedKeys', this.sortedKeys);
        console.log('this.teamDict: ', this.teamDict);

        for (const key of Object.keys(this.teamDict)) {
          this.setSortNumberFns[key] = (n: number) => {
            this.sharedDataService.setSortNumber(key, n);
          };
        }
      });
  }

  ngOnDestroy() {
    this.teamDictSubscription.unsubscribe();
  }

  onDestroy() {
    logger.debug('panel destroyed...');
  }

  setTeam() {
    console.log('setTeam: ', this.team);
    this.sharedDataService.setTeam(this.team);
  }

  addCPU() {
    this.commandService.addCPU(this.team);
  }

  deleteCpu(e: Event, playerId: string) {
    this.commandService.deletePlayer(playerId);
    e.stopPropagation();
  }

  @HostListener('keydown.enter') onEnterKeypress(e: Event) {
    if (!e) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
  }
}
