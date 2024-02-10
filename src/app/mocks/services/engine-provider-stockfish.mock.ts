import { EngineProviderStockfishService } from 'src/app/services/engine-provider-stockfish.service';
import { IEngine } from 'src/app/shared/engine/IEngine';
import { Mock } from 'typemoq';

export function getEngineProviderStockfishMock(engine?: IEngine): EngineProviderStockfishService {
  const m = Mock.ofType<EngineProviderStockfishService>();
  m.setup(t => t.getEngine).returns(() => async () => engine ?? Mock.ofType<IEngine>().object);
  return m.object;
}
