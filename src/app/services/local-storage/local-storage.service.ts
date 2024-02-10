import { Injectable } from '@angular/core';
import { ILocalState } from './local-state';

const PREFIX = 'diagram-webapp-';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  localState: ILocalState;

  constructor() {
    this.localState = this.getLocalState();
  }

  addGame(pgn: string) {
    const gamePgns = this.localState.gamePgns ?? [];
    gamePgns.push({
      pgn,
      time: new Date(),
    });
    this.localState.gamePgns = gamePgns;
    this.updateLocalState();
  }

  getGames() {
    return this.localState.gamePgns;
  }

  private getLocalState(): ILocalState {
    const item = localStorage.getItem(PREFIX);
    if (item === null) {
      return {
        gamePgns: [],
      };
    }
    return JSON.parse(item);
  }

  private updateLocalState() {
    localStorage.setItem(PREFIX, JSON.stringify(this.localState));
  }
}
