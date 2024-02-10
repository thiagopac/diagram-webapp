import { Mock } from 'typemoq';
import { IEngineSettings } from '../components/chess-board/helpers/PlayerTeamHelper';
import { getNextMoveGetterProviderMock } from './next-move-getter-provider.mock';

describe('NextmoveGetterProvider', () => {
  it('works correctly', () => {
    const nextMoveGetterProviderMock = getNextMoveGetterProviderMock();
    expect(nextMoveGetterProviderMock.object).not.toBeFalsy();
    const handler = nextMoveGetterProviderMock.object.getNextMoveGetter(Mock.ofType<IEngineSettings>().object);
    expect(handler).not.toBeFalsy();
  });
});
