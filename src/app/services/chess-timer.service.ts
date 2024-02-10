import { Injectable, OnDestroy } from '@angular/core';
import { Color } from 'chessground/types';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { ITimerSettings } from '../shared/peer-to-peer/shared-data';

interface ITimerState {
  turn: Color;
  msWhenLastChanged: number;
}

@Injectable()
export class ChessTimerService implements OnDestroy {
  private timeout = new Subject<Color>();

  private timers = {
    white: new BehaviorSubject(10),
    black: new BehaviorSubject(10)
  };
  private timerState: ITimerState = {
    turn: 'white',
    msWhenLastChanged: -1
  };

  private paused = true;
  private myTimer = timer(33, 33);
  private whiteIncrement = 0;
  private blackIncrement = 0;
  private myTimerSubscription?: Subscription;

  constructor() {
  }

  ngOnDestroy() {
    this.myTimerSubscription?.unsubscribe();
  }

  getTimerObservable(color: Color) {
    return this.timers[color].asObservable();
  }

  getTimeSync(color: Color) {
    return this.timers[color].getValue();
  }

  getTimeoutObservable() {
    return this.timeout.asObservable();
  }

  getCurrentTime() {
    return this.timers[this.timerState.turn].getValue();
  }

  private setStartingTime(totalTimeSeconds: number, startingTurn: Color = 'white', whiteIncrement = 20 * 1000, blackIncrement = 0) {
    this.timers.white.next(totalTimeSeconds);
    this.timers.black.next(totalTimeSeconds);
    this.timerState.turn = startingTurn;
    this.whiteIncrement = whiteIncrement;
    this.blackIncrement = blackIncrement;
  }

  setupTimer(timerSettings: ITimerSettings, startingColor: Color) {
    if (!timerSettings.whiteTime) throw new Error('white time must be defined');
    if (!timerSettings.asymmetric) {
      this.setStartingTime(timerSettings.whiteTime, startingColor,
        timerSettings.whiteIncrement,
        timerSettings.whiteIncrement);
    } else {
      this.setStartingTime(timerSettings.whiteTime, startingColor,
        timerSettings.whiteIncrement,
        timerSettings.blackIncrement);
    }
  }

  startTimer() {
    this.unpauseTimer();
    this.resetTimer();
  }

  setTimeForCurrentTurn(time: number) {
    const timerBehaviourSubject = this.timers[this.timerState.turn];
    timerBehaviourSubject.next(time);
    this.timerState.msWhenLastChanged = Date.now();
  }

  pauseTimer() {
    this.paused = true;
  }

  unpauseTimer() {
    this.timerState.msWhenLastChanged = Date.now();
    this.paused = false;
  }

  setTurn(turn: Color) {
    if (this.timerState.turn === turn) {
      throw new Error('Tried to set the same turn?');
    }
    if (!this.paused) {
      this.incrementTimerForCurrentTurn(this.timerState.turn === 'white' ? this.whiteIncrement : this.blackIncrement);
    }
    this.timerState.turn = turn;
    this.resetTimer();
    this.timerState.msWhenLastChanged = Date.now();
  }

  tickHandlerExposed = () => this.tickHandler();

  private resetTimer() {
    this.myTimerSubscription?.unsubscribe();
    this.myTimerSubscription = this.myTimer.subscribe(this.tickHandler.bind(this));
  }

  private tickHandler() {
    if (this.paused) return;
    const currentMs = Date.now();
    const diff = currentMs - this.timerState.msWhenLastChanged;

    const timerBehaviourSubject = this.timers[this.timerState.turn];
    if (timerBehaviourSubject.getValue() !== 0) {
      timerBehaviourSubject.next(Math.max(0, timerBehaviourSubject.getValue() - diff / 1000));
      if (timerBehaviourSubject.getValue() === 0) {
        this.timeout.next(this.timerState.turn);
      }
    }
    this.timerState.msWhenLastChanged = currentMs;
  }

  private incrementTimerForCurrentTurn(ms: number) {
    const color = this.timerState.turn;
    this.setTimeForCurrentTurn(this.timers[color].getValue() + ms);
  }
}
