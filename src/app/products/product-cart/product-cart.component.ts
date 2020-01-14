import { Component, OnInit } from '@angular/core';
import { Product } from '../product.interface';
import { CartService, SeoService } from './../../services';

@Component({
    selector: 'cart-content',
    templateUrl: './product-cart.component.html',
    styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {

    products: Product[];

    constructor(
        private cartService: CartService,
        private seoService: SeoService
    ) { }

    ngOnInit() {
        this.products = this.cartService.getProducts();
        this.seoService.setTitle('Shopping Cart');
    }

    get total(): number {
        let sum: number = 0;
        this.products.forEach(p => sum += p.price);
        return sum;
    }

    buy() {
        alert('Todo ;-)');
    }

}