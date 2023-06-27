import { FavouriteService, ProductService } from "./../../services";
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

  title = "Products";
  message = "";

  products: Signal<Product[]>;
  productsNumber: Signal<number>;
  productsTotalNumber: Signal<number>;
  mostExpensiveProduct: Signal<Product>;
  favourites: Signal<number>;


  selectedProduct: Product;
  sorter = "-modifiedDate";

  filter: FormControl = new FormControl("");
  filter$: Observable<string>;
  filterSig: Signal<string>;
  filteredProducts: Signal<Product[]>;
  filtered = false;

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  currentPage = 1;
  productsToLoad = this.pageSize * 2;

  constructor(
    private productService: ProductService,
    favouriteService: FavouriteService,
    private router: Router
  ) {
    this.products = toSignal(this.productService.products$.pipe(filter(products => products.length > 0)), {initialValue: []});
    this.productsTotalNumber = toSignal(this.productService.productsTotalNumber$, {initialValue: 0});
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

  firstPage(): void {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }

  nextPage(): void {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
    this.selectedProduct = null;
  }

  previousPage(): void {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
    this.selectedProduct = null;
  }

  loadMore(): void {
    let take: number = this.productsToLoad;
    let skip: number = this.end;

    this.productService.loadProducts(skip, take);
  }

  sortList(propertyName: string): void {
    this.sorter = this.sorter.startsWith("-") ? propertyName : "-" + propertyName;
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
    this.message = `Product
                        ${product.name}
                        added to your favourites!`;
  }
}
