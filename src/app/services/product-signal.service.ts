import { Product } from "../products/product.interface";
import { Injectable, Signal, signal, computed, inject } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  of,
  first,
  shareReplay,
  map,
  delay,
  filter,
  switchMap,
  mergeMap,
  tap
} from "rxjs";
import { config } from "../../environments/environment";

@Injectable()
export class ProductSignalService {

  constructor() {
    this.loadProducts();
  }

  readonly #baseUrl: string = `${config.apiUrl}/products`;
  readonly #http = inject(HttpClient);

  readonly #products = signal<Product[]>([]);
  public readonly products = this.#products.asReadonly();

  pageToLoad = 1;
  productsToLoad = 10;

  private readonly mostExpensiveProduct$: Observable<Product> = toObservable<Product[]>(this.products).pipe(
    filter((products) => products.length != 0),
    //or skipWhile(products => products.length == 0),
    switchMap((products) =>
      of(products).pipe(
        map((products) =>
          [...products].sort((p1, p2) => (p1.price > p2.price ? -1 : 1))
        ),
        // [{p1}, {p2}, {p3}]
        mergeMap((p) => p), // or mergeAll(),
        // {p1}, {p2}, {p3}
        first() // complete!
      )
    )
  );

  public readonly mostExpensiveProduct: Signal<Product> = computed<Product>(
    toSignal(this.mostExpensiveProduct$)
  )

  deleteProduct(id: number): Observable<any> {
    return this.#http.delete(this.#baseUrl + '/' + id);
  }

  insertProduct(newProduct: Product): Observable<Product> {
    newProduct.modifiedDate = new Date();
    return this.#http.post<Product>(this.#baseUrl, newProduct);
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    updatedProduct.id = id;
    updatedProduct.modifiedDate = new Date();
    return this.#http.put<Product>(this.#baseUrl + '/' + id, updatedProduct);
  }

  getProduct(id: number | string): Observable<Product> {
    let url: string = this.#baseUrl + '/' + id;
    return this.#http.get<Product>(url);
  }

  loadProducts(): void {
    const params = {
      page: this.pageToLoad++,
      limit: this.productsToLoad,
      sortBy: 'modifiedDate',
      order: 'desc'
    }

    const options = {
      params: params
    };

    this.#http
      .get<Product[]>(this.#baseUrl, options)
      .pipe(
        delay(200),
        shareReplay()
      )
      .subscribe(response => {
        let newProducts = response;

        let currentProducts = this.#products();
        let mergedProducts = currentProducts.concat(newProducts);
        this.#products.set(mergedProducts);
      });
  }

  clearList() {
    this.#products.set([]);
    this.pageToLoad = 1;
    this.loadProducts();
  }
}
