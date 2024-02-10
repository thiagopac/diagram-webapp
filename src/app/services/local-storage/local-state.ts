export interface ILocalState {
  gamePgns?: IPersistedGame[];
}

export interface IPersistedGame {
  time: Date;
  pgn: string;
}
