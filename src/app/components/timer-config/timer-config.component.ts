import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ISharedData } from 'src/app/shared/peer-to-peer/shared-data';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ITimerSettings } from 'src/app/services/game-config';
import { ITimerSettingsType } from 'src/app/services/game-config';

@Component({
  selector: 'app-timer-config',
  templateUrl: './timer-config.component.html',
  styleUrls: ['./timer-config.component.scss'],
})
export class TimerConfigComponent implements OnInit {
  sharedData: Observable<ISharedData>;
  @Output() timerSettingsUpdated = new EventEmitter();
  timerSettings: ITimerSettings = { time: 180, increment: 2 } as ITimerSettings;
  typeMinutes: ITimerSettingsType = ITimerSettingsType.MINUTES;
  typeSeconds: ITimerSettingsType = ITimerSettingsType.SECONDS;

  updateWhiteTime = (val: number) => {
    this.sharedDataService.setSharedData({
      timerSettings: { whiteTime: val },
    });
    this.timerSettings.time = val;
  };

  updateWhiteIncrement = (val: number) => {
    this.sharedDataService.setSharedData({
      timerSettings: { whiteIncrement: val },
    });
    this.timerSettings.increment = val;
  };

  constructor(private sharedDataService: SharedDataService) {
    this.sharedData = this.sharedDataService.getSharedData();
  }

  ngOnInit(): void {
    this.updateTimerSettings();
  }

  updateTimerSettings() {
    this.timerSettingsUpdated.emit(this.timerSettings);
  }
}
