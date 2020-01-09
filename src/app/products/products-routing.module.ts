import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductInsertComponent } from './product-insert/product-insert.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service';
import { ProductDetailResolveService } from '../services/product-details-resolve.service';

const routes: Routes = [
  { path: '',       component: ProductListComponent },
  { path: 'insert', component: ProductInsertComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'update/:id', component: ProductUpdateComponent, canDeactivate: [CanDeactivateGuard], resolve: { product: ProductDetailResolveService } },
  { path: 'cart',   component: ProductCartComponent },
  { path: ':id',    component: ProductDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }