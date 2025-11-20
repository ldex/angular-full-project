import { Observable, Subscription } from 'rxjs';
import { ProductService, FavouriteService, NotificationService, CartSubjectService, CartService, AuthService } from './../../services';
import { Product } from './../product.interface';
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from "@angular/router";
import { config } from 'src/environments/environment';
import { DefaultPipe } from '../default.pipe';
import { AsyncPipe, UpperCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ConfirmDirective } from '../confirm.directive';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ConfirmDirective, AsyncPipe, UpperCasePipe, CurrencyPipe, DatePipe, DefaultPipe]
})
export class ProductDetailComponent {
  private favouriteService = inject(FavouriteService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cartServiceSubject = inject(CartSubjectService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private authService = inject(AuthService);


  @Input() product: Product;

  @Input()
  set id(productId: string) {
    this.product$ = this.productService.getProductById(+productId);
  }

  product$: Observable<Product>;
  productSub: Subscription;
  useCartSubject = config.useCartSubject;
  showDeleteConfirmDialog: boolean = false;


  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  deleteProduct(id: number) {
    this.productService
      .deleteProduct(id)
      .subscribe(
        {
          next: () => {
            this.productService.clearList();
            this.notificationService.notifyMessage('Product deleted');
            this.router.navigateByUrl("/products?refresh");
          },
          error: error => this.notificationService.notifyError('Could not delete product. ' + error)
        });
  }

  addToCart(product: Product) {
    if(this.useCartSubject)
      this.cartServiceSubject.addToCart(product);
    else
      this.cartService.addToCart(product);
  }

  updateProduct(product: Product) {
    this.router.navigateByUrl("/products/update/" + product.id);
  }


  addToFavourites(product: Product) {
    this.favouriteService.addToFavourites(product);
  }

  removeFromFavourites(product: Product) {
    this.favouriteService.removeFromFavourites(product);
  }

  showAddToFavouritesButton(product: Product): boolean {
    return !this.favouriteService.IsInFavourites(product);
  }

}
