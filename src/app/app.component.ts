import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Component, OnInit, VERSION } from '@angular/core';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular Store';
  version = VERSION.full;

  constructor(
    private loginService: AuthService,
    private cartService:CartService,
    private router: Router) {

    }

  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  get nbCart() {
    return this.cartService.NbProducts;
  }

  login() {
    this.router.navigateByUrl("/login");
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl("/home");
  }

  ngOnInit() {
  }
}
