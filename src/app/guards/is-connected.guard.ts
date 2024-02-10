import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteNames } from '../pages/routes';
import { PeerToPeerService } from '../services/peer-to-peer.service';

@Injectable({
  providedIn: 'root'
})
export class IsConnectedGuard implements CanActivate {
  constructor(private peerToPeerService: PeerToPeerService,
              private router: Router)
  {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    console.log(!this.peerToPeerService.getIsConnected(), !this.peerToPeerService.isLocal);
    if (!(this.peerToPeerService.getIsConnected() || this.peerToPeerService.isLocal)) {
      return this.router.parseUrl(RouteNames.HOME);
    }
    return true;
  }

}
