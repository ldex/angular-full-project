import { Component, OnInit, inject } from '@angular/core';
import { Observable, filter, map, of } from 'rxjs';
import { Product } from '../product.interface';
import { CartService, CartSubjectService, SeoService } from './../../services';
import { GroupByPipe } from '../groupBy.pipe';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { config } from 'src/environments/environment';

@Component({
    selector: 'cart-content',
    templateUrl: './product-cart.component.html',
    styleUrls: ['./product-cart.component.css'],
    imports: [AsyncPipe, CurrencyPipe, GroupByPipe]
})
export class ProductCartComponent implements OnInit {
    private cartService = inject(CartService);
    private cartServiceSubject = inject(CartSubjectService);
    private seoService = inject(SeoService);


    products$: Observable<Product[]>;
    productsTotal$: Observable<number>;
    useCartSubject = config.useCartSubject;

    ngOnInit() {
        this.seoService.setTitle('Shopping Cart');

        if(this.useCartSubject)
            this.products$ = this.cartServiceSubject.products$;
        else
            this.products$ = of(this.cartService.getProducts())

        this.productsTotal$ = this
                                .products$
                                .pipe(
                                    map(list => list.reduce((total, product) => total + Number(product.price), 0))
                                )
    }

    buy() {
        alert('Todo ;-)');
    }

}