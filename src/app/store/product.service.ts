import { Product } from "./../products/product.interface";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
} from "rxjs";
import { config } from "../../environments/environment";

// This is the stateless version of ProductService for usage with the Store
// The original ProductService is still used by the rest of the application
@Injectable({
  providedIn: 'root'
})
export class ProductStoreService {
  private readonly baseUrl: string = `${config.apiUrl}/products`;
  #http = inject(HttpClient);

  getMostExpensiveProduct(products$: Observable<Product[]>) {
    return products$.pipe(
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
    )
  }

  deleteProduct(id: number): Observable<any> {
    return this.#http.delete(this.baseUrl + '/' + id);
  }

  insertProduct(newProduct: Product): Observable<Product> {
    if(!newProduct.name || !newProduct.price) {
      return
    }
    newProduct.modifiedDate = new Date();
    return this.#http.post<Product>(this.baseUrl, newProduct);
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    updatedProduct.id = id;
    updatedProduct.modifiedDate = new Date();
    return this.#http.put<Product>(this.baseUrl + '/' + id, updatedProduct);
  }

  getProduct(id: number | string): Observable<Product> {
    let url: string = this.baseUrl + '/' + id;
    return this.#http.get<Product>(url);
  }

  getProducts(pageToLoad, productsToLoad): Observable<Product[]> {
    const params = {
        page: pageToLoad,
        limit: productsToLoad,
        sortBy: 'modifiedDate',
        order: 'desc'
    }

    const options = {
      params: params
    };

    return this.#http
      .get<Product[]>(this.baseUrl, options)
      .pipe(
        delay(500),
        shareReplay()
      )
  }
}
