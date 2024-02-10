import { It, Mock } from 'typemoq';
import { IMock } from 'typemoq/Api/IMock';
import { IGetNextMove } from '../components/chess-board/helpers/GetNextMove/IGetNextMove';
import { GetNextMoveProviderService } from '../services/get-next-move-provider.service';

export function getNextMoveGetterProviderMock(getNextMove?: IGetNextMove): IMock<GetNextMoveProviderService> {
  const nextMoveGetterProviderMock = Mock.ofType<GetNextMoveProviderService>();
  nextMoveGetterProviderMock.setup(m => m.getNextMoveGetter(It.isAny())).returns(() => {
    const ret = getNextMove ?? Mock.ofType<IGetNextMove>().object;
    return ret;
  });
  return nextMoveGetterProviderMock;
}
