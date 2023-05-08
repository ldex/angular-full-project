import { Injectable }             from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs';
import { ProductService } from './product.service';
import { Product } from '../products/product.interface';

@Injectable()
export class ProductDetailResolveService  {

  constructor(
    private ps: ProductService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | any {
    let id = +route.params['id'];
    return this.ps.getProduct(id)
  }

}