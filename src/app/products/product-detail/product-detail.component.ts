import { Observable, Subscription } from 'rxjs';
import { ProductService, FavouriteService, SeoService, NotificationService, CartSubjectService, CartService } from './../../services';
import { Product } from './../product.interface';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { config } from 'src/environments/environment';

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
  useCartSubject = config.useCartSubject;
  showDeleteConfirmDialog: boolean = false;

  constructor(
    private favouriteService: FavouriteService,
    private productService: ProductService,
    private cartService:CartService,
    private cartServiceSubject:CartSubjectService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService
  ) { }

  deleteConfirm() {
    this.showDeleteConfirmDialog = true;
  }

  deleteConfirmClosed(msg) {
    console.info("Delete confirm: " + msg);
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

  ngOnInit() {
    this.showDeleteConfirmDialog = false;
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
