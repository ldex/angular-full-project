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
import { Router } from '@angular/router';
import { NotificationService } from '../services';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withDevtools('products'),
  withState({
    _baseUrl: `${config.apiUrl}/products`,
    _pageToLoad: 1,
    _productsToLoad: 10,
    products: [] as Product[]
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
  withMethods(
    (store) => ({
      clearList() {
        patchState(store, { products: [] });
        patchState(store, { _pageToLoad: 1 });
        this.loadProducts();
      }
    })
  ),
  withMethods(
    (
      store,
      http = inject(HttpClient),
      router = inject(Router),
      notificationService = inject(NotificationService)
    ) => ({

    loadProducts() {
        const params = {
          page: store._pageToLoad(),
          limit: store._productsToLoad(),
          sortBy: 'modifiedDate',
          order: 'desc'
        }

        patchState(store, { _pageToLoad: store._pageToLoad()+1 });

        const options = {
          params: params
        };

        http
          .get<Product[]>(store._baseUrl(), options)
          .pipe(
            delay(200),
            shareReplay()
          )
          .subscribe(response => {
            let newProducts = response;

            let currentProducts = store.products();
            let mergedProducts = currentProducts.concat(newProducts);
            patchState(store, { products: mergedProducts });
          });

    },

    deleteProduct: rxMethod<Number>(
      pipe(
        switchMap((id) =>
          http.delete(store._baseUrl() + '/' + id).pipe(
            tapResponse({
              next: () => {
                store.clearList();
                notificationService.notifyMessage('Product deleted');
                router.navigateByUrl("/products?refresh")
              },
              error: ({ error }) => notificationService.notifyError('Could not delete product. ' + error),
            }),
          ),
        ),
      ),
    ),

    _deleteProduct(id: number): Observable<any> {
        return http.delete(store._baseUrl() + '/' + id);
    },

    insertProduct(newProduct: Product): Observable<Product> {
        newProduct.modifiedDate = new Date();
        return http.post<Product>(store._baseUrl(), newProduct);
    },

    updateProduct(id: number, updatedProduct: Product): Observable<Product> {
        updatedProduct.id = id;
        updatedProduct.modifiedDate = new Date();
        return http.put<Product>(store._baseUrl() + '/' + id, updatedProduct);
    },

    getProduct(id: number | string): Observable<Product> {
        let url: string = store._baseUrl() + '/' + id;
        return http.get<Product>(url);
    },
  })),
  withHooks({
    onInit: ({ loadProducts }) => {
      loadProducts();
    },
  })
);
