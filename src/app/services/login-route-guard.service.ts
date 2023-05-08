import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { Injectable } from '@angular/core';

@Injectable()
export class LoginRouteGuardService  {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate() {
    if(!this.authService.isLoggedIn()) {
      return this.router.parseUrl('/login');
    }
    return true;
  }
}