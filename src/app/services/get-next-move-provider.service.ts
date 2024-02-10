import { Injectable } from '@angular/core';
import { IGetNextMove } from '../components/chess-board/helpers/GetNextMove/IGetNextMove';
import { StockfishGetNextMove } from '../components/chess-board/helpers/GetNextMove/StockfishGetNextMove';
import { IEngineSettings } from '../components/chess-board/helpers/PlayerTeamHelper';
import { EngineProviderStockfishService } from '../services/engine-provider-stockfish.service';

@Injectable({
  providedIn: 'root'
})
export class GetNextMoveProviderService {

  constructor(
    private engineProviderStockfishService: EngineProviderStockfishService,
  ) { }

  getNextMoveGetter(engineSettings: IEngineSettings): IGetNextMove {
    return new StockfishGetNextMove(engineSettings, this.engineProviderStockfishService);
  }
}
