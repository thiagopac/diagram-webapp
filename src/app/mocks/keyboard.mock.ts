import { Mock } from 'typemoq';

export const arrowLeftMock = Mock.ofType<KeyboardEvent>();
arrowLeftMock.setup(t => t.key).returns(() => 'ArrowLeft');
export const arrowLeftEvent = arrowLeftMock.target;
export const arrowRightMock = Mock.ofType<KeyboardEvent>();
arrowRightMock.setup(t => t.key).returns(() => 'ArrowRight');
export const arrowRightEvent = arrowRightMock.target;
