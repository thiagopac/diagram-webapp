import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color } from 'chessground/types';
import { Subscription } from 'rxjs';
import { PeerToPeerService } from 'src/app/services/peer-to-peer.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { RouteNames } from '../routes';
import { APP_BASE_HREF } from '@angular/common';
import { CommandService } from 'src/app/services/command.service';
import { UsernameProperties } from 'src/app/shared/util/username';

@Component({
  selector: 'app-prep-room',
  templateUrl: './prep-room.component.html',
  styleUrls: ['./prep-room.component.scss'],
})
export class PrepRoomComponent implements OnInit, OnDestroy {
  readonly url: string;
  readonly multiplayerGame: boolean;
  valid = false;

  private readonly connectedSubscription: Subscription;
  private readonly messageSubscription: Subscription;
  private readonly hostUrl: string;

  constructor(
    private peerToPeerService: PeerToPeerService,
    private router: Router,
    private sharedDataService: SharedDataService,
    private commandService: CommandService,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {
    this.hostUrl = `/join/${this.peerToPeerService.getHostId()}`;
    this.url = `${window.location.origin}${
      this.baseHref
    }${this.hostUrl.substring(1)}`;

    this.connectedSubscription = this.sharedDataService.newName.subscribe(
      (id) => {
        if (this.peerToPeerService.getIsHost()) {
          this.peerToPeerService.sendSingleMessage(id, {
            command: 'SET_NAMES',
            names: this.sharedDataService.getNamesSync(),
            sharedData: this.sharedDataService.getSharedDataSync(),
          });
        }
      }
    );
    this.messageSubscription = this.peerToPeerService
      .getMessageObservable()
      .subscribe((message) => {
        if (message.data.command === 'START') {
          this.router.navigate([RouteNames.PLAY]);
        }
        this.valid =
          Object.keys(this.sharedDataService.getNamesSync('white')).length >
            0 &&
          Object.keys(this.sharedDataService.getNamesSync('black')).length > 0;
      });
    this.multiplayerGame = !this.peerToPeerService.isLocal;
  }

  ngOnInit(): void {
    this.commandService.createPlayer(
      {
        properties:
          this.peerToPeerService.getProperties() as UsernameProperties,
        name: this.peerToPeerService.getAlias(),
        team: 'white',
        owner: this.peerToPeerService.getId(),
        sortNumber: 0,
      },
      this.peerToPeerService.getId()
    );
  }

  ngOnDestroy() {
    this.connectedSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }

  setTeam(team: Color) {
    this.sharedDataService.setTeam(team);
  }

  startGame() {
    this.peerToPeerService.broadcastAndToSelf({
      command: 'START',
    });
  }
}
