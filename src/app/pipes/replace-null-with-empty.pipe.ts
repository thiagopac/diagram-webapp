import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceNullWithEmpty'
})
export class ReplaceNullWithEmptyPipe implements PipeTransform {

  transform(value: string | null, ...args: unknown[]): string {
    return value ?? '';
  }

}
