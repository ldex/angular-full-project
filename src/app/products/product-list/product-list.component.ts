import { Observable, combineLatest } from "rxjs";
import { FavouriteService, ProductService, SeoService } from "./../../services";
import { Product } from "./../product.interface";
import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import {
  map,
  tap,
  startWith,
  flatMap,
  max,
  debounceTime,
  catchError
} from "rxjs/operators";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProductListComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router,
    private seoService: SeoService
  ) { }

  title = "Products";
  message = "";

  products$: Observable<Product[]>;
  productsNumber = 0;
  productsTotalNumber$: Observable<number>;
  mostExpensiveProduct$: Observable<Product>;

  selectedProduct: Product;
  sorter = "-modifiedDate";

  filter: FormControl = new FormControl("");
  filter$: Observable<string>;
  filteredProducts$: Observable<Product[]>;
  filtered = false;

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  currentPage = 1;
  productsToLoad = this.pageSize * 2;

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
    let skip: number = this.end + 1;

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
    this.productService.clearCache();
    this.router.navigateByUrl('/products');
  }

  newFavourite(product: Product): void {
    this.message = `Product
                        ${product.name} 
                        added to your favourites!`;
  }

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  ngOnInit() {
    this.products$ = this.productService.products$
    this.productsTotalNumber$ = this.productService.productsTotalNumber$;
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
      combineLatest(this.products$, this.filter$)
        .pipe(
          map(
            ([products, filterString]) =>
              products.filter(product =>
                product.name.toLowerCase().includes(filterString.toLowerCase()))
          ),
          tap(lst => this.productsNumber = lst.length)
        );


    this.seoService.setTitle('Products List');
  }
}
