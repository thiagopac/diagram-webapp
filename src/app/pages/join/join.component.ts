import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingButtonComponent } from 'src/app/components/loading-button/loading-button.component';
import { PeerToPeerService } from 'src/app/services/peer-to-peer.service';
import { environment } from 'src/environments/environment';
import { RouteNames } from '../routes';
import {
  UsernameProperties,
  UsernameUtils,
} from 'src/app/shared/util/username';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit, OnDestroy, AfterViewInit {
  disabled = false;
  fg: FormGroup;
  loading = false;
  joinId = '';
  activateRouteSubscription: Subscription;
  err: any = '';
  @ViewChild('myButton', { static: false })
  button: LoadingButtonComponent | null = null;
  randomUsername: UsernameProperties = {} as UsernameProperties;
  constructor(
    private peerToPeerService: PeerToPeerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.randomUsername = this.generateRandomUsername();
    console.log('randomUsername: ', this.randomUsername);
    this.fg = new FormGroup({
      name: new FormControl(this.randomUsername.title),
      properties: new FormControl(this.randomUsername),
    });
    this.activateRouteSubscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.joinId = params.id;
        this.fg.enable();
      }
    );
  }

  generateRandomUsername(): UsernameProperties {
    return UsernameUtils.getRandomUsername();
  }

  ngOnInit(): void {
    if (this.joinId === '') this.fg.disable();
  }

  ngOnDestroy() {
    this.activateRouteSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (!environment.production) {
      setTimeout(() => {
        this.fg.setValue({
          name: this.randomUsername.title,
          properties: this.randomUsername,
        });
        this.joinGameIfValid();
      }, 1);
    }
  }

  joinGameIfValid = async () => {
    if (!this.fg.valid) return;
    this.loading = true;

    try {
      await this.joinGame();
      this.err = '';
    } catch (err) {
      this.err = err;
    } finally {
      this.loading = false;
    }
  };

  async joinGame() {
    await this.peerToPeerService.setupByConnectingToId(this.joinId);
    this.peerToPeerService.setAlias(
      this.fg.controls.name.value,
      this.fg.controls.properties.value
    );
    this.router.navigate([RouteNames.LOBBY], { replaceUrl: true });
  }
}
