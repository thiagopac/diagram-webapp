import { ChessInstance } from 'chess.js';
import { IGetNextMove } from './IGetNextMove';

export class NullGetNextMove implements IGetNextMove {
  async getMove(cg: ChessInstance) {
    return null;
  }
}
