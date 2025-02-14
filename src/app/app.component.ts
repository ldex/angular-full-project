import { Router, RouterModule } from '@angular/router';
import { Component, isDevMode, OnInit, VERSION } from '@angular/core';
import { AuthService, CartService, CartSubjectService, NetworkStatusService } from './services/';
import { Observable } from 'rxjs';
import { config } from 'src/environments/environment';
import { AsyncPipe } from '@angular/common';
import { NotificationComponent } from './shared/notification/notification.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterModule, AsyncPipe, NotificationComponent]
})
export class AppComponent implements OnInit {
  title = 'Angular Store';
  version = VERSION.full;
  isOnline$: Observable<boolean>;
  cartProductsNb$: Observable<number>;
  useCartSubject = config.useCartSubject;
  isDevMode = isDevMode();

  constructor(
    private authService: AuthService,
    private cartService:CartService,
    private cartServiceSubject:CartSubjectService,
    private networkStatusService: NetworkStatusService,
    private router: Router) {

    }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  cartProductsNb() {
    console.count("*** cartProductsNb()");
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

    this.cartProductsNb$ = this
                            .cartServiceSubject
                            .productsNb$
  }
}
