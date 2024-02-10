import { Injectable } from '@angular/core';
import { Color } from 'chessground/types';
import { IGetNextMove } from '../components/chess-board/helpers/GetNextMove/IGetNextMove';
import { NullGetNextMove } from '../components/chess-board/helpers/GetNextMove/NullGetNextMove';
import { getSortedTeamKeys, IPlayerTeam, PlayerTeamDict } from '../components/chess-board/helpers/PlayerTeamHelper';
import { GetNextMoveProviderService } from './get-next-move-provider.service';
import { PeerToPeerService } from './peer-to-peer.service';
import { SharedDataService } from './shared-data.service';

@Injectable()
export class MoveHandlerResolverService {
  private moveHandlers!: {
    'white': IGetNextMove[],
    'black': IGetNextMove[]
  };

  constructor(
    private peerToPeerService: PeerToPeerService,
    private sharedDataService: SharedDataService,
    private getNextMoveProviderService: GetNextMoveProviderService
  ) {
    this.rebuild();
  }

  getMoveHander(color: Color, moveNumber: number): IGetNextMove {
    const numHandlers = this.moveHandlers[color].length;
    return this.moveHandlers[color][Math.floor(moveNumber / 2) % numHandlers];
  }

  rebuild() {
    const whiteTeamDict = this.sharedDataService.getNamesSync('white');
    const blackTeamDict = this.sharedDataService.getNamesSync('black');
    this.moveHandlers = {
      white: this.buildMoveHandlers(whiteTeamDict),
      black: this.buildMoveHandlers(blackTeamDict)
    };
  }

  private buildMoveHandlers(teamDict: PlayerTeamDict) {
    const keys = Object.keys(teamDict);
    if (keys.length === 0) {
      return [new NullGetNextMove()];
    }

    return getSortedTeamKeys(teamDict).map(key => this.buildMoveHandler(teamDict[key]));
  }

  private buildMoveHandler(player: IPlayerTeam): IGetNextMove {
    if (player.engineSettings == null || player.owner !== this.peerToPeerService.getId()) return new NullGetNextMove();
    return this.getNextMoveProviderService.getNextMoveGetter(player.engineSettings);
  }
}
