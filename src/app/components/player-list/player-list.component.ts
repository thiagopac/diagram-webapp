import { Component, Input, OnInit } from '@angular/core';
import { getSortedTeamKeys, PlayerTeamDict } from '../chess-board/helpers/PlayerTeamHelper';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

  constructor() { }

  @Input() players: PlayerTeamDict = {};
  @Input() currentId: string | null = '';
  @Input() nextId: string | null = '';

  playersNotNull!: PlayerTeamDict;
  playerIds!: string[];

  ngOnInit(): void {
    this.playersNotNull = this.players;
    this.playerIds = getSortedTeamKeys(this.players);
  }
}
