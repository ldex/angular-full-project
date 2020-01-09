import { Observable, Subject, combineLatest } from "rxjs";
import { FavouriteService } from "./../../services/favourite.service";
import { ProductService } from "./../../services/product.service";
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
  max
} from "rxjs/operators";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProductListComponent implements OnInit {
  title: string = "Products";

  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  productsTotalNumber$: Observable<number>;
  mostExpensiveProduct$: Observable<Product>;

  selectedProduct: Product;
  sorter: string = "-modifiedDate";

  filter: FormControl;
  filter$: Observable<string>;
  filtered: boolean = false;

  pageSize: number = 5;
  start: number = 0;
  end: number = this.pageSize;
  currentPage: number = 1;

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
    let take: number = this.pageSize * 2;
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
    this.firstPage();
    this.productService.loadProducts();
  }

  message: string = "";

  newFavourite(product: Product): void {
    this.message = `Product
                        ${product.name} 
                        added to your favourites!`;
  }

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.products$ = this.productService.products$;
    this.filter = new FormControl("");
    this.filter$ = this.filter.valueChanges
                        .pipe(
                            startWith(""),
                            tap(
                                term => {
                                    this.firstPage();
                                    this.filtered = term.trim().length > 0 ? true : false;
                                }
                            )
                        );
    this.filteredProducts$ = combineLatest(this.products$, this.filter$).pipe(
      map(([products, filterString]) =>
        products.filter(product =>
          product.name.toLowerCase().includes(filterString.toLowerCase())
        )
      )
    );
    this.productService.loadProducts();
    this.productsTotalNumber$ = this.productService.productsTotalNumber$;
    this.productService.loadProductsTotalNumber();
    this.mostExpensiveProduct$ = this.productService.getMostExpensiveProduct();
  }
}
