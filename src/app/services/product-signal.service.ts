import { Product } from "../products/product.interface";
import { Injectable, Signal, signal, computed, inject } from "@angular/core";
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  BehaviorSubject,
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

  readonly #productsTotalNumber = signal(0);
  public readonly productsTotalNumber = this.#productsTotalNumber.asReadonly();

  public productsToLoad = signal(10);

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

  loadProducts(skip: number = 0, take: number = this.productsToLoad()): void {
    if (skip == 0 && this.#products().length > 0) return;

    const params = {
        _start: skip,
        _limit: take,
        _sort: 'modifiedDate',
        _order: 'desc'
    }

    const options = {
      params: params,
      observe: 'response' as 'response' // in order to read params from the response header
    };

    this.#http
      .get(this.#baseUrl, options)
      .pipe(
        delay(200),
        tap(response => {
          let count = response.headers.get('X-Total-Count') // total number of products
          if(count)
            this.#productsTotalNumber.set(Number(count))
        }),
        shareReplay()
      )
      .subscribe((response: HttpResponse<Product[]>) => {
        let newProducts = response.body;

        let currentProducts = this.#products();
        let mergedProducts = currentProducts.concat(newProducts);
        this.#products.set(mergedProducts);
      });
  }

  clearList() {
    this.#products.set([]);
    this.loadProducts();
  }
}
