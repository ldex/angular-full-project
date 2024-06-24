import { AuthService, FavouriteService, ProductService, SeoService } from "./../../services";
import { Product } from "./../product.interface";
import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
  Observable, combineLatest,
  map,
  tap,
  startWith,
  debounceTime,
  filter,
  shareReplay
} from "rxjs";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrderBy } from "../orderBy.pipe";
import { AsyncPipe, UpperCasePipe, JsonPipe, SlicePipe, CurrencyPipe, I18nPluralPipe } from "@angular/common";

@Component({
    selector: "app-product-list",
    templateUrl: "./product-list.component.html",
    styleUrls: ["./product-list.component.css"],
    encapsulation: ViewEncapsulation.Emulated,
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, RouterLink, AsyncPipe, UpperCasePipe, JsonPipe, SlicePipe, CurrencyPipe, I18nPluralPipe, OrderBy]
})
export class ProductListComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router,
    private seoService: SeoService,
    private authService: AuthService
  ) {

  }

  title = "Products";
  message = "";

  products$: Observable<Product[]>;
  productsNumber$: Observable<number>;
  productsTotalNumber$: Observable<number>;
  mostExpensiveProduct$: Observable<Product>;

  sorter = "-modifiedDate";

  filter: FormControl = new FormControl("");
  filter$: Observable<string>;
  filteredProducts$: Observable<Product[]>;
  filtered = false;

  // Pagination
  productsToLoad = this.productService.productsToLoad;
  pageSize = this.productsToLoad / 2;
  start = 0;
  end = this.pageSize;
  currentPage = 1;

  firstPage(): void {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }

  nextPage(): void {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
  }

  previousPage(): void {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
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

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.products$ = this.productService.products$.pipe(filter(products => products.length > 0))
    this.productsTotalNumber$ = this.productService.productsTotalNumber$.asObservable();
    this.mostExpensiveProduct$ = this.productService.mostExpensiveProduct$;

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

    this.filteredProducts$ =
      combineLatest([this.products$, this.filter$])
        .pipe(
          map(
            ([products, filterString]) =>
              products.filter(product =>
                product.name.toLowerCase().includes(filterString.toLowerCase()))
          ),
          shareReplay()
        );

    this.productsNumber$ = this.filteredProducts$.pipe(map(products => products.length))

    this.seoService.setTitle('Products List');
  }
}
