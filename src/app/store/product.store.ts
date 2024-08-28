import { HttpClient, HttpResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withState,
  patchState,
  withMethods,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { delay, filter, first, map, mergeMap, Observable, of, pipe, shareReplay, switchMap, tap } from 'rxjs';
import { config } from 'src/environments/environment';
import { Product } from '../products/product.interface';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({
    baseUrl: `${config.apiUrl}/products`,
    products: [],
    productsTotalNumber: 0,
    productsToLoad: 10
  }),
  withComputed(({ products }) => {
    const mostExpensiveProduct$: Observable<Product> = toObservable<Product[]>(products).pipe(
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
    return {
        mostExpensiveProduct: toSignal(mostExpensiveProduct$),
    }
  }),
  withMethods((store, http = inject(HttpClient)) => ({

    loadProducts(skip: number = 0, take: number = store.productsToLoad()) {
        if (skip == 0 && store.products().length > 0) return;

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

        http
          .get(store.baseUrl(), options)
          .pipe(
            delay(200),
            tap(response => {
              let count = response.headers.get('X-Total-Count') // total number of products
              if(count)
                patchState(store, { productsTotalNumber: Number(count) });
            }),
            shareReplay()
          )
          .subscribe((response: HttpResponse<Product[]>) => {
            let newProducts = response.body;

            let currentProducts = store.products();
            let mergedProducts = currentProducts.concat(newProducts);
            patchState(store, { products: mergedProducts });
          });

    },

    deleteProduct(id: number): Observable<any> {
        return http.delete(store.baseUrl() + '/' + id);
    },

    insertProduct(newProduct: Product): Observable<Product> {
        newProduct.modifiedDate = new Date();
        return http.post<Product>(store.baseUrl(), newProduct);
    },

    updateProduct(id: number, updatedProduct: Product): Observable<Product> {
        updatedProduct.id = id;
        updatedProduct.modifiedDate = new Date();
        return http.put<Product>(store.baseUrl() + '/' + id, updatedProduct);
    },

    getProduct(id: number | string): Observable<Product> {
        let url: string = store.baseUrl() + '/' + id;
        return http.get<Product>(url);
    },

    clearList() {
        patchState(store, { products: [] });
        this.loadProducts();
    }
  })),
  withHooks({
    onInit: ({ loadProducts }) => {
        loadProducts();
    },
  })
);
