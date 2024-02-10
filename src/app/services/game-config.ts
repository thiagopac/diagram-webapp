export interface ITimerSettings {
  time: number;
  increment: number;
}

export interface IGameSettings {
  side: ColorSide;
  timerSettings: ITimerSettings;
}

export enum ColorSide {
  white = 'white',
  black = 'black',
}

export enum ITimerSettingsType {
  MINUTES = 'minutes',
  SECONDS = 'seconds',
}
