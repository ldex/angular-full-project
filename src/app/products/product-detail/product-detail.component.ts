import { Observable, Subscription } from 'rxjs';
import { ProductService, FavouriteService, CartService, SeoService, NotificationService } from './../../services';
import { Product } from './../product.interface';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;
  product$: Observable<Product>;
  productSub: Subscription;

  constructor(
    private favouriteService: FavouriteService,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService
  ) { }

  deleteProduct(id: number) {
    this.productService
      .deleteProduct(id)
      .subscribe(
        () => {
          this.productService.clearCache();
          this.notificationService.notifyMessage('Product deleted');
          this.router.navigateByUrl("/products?refresh");
        },
        error => this.notificationService.notifyError('Could not delete product. ' + error)
        ,);
  }

  addToCart(product: Product) {
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

  ngOnInit() {
    let id = this.route.snapshot.params["id"];
    if (id) {
      this.product$ = this.productService.getProductById(id);
    }
    this.seoService.setTitle('Product Details');
  }

  showAddToFavouritesButton(product: Product): boolean {
    return !this.favouriteService.IsInFavourites(product);
  }

}
