import { IEngine } from './IEngine';

export interface IEngineProvider {
  getEngine(): Promise<IEngine>;
}
