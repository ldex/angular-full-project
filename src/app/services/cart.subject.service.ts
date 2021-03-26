import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { Product } from '../products/product.interface';

@Injectable()
export class CartSubjectService {

    private productsSubject = new BehaviorSubject<Product[]>([]);
    products$: Observable<Product[]> = this
                                        .productsSubject
                                        .asObservable()
                                        .pipe(
                                            filter(products => products.length > 0)
                                        );
    productsNb$: Observable<number> = this
                                        .products$
                                        .pipe(
                                            map(products => products.length),
                                            startWith(0),
                                            tap(() => console.warn("*** productsNb$")),
                                        );

    constructor() {
    }

    addToCart(product:Product) {
        let list = [...this.productsSubject.value];
        list.push(product);
        this.productsSubject.next(list);
    }
}