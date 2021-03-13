import { Product } from "./../products/product.interface";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, of } from "rxjs";
import { config } from '../../environments/environment';
import {
  flatMap,
  first,
  shareReplay,
  map,
  delay,
  filter,
  switchMap
} from "rxjs/operators";


@Injectable()
export class ProductService {
  private baseUrl: string = config.apiUrl;

  private products = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.products.asObservable();
  mostExpensiveProduct$: Observable<Product>;
  productsTotalNumber$: Observable<number>;

  constructor(private http: HttpClient) {

    this.loadProducts();
    this.initProductsTotalNumber();
    this.initMostExpensiveProduct();

  }

  private initProductsTotalNumber() {
    this.productsTotalNumber$ =
      this
        .http
        .get<number>(this.baseUrl + "count")
        .pipe(
          shareReplay()
        );
  }

  private initMostExpensiveProduct() {
    this.mostExpensiveProduct$ =
      this
      .products$
      .pipe(
        filter(products => products.length != 0),
        //or skipWhile(products => products.length == 0),
        switchMap(
          products => of(products)
                        .pipe(
                          map(products => [...products].sort((p1, p2) => p1.price > p2.price ? -1 : 1)),
                          flatMap(p => p), // or mergeAll(),
                          first() // complete!
                        )
        )
      )
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }

  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    updatedProduct.id = id;
    return this.http.put<Product>(this.baseUrl + id, updatedProduct);
  }

  getProduct(id: number | string): Observable<Product> {
    let url: string = this.baseUrl + id;
    return this.http.get<Product>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.products$.pipe(
      flatMap(p => p),
      first(product => product.id == id)
    );
  }

  loadProducts(skip: number = 0, take: number = 10): void {
    let url = this.baseUrl + `?$skip=${skip}&$top=${take}&$orderby=ModifiedDate%20desc`;

    if (skip == 0 && this.products.value.length > 0) return;

    this.http
      .get<Product[]>(url)
      .pipe(
        delay(1000),
        shareReplay()
      )
      .subscribe(products => {
        let currentProducts = this.products.value;
        let mergedProducts = currentProducts.concat(products);
        this.products.next(mergedProducts);
      });
  }

  clearList() {
    this.products.next([]);
    this.loadProducts();
    this.initProductsTotalNumber();
  }
}
