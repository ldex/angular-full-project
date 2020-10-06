import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginRouteGuard implements CanActivate {

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