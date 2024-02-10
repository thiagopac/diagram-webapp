
import { Color } from 'chessground/types';
import { getSortedTeamKeys, PlayerTeamDict } from '../../components/chess-board/helpers/PlayerTeamHelper';

export class PlayersTurnInfo {
  readonly players: {
    'white': string[],
    'black': string[]
  };

  constructor(private names: PlayerTeamDict, private blackWentFirst = false) {
    if (names != null && Object.keys(names).length > 0) {
      const sortedKeys = getSortedTeamKeys(names);
      this.players = {
        white: sortedKeys.filter(t => names[t].team === 'white'),
        black: sortedKeys.filter(t => names[t].team === 'black'),
      };
    } else {
      throw new Error('can this happen?');
    }
  }

  getTeam(playerId: string): Color {
    return this.players.white.filter(t => t === playerId).length === 1 ? 'white' : 'black';
  }

  isPlayersTurnNext(moveNumber: number, playerId: string) {
    return this.isPlayersTurn(moveNumber + 1, playerId);
  }

  isPlayersTurn(moveNumber: number, playerId: string) {
    return this.getPlayer(moveNumber) === playerId;
  }

  getPlayer(moveNumber: number) {
    const moveColour: Color = (moveNumber + (this.blackWentFirst ? 1 : 0)) % 2 === 0 ? 'white' : 'black';
    const teamsTurn = moveColour;
    const playersInTeam = this.players[teamsTurn].length;
    return this.players[teamsTurn][Math.floor(moveNumber / 2) % playersInTeam];
  }

  didMoveBelongToPlayer(moveNumber: number, playerId: string) {
    return this.names != null && this.names[this.getPlayer(moveNumber)].owner === playerId;
  }
}
