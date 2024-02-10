import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../pages/routes';

@Injectable({
  providedIn: 'root'
})
export class RouteUtilsService {

  constructor(
    private router: Router
  ) { }

  resetCurrentRoute() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([RouteNames.PLAY]);
  });   }
}
