import { Api } from 'chessground/api';
import * as ChessJS from 'chess.js';
import { Chessground } from 'chessground';
import { ChessInstance, Square } from 'chess.js';
import { Color, Key } from 'chessground/types';

export const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;

export interface Unit {
  name: string;
  run: (el: HTMLElement) => Api;
}

export const initial: Unit = {
  name: 'Play legal moves from initial position',
  run(el) {
    const chess = new Chess();
    const cg = Chessground(wrapped(el), {
      turnColor: 'white',
      movable: {
        free: false,
      },
      draggable: {
        showGhost: true,
      },
    });
    setMovableForCurrentColour(cg, chess);

    cg.set({
      movable: { events: { after: playOtherSide(cg, chess) } },
    });
    return cg;
  }
};

function wrapped(cont: HTMLElement) {
  const el = document.createElement('div');
  cont.className = 'in2d';
  cont.innerHTML = '';
  cont.appendChild(el);
  return el;
}


export function toDests(chess: ChessInstance): Map<Key, Key[]> {
  const dests = new Map();
  chess.SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length) {
      dests.set(
        s,
        ms.map((m) => m.to)
      );
    }
  });
  return dests;
}

export function playOtherSide(cg: Api, chess: ChessInstance) {
  return (from: Key, to: Key) => {
    chess.move({ from: from as Square, to: to as Square });
    setMovableForCurrentColour(cg, chess);
  };
}

export function setMovableForCurrentColour(cg: Api, chess: ChessInstance) {
  cg.set({
    turnColor: toColor(chess),
    movable: {
      color: toColor(chess),
      dests: toDests(chess),
    },
  });
}

export function setMmovableForPremove(cg: Api, chess: ChessInstance) {
  cg.set({
    turnColor: toColor(chess),
    movable: {
      color: invertColor(toColor(chess)),
      dests: toDests(chess),
    },
  });
}

export function toColor(chess: ChessInstance): Color {
  return chess.turn() === 'w' ? 'white' : 'black';
}

export function invertColor(color: Color) {
  return color === 'black' ? 'white' : 'black';
}

export function toLightDark(chess: ChessInstance): 'light' | 'dark' {
  return chess.turn() === 'w' ? 'light' : 'dark';
}
