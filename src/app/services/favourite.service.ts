import { Product } from './../products/product.interface';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class FavouriteService {

    constructor(
        private notificationService: NotificationService
    ) { }

    private _favourites: Set<Product> = new Set();
    get favourites(): Set<Product> {
        return this._favourites;
    }

    addToFavourites(product: Product): void {
        this._favourites.add(product);
        this.notificationService.notifyMessage(`Product ${product.name} added to your favourites.`);
    }

    removeFromFavourites(product:Product): void {
        this._favourites.delete(product);
        this.notificationService.notifyMessage(`Product ${product.name} removed from your favourites.`);
    }  

    getFavouritesNb() : number {
        return this._favourites.size;
    }
    
    IsInFavourites(product:Product) : boolean {
        let productInFavourites = Array.from(this.favourites).find(p => p.id == product.id);
        if(productInFavourites) {
            return true;
        }
        return false;
    }
}