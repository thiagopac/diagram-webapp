import { ChessInstance } from 'chess.js';
import { timer } from 'rxjs';
import { IGetNextMove } from './IGetNextMove';

export class DummyGetNextMove implements IGetNextMove {
  async getMove(cg: ChessInstance) {
    const moves = cg.moves({ verbose: true });
    await timer(500).toPromise();
    if (moves.length == 0) {
      throw new Error('oh no');
    }
    return moves[0];
  }

}
