import { Component, OnInit } from '@angular/core';
import { Product } from '../product.interface';
import { CartService } from './../../services/cart.service';

@Component({
    selector: 'cart-content',
    templateUrl: './product-cart.component.html',
    styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {
    
    products:Product[];
    
    constructor(private cartService:CartService) { }

    ngOnInit() {
        this.products = this.cartService.getProducts();
     }

     get total() : number {
         let sum:number = 0;
         this.products.forEach(p => sum += p.price);
         return sum;
     }

}