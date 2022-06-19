import { Component, OnInit } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { Product } from '../product.interface';
import { CartSubjectService, SeoService } from './../../services';

@Component({
    selector: 'cart-content',
    templateUrl: './product-cart.component.html',
    styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {

    products$: Observable<Product[]>;
    productsTotal$: Observable<number>;

    constructor(
        private cartService: CartSubjectService,
        private seoService: SeoService
    ) { }

    ngOnInit() {
        this.seoService.setTitle('Shopping Cart');
        this.products$ = this.cartService.products$;
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