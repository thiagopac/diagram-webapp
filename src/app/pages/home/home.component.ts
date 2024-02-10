import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogNewGameComponent } from 'src/app/components/dialog-new-game/dialog-new-game.component';
import { LoadingButtonComponent } from 'src/app/components/loading-button/loading-button.component';
import { IGameSettings } from 'src/app/services/game-config';
import { PeerToPeerService } from 'src/app/services/peer-to-peer.service';
import { SocketService } from 'src/app/services/socket.service';
import {
  UsernameProperties,
  UsernameUtils,
} from 'src/app/shared/util/username';
import { RouteNames } from '../routes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  fg: FormGroup;
  loading = false;
  err = '';
  @ViewChild('myButton', { static: false })
  button: LoadingButtonComponent | null = null;
  openInvites: any[] = [];
  public window = window;
  constructor(
    private peerToPeerService: PeerToPeerService,
    private router: Router,
    private socketService: SocketService,
    private dialogRef: MatDialog,
    @Inject(APP_BASE_HREF) public baseHref: string
  ) {
    const randomUsername: any = this.generateRandomUsername();
    this.fg = new FormGroup({
      name: new FormControl(randomUsername.title),
      properties: new FormControl(randomUsername),
    });
  }

  ngOnInit(): void {
    this.socketService.listInvites();

    this.socketService.onInvitesListed().subscribe((response: any) => {
      console.log('invites: ', response.data);
      this.openInvites = response.data;
    });
  }

  hostGameIfValid = async (gameSettings: IGameSettings) => {
    if (!this.fg.valid) return;
    this.loading = true;

    try {
      await this.hostGame(gameSettings);
      this.err = '';
    } catch (err) {
      typeof err === 'string' ? (this.err = err) : console.log(err);
    } finally {
      this.loading = false;
    }
  };

  hostTeamGameIfValid = async () => {
    if (!this.fg.valid) return;
    this.loading = true;

    try {
      await this.hostGame();
      this.err = '';
      this.addGameToServer({
        owner: this.fg.controls.name.value,
        pairingKey: this.peerToPeerService.getHostId(),
      });
    } catch (err) {
      typeof err === 'string' ? (this.err = err) : console.log(err);
    } finally {
      this.loading = false;
    }
  };

  localGame() {
    this.peerToPeerService.setAlias(
      this.fg.controls.name.value,
      this.fg.controls.properties.value
    );
    this.peerToPeerService.isLocal = true;
    this.router.navigate([RouteNames.LOBBY], { replaceUrl: true });
  }

  async hostGame(gameSettings?: IGameSettings) {
    this.peerToPeerService.setAlias(
      this.fg.controls.name.value,
      this.fg.controls.properties.value
    );
    await this.peerToPeerService.setupAsHost();

    if (gameSettings) {
      this.addGameToServer({
        owner: this.fg.controls.name.value,
        // side: gameSettings.side,
        // timeControl: gameSettings.timerSettings.time,
        // increment: gameSettings.timerSettings.increment,
        pairingKey: this.peerToPeerService.getHostId(),
      });
      this.router.navigate([RouteNames.PREP_ROOM], { replaceUrl: true });
    } else {
      this.router.navigate([RouteNames.LOBBY], { replaceUrl: true });
    }
  }

  addGameToServer(game?: any) {
    this.socketService.createGame(game);
  }

  generateRandomUsername(): UsernameProperties {
    return UsernameUtils.getRandomUsername();
  }

  openDialog(): void {
    const dialogRef = this.dialogRef.open(DialogNewGameComponent, {
      height: 'auto',
      width: '500px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((gameSettings) => {
      if (typeof gameSettings === 'object') {
        this.hostGameIfValid(gameSettings);
      }
    });
  }

  ngOnDestroy(): void {}
}
