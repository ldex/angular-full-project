import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor(
    private loginService: AuthService,
    private router: Router) {}

  canActivate() {
    if(!this.loginService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}