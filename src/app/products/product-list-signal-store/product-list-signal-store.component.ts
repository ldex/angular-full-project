import { AuthService, FavouriteService } from "../../services";
import { Product } from "../product.interface";
import {
  Component,
  signal,
  effect,
  computed,
  Signal,
  inject
} from "@angular/core";
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from "@angular/router";
import {
  Observable,
  tap,
  startWith,
  debounceTime,
  filter
} from "rxjs";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { OrderBy } from "../orderBy.pipe";
import { UpperCasePipe, JsonPipe, SlicePipe, CurrencyPipe } from "@angular/common";
import { ProductStore } from "src/app/store/product.store";

@Component({
    selector: 'app-product-list-signal-store',
    templateUrl: './product-list-signal-store.component.html',
    styleUrls: ['./product-list-signal-store.component.css'],
    imports: [FormsModule, ReactiveFormsModule, RouterLink, UpperCasePipe, JsonPipe, SlicePipe, CurrencyPipe, OrderBy]
})
export class ProductListSignalStoreComponent {

  title = signal("Products");

  message = signal("");

  private readonly productStore = inject(ProductStore);
  private readonly favouriteService = inject(FavouriteService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  products: Signal<Product[]> = this.productStore.products;
  productsNumber: Signal<number>;
  mostExpensiveProduct: Signal<Product> = this.productStore.mostExpensiveProduct;
  favourites: Signal<number> = signal(this.favouriteService.getFavouritesNb());

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
  ) {
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
    this.currentPage.update(value => ++value);
    this.selectedProduct = null;
  }

  previousPage(): void {
    this.start.update(value => value - this.pageSize());
    this.end.update(value => value - this.pageSize());
    this.currentPage.update(value => --value);
    this.selectedProduct = null;
  }

  loadMore(): void {
    this.productStore.loadProducts();
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
    this.productStore.clearList();
    this.firstPage();
  }

  newFavourite(product: Product): void {
    this.message.set(`Product
                        ${product.name}
                        added to your favourites!`);
  }
}
