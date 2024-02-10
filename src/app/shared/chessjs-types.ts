import { default as ChessJS } from 'chess.js';
export const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;

const h = new Chess();
export const FLAGS = h.FLAGS;

/*
I want something like this to work, but alas

declare var h: ChessInstance;
export let FLAGS: typeof h.FLAGS;
 */
