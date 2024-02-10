import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ColorSide,
  IGameSettings,
  ITimerSettings,
} from 'src/app/services/game-config';

@Component({
  selector: 'dialog-new-game',
  templateUrl: './dialog-new-game.component.html',
  styleUrls: ['./dialog-new-game.component.scss'],
})
export class DialogNewGameComponent implements OnInit {
  ColorSide = ColorSide;
  side: ColorSide = ColorSide.white;
  timerSettings: ITimerSettings | undefined;
  gameSettings: IGameSettings | undefined;
  constructor(
    private dialogRef: MatDialogRef<DialogNewGameComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (Object.keys(this.data).length > 0) {
    }
  }

  ngOnInit() {}

  setOptions() {
    this.gameSettings = {
      side: this.side,
      timerSettings: this.timerSettings,
    } as IGameSettings;

    this.close();
  }

  updateTimerSettings(timerSettings: ITimerSettings) {
    this.timerSettings = timerSettings;
  }

  close() {
    this.dialogRef.close(this.gameSettings);
  }
}
