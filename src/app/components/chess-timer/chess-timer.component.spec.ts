import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplaceNullWithEmptyPipe } from 'src/app/pipes/replace-null-with-empty.pipe';
import { ChessStatusService } from 'src/app/services/chess-status.service';
import { ChessTimerFormatPipe } from 'src/app/pipes/chess-timer-format.pipe';
import { ChessTimerService } from 'src/app/services/chess-timer.service';

import { ChessTimerComponent } from './chess-timer.component';

describe('ChessTimerComponent', () => {
  let component: ChessTimerComponent;
  let fixture: ComponentFixture<ChessTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChessTimerComponent, ReplaceNullWithEmptyPipe, ChessTimerFormatPipe ],
      providers: [ChessTimerService, ChessStatusService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
