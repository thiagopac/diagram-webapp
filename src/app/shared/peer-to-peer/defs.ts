import { Color } from 'chessground/types';
import * as ChessJS from 'chess.js';
import { IPlayerTeam, PlayerTeamDict } from '../../components/chess-board/helpers/PlayerTeamHelper';
import { ISharedData } from './shared-data';
import { PartialDeep } from 'type-fest';
export const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;


export type MessageData = IMove | IInfo | IStart | IDisconnectNotification | ISendNames | IUpdateShared |
                          IDeclareTimeout | IDeletePlayer | ICreatePlayer | IResign;

export interface IMessage {
  type: 'BROADCAST' | 'SINGLE';
  from: string;
  data: MessageData;
  echoBroadcast?: boolean;
}

export interface ICommand {
  command: string;
}

export interface IMove extends ICommand {
  command: 'MOVE';
  numMoves: number;
  from: ChessJS.Square;
  to: ChessJS.Square;
  matchId: number;
  claimedTime?: number;
  promotion?: Exclude<ChessJS.PieceType, 'p'>;
}

export interface IInfo extends ICommand {
  command: 'INFO';
  player: PartialDeep<IPlayerTeam>;
  overrides?: {
    id?: string;
  };
}

export interface ICreatePlayer extends ICommand {
  command: 'CREATE_PLAYER';
  player: IPlayerTeam;
  playerId: string;
}


export interface IUpdateShared extends ICommand {
  command: 'UPDATE_SHARED';
  sharedData: PartialDeep<ISharedData>;
}

export interface IStart extends ICommand {
  command: 'START';
}

export interface IDisconnectNotification extends ICommand {
  command: 'DISCONNECTED';
  name: string;
}

export interface ISendNames extends ICommand {
  command: 'SET_NAMES';
  names: PlayerTeamDict;
  sharedData: ISharedData;
}

export interface IDeclareTimeout extends ICommand {
  command: 'DECLARE_TIMEOUT';
  matchId: number;
  color: Color;
}

export interface IDeletePlayer extends ICommand {
  command: 'DELETE_PLAYER';
  playerId: string;
}

export interface IResign extends ICommand {
  command: 'RESIGN';
  matchId: number;
  team: Color;
}
