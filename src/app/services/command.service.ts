import { Injectable } from '@angular/core';
import { Color } from 'chessground/types';
import {
  getDefaultEngineSettings,
  IPlayerTeam,
} from '../components/chess-board/helpers/PlayerTeamHelper';
import { getEngineName } from '../shared/engine/engine-helpers';
import { invertColor } from '../shared/util/play';
import { GetCpuIdService } from './get-cpu-id.service';
import { PeerToPeerService } from './peer-to-peer.service';
import { SharedDataService } from './shared-data.service';
import { UsernameProperties } from 'src/app/shared/util/username';

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  constructor(
    private sharedDataService: SharedDataService,
    private peerToPeerService: PeerToPeerService,
    private getCpuIdService: GetCpuIdService
  ) {}

  resign(team: Color) {
    this.peerToPeerService.broadcastAndToSelf({
      command: 'RESIGN',
      team,
      matchId: this.sharedDataService.getSharedDataSync().matchCount,
    });
  }

  addCPU(team: Color) {
    return this.createPlayer(
      {
        properties: {} as UsernameProperties,
        name: getEngineName(getDefaultEngineSettings()),
        team,
        owner: this.peerToPeerService.getId(),
        engineSettings: getDefaultEngineSettings(),
        sortNumber: 0,
      },
      this.getCpuIdService.getNewCpuId()
    );
  }

  createPlayer(player: IPlayerTeam, playerId: string) {
    return this.peerToPeerService.broadcastAndToSelf({
      command: 'CREATE_PLAYER',
      player,
      playerId,
    });
  }

  deletePlayer(playerId: string) {
    return this.peerToPeerService.broadcastAndToSelf({
      command: 'DELETE_PLAYER',
      playerId,
    });
  }

  swapAllTeamsAndRematch() {
    const names = this.sharedDataService.getNamesSync();
    for (const key of Object.keys(names)) {
      names[key].team = invertColor(names[key].team);
      names[key].rematchRequested = undefined;
    }
    const currentMatchCount =
      this.sharedDataService.getSharedDataSync().matchCount;
    this.sharedDataService.setSharedData({ matchCount: currentMatchCount + 1 });
    this.sharedDataService.updateNames(names);
  }
}
