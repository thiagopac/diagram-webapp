import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxChessgroundModule } from 'ngx-chessground';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { HomeComponent } from './pages/home/home.component';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JoinComponent } from './pages/join/join.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { TeamSelectionPanelComponent } from './shared/diagram/team-selection-panel/team-selection-panel.component';
import { PlayerConfigComponent } from './shared/diagram/player-config/player-config.component';
import { SnapSliderComponent } from './components/snap-slider/snap-slider.component';
import { TimerConfigComponent } from './components/timer-config/timer-config.component';
import { ChessTimerFormatPipe } from './pipes/chess-timer-format.pipe';
import { ChessTimerComponent } from './components/chess-timer/chess-timer.component';
import { ReplaceNullWithEmptyPipe } from './pipes/replace-null-with-empty.pipe';
import { AnalyseButtonComponent } from './components/analyse-button/analyse-button.component';
import { HttpClientModule } from '@angular/common/http';
import { ChessBoardContainerComponent } from './components/chess-board-container/chess-board-container.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RematchButtonComponent } from './components/rematch-button/rematch-button.component';
import { TextareaSelectallComponent } from './components/textarea-selectall/textarea-selectall.component';
import { EditableSpanComponent } from './components/editable-span/editable-span.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { HistoryComponent } from './pages/history/history.component';
import { MatTableModule } from '@angular/material/table';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DialogNewGameComponent } from 'src/app/components/dialog-new-game/dialog-new-game.component';
import { PrepRoomComponent } from 'src/app/pages/waiting-room/prep-room.component';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: { transports: ['websocket'] },
};

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    ChessTimerComponent,
    ChessTimerFormatPipe,
    LobbyComponent,
    PrepRoomComponent,
    HomeComponent,
    LoadingButtonComponent,
    JoinComponent,
    PlayerListComponent,
    ReplaceNullWithEmptyPipe,
    TeamSelectionPanelComponent,
    PlayerConfigComponent,
    SnapSliderComponent,
    TimerConfigComponent,
    AnalyseButtonComponent,
    ChessBoardContainerComponent,
    RematchButtonComponent,
    TextareaSelectallComponent,
    EditableSpanComponent,
    HistoryComponent,
    DialogNewGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChessgroundModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatListModule,
    MatSliderModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatButtonToggleModule,
    ReactiveComponentModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    // {provide: APP_BASE_HREF, useValue: '/diagram-webapp/'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
