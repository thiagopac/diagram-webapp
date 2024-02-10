import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChessBoardResetService } from 'src/app/services/chess-board-reset.service';

@Component({
  selector: 'app-chess-board-container',
  templateUrl: './chess-board-container.component.html',
  styleUrls: ['./chess-board-container.component.scss'],
})
export class ChessBoardContainerComponent implements OnInit, OnDestroy {
  visible = true;
  sub!: Subscription;

  constructor(private chessBoardResetService: ChessBoardResetService) {}

  ngOnInit(): void {
    this.sub = this.chessBoardResetService
      .getResetObservable()
      .subscribe(() => {
        this.visible = false;
        setTimeout(() => (this.visible = true), 500);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
