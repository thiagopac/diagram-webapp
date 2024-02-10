import { ChessInstance, ShortMove } from 'chess.js';

export interface IGetNextMove {
  getMove(chess: ChessInstance): Promise<ShortMove | null>;
}
