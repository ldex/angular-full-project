import { Product } from "./../products/product.interface";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, concat, of } from "rxjs";
import { config } from '../../environments/environment';
import {
  flatMap,
  first,
  shareReplay,
  max,
  combineLatest,
  tap
} from "rxjs/operators";


@Injectable()
export class ProductService {
  private baseUrl: string = config.apiUrl;

  private products = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.products.asObservable();

  private productsTotalNumber = new BehaviorSubject<number>(0);
  productsTotalNumber$: Observable<number> = this.productsTotalNumber.asObservable();

  constructor(private http: HttpClient) { 

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
      .pipe(shareReplay())
      .subscribe(products => {
        let currentProducts = this.products.value;
        let mergedProducts = currentProducts.concat(products);
        this.products.next(mergedProducts);
      });
  }

  loadProductsTotalNumber(): void {
    this.http
      .get<number>(this.baseUrl + "count")
      .subscribe(total => this.productsTotalNumber.next(total - 1));
  }

  getMostExpensiveProduct(): Observable<Product> {
    return this
      .products$
      .pipe(
        flatMap(results => results),
        max<Product>((a: Product, b: Product) => a.price < b.price ? -1 : 1)
      );
  }

  clearCache() {
    this.products.next([]);
  }
}
