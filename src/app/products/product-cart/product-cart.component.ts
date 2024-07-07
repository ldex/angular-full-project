import { Component, OnInit } from '@angular/core';
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
    standalone: true,
    imports: [AsyncPipe, CurrencyPipe, GroupByPipe]
})
export class ProductCartComponent implements OnInit {

    products$: Observable<Product[]>;
    productsTotal$: Observable<number>;
    useCartSubject = config.useCartSubject;

    constructor(
        private cartService:CartService,
        private cartServiceSubject:CartSubjectService,
        private seoService: SeoService
    ) { }

    ngOnInit() {
        this.seoService.setTitle('Shopping Cart');

        if(this.useCartSubject)
            this.products$ = this.cartServiceSubject.products$;
        else
            this.products$ = of(this.cartService.getProducts())

        this.productsTotal$ = this
                                .products$
                                .pipe(
                                    map(list => list.reduce((total, product) => total + product.price, 0))
                                )
    }

    buy() {
        alert('Todo ;-)');
    }

}