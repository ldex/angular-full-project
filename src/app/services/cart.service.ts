import { Injectable } from '@angular/core';
import { Product } from '../products/product.interface';

/**
 * This service is not reactive!
 * For a better implementation, look at CartSubjectService
 */
@Injectable()
export class CartService {

    private products:Product[] = [];

    constructor() {
    }

    addToCart(product:Product) {
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    get NbProducts() {
        return this.products.length;
    }
}