import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessBoardResetService {
  private reset = new Subject<boolean>();

  constructor() { }

  doReset() {
    this.reset.next(true);
  }

  getResetObservable = () => this.reset.asObservable();
}
