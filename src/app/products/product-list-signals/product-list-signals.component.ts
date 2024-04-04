import { AuthService, FavouriteService, ProductService } from "./../../services";
import { Product } from "./../product.interface";
import {
  Component,
  signal,
  effect,
  computed,
  Signal
} from "@angular/core";
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Router } from "@angular/router";
import {
  Observable,
  tap,
  startWith,
  debounceTime,
  filter
} from "rxjs";
import { FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-product-list-signals',
  templateUrl: './product-list-signals.component.html',
  styleUrls: ['./product-list-signals.component.css']
})
export class ProductListSignalsComponent {

  title = signal("Products");

  message = signal("");

  products: Signal<Product[]>;
  productsNumber: Signal<number>;
  productsTotalNumber: Signal<number>;
  mostExpensiveProduct: Signal<Product>;
  favourites: Signal<number>;


  selectedProduct: Product;
  sorter = signal("-modifiedDate");

  filter: FormControl = new FormControl("");
  filter$: Observable<string>;
  filterSig: Signal<string>;
  filteredProducts: Signal<Product[]>;
  filtered = false;

  // Pagination
  pageSize = signal(5);
  start = signal(0);
  end = signal(this.pageSize());
  currentPage = signal(1);
  productsToLoad = computed(() => this.pageSize() * 2);

  constructor(
    private productService: ProductService,
    favouriteService: FavouriteService,
    private router: Router,
    private authService: AuthService
  ) {
    this.products = toSignal(this.productService.products$.pipe(filter(products => products.length > 0)), {initialValue: []});
    this.productsTotalNumber = toSignal(this.productService.productsTotalNumber$.asObservable(), {initialValue: 0});
    this.mostExpensiveProduct = toSignal(this.productService.mostExpensiveProduct$);
    this.favourites = signal(favouriteService.getFavouritesNb());

    this.filter$ = this.filter.valueChanges
      .pipe(
        debounceTime(500),
        startWith(""),
        tap(
          term => {
            this.firstPage();
            this.filtered = term.trim().length > 0 ? true : false;
          }
        )
      );

    this.filterSig = toSignal(this.filter$, {initialValue: ""});

    this.filteredProducts = computed(() => this.products().filter(product => product.name.toLowerCase().includes(this.filterSig().toLowerCase())));

    this.productsNumber = computed(() => this.filteredProducts().length);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  firstPage(): void {
    this.start.set(0);
    this.end.set(this.pageSize());
    this.currentPage.set(1);
  }

  nextPage(): void {
    this.start.update(value => value + this.pageSize());
    this.end.update(value => value + this.pageSize());
    this.currentPage.update(value => value++);
    this.selectedProduct = null;
  }

  previousPage(): void {
    this.start.update(value => value - this.pageSize());
    this.end.update(value => value - this.pageSize());
    this.currentPage.update(value => value--);
    this.selectedProduct = null;
  }

  loadMore(): void {
    let take = this.productsToLoad;
    let skip = this.end;

    this.productService.loadProducts(skip(), take());
  }

  sortList(propertyName: string): void {
    this.sorter.set(this.sorter().startsWith("-") ? propertyName : "-" + propertyName);
    this.firstPage();
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;
    this.router.navigateByUrl("/products/" + product.id);
  }

  refreshList() {
    this.productService.clearList();
    this.firstPage();
  }

  newFavourite(product: Product): void {
    this.message.set(`Product
                        ${product.name}
                        added to your favourites!`);
  }
}
