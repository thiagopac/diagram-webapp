import { ChessTimerFormatPipe } from './chess-timer-format.pipe';

describe('ChessTimerFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new ChessTimerFormatPipe();
    expect(pipe).toBeTruthy();
  });

  it('certain values', () => {
    const pipe = new ChessTimerFormatPipe();
    expect(pipe.transform(10)).toEqual('00:10.00');
    expect(pipe.transform(9)).toEqual('00:09.00');
    expect(pipe.transform(8.55)).toEqual('00:08.55');

  });
});
