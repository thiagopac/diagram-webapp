import { Api } from 'chessground/api';
import { PiecesDiff, Color, Key, Piece } from 'chessground/types';

import {default as ChessJS} from 'chess.js';
import { FLAGS } from 'src/app/shared/chessjs-types';



export function promoteIfNecessary(move: ChessJS.Move, cg: Api, oldColor: Color) {
  if (move.promotion) {
    const m: PiecesDiff = new Map();
    const piece: Piece = {
      role: 'queen',
      color: oldColor
    };
    m.set(move.to, piece);
    cg.setPieces(m);
  }
}

export function removeEnPassantIfNecessary(move: ChessJS.Move, cg: Api) {
  if (move.flags.includes(FLAGS.EP_CAPTURE)) {
    const enPassantSquare = move.to[0] + move.from[1] as Key;
    const m: PiecesDiff = new Map();
    m.set(enPassantSquare, undefined);
    cg.setPieces(m);
  }
}
