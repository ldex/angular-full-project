import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Component, OnInit, VERSION } from '@angular/core';
import { CartService } from './services/cart.service';
import { NetworkStatusService } from './services/network-status.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular Store';
  version = VERSION.full;
  isOnline$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private cartService:CartService,
    private networkStatusService: NetworkStatusService,
    private router: Router) {

    }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get nbCart() {
    return this.cartService.NbProducts;
  }

  login() {
    this.router.navigateByUrl("/login");
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/home");
  }

  ngOnInit() {
    this.isOnline$ = this.networkStatusService.isOnline$;
  }
}
