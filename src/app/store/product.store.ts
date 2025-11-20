import { inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withState,
  patchState,
  withMethods,
  withHooks,
  withProps
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, pipe, switchMap } from 'rxjs';
import { Product } from '../products/product.interface';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NotificationService } from '../services';
import { tapResponse } from '@ngrx/operators';
import { ProductStoreService } from './product.service';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({
    _pageToLoad: 1,
    _productsToLoad: 10,
    products: [] as Product[]
  }),
  withProps(() => ({
    _productService: inject(ProductStoreService),
    _notificationService: inject(NotificationService),
    _router: inject(Router)
  })),
  withComputed((store) => {
    const products$: Observable<Product[]> = toObservable<Product[]>(store.products);
    return {
        mostExpensiveProduct: toSignal(store._productService.getMostExpensiveProduct(products$)),
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
    (store) => ({

    loadProducts() {
      store
        ._productService
        .getProducts(store._pageToLoad(), store._productsToLoad())
        .subscribe((products) => {
          let newProducts = products;
          let currentProducts = store.products();
          let mergedProducts = currentProducts.concat(newProducts);
          patchState(store, { products: mergedProducts });
      });
      patchState(store, { _pageToLoad: store._pageToLoad()+1 });
    },

    deleteProduct: rxMethod<number>(
      pipe(
        switchMap((id) =>
          store._productService.deleteProduct(id).pipe(
            tapResponse({
              next: () => {
                store.clearList();
                store._notificationService.notifyMessage('Product deleted');
                store._router.navigateByUrl("/products?refresh")
              },
              error: ({ error }) => store._notificationService.notifyError('Could not delete product. ' + error),
            }),
          ),
        ),
      ),
    ),

    insertProduct(newProduct: Product): Observable<Product> {
        return store._productService.insertProduct(newProduct);
    },

    updateProduct(id: number, updatedProduct: Product): Observable<Product> {
      return store._productService.updateProduct(id, updatedProduct);
    },

    getProduct(id: number | string): Observable<Product> {
      return store._productService.getProduct(id);
    },
  })),
  withHooks({
    onInit: ({ loadProducts }) => {
      loadProducts();
    },
  })
);
