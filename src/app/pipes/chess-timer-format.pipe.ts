import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'luxon';

@Pipe({
  name: 'chessTimerFormat'
})
export class ChessTimerFormatPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const val: number = value as number;
    if (val === undefined) return value;

    if (val > 10) {
      return Duration.fromMillis((val + 0.99) * 1000).toFormat('mm:ss');
    }
    return Duration.fromMillis(Math.round(val * 100) * 10).toFormat('mm:ss.SS').slice(0, 8);
  }
}
