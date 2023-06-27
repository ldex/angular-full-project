import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductInsertComponent } from './product-insert/product-insert.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { ProductDetailResolveService } from '../services/product-details-resolve.service';
import { ProductListSignalsComponent } from './product-list-signals/product-list-signals.component';

const routes: Routes = [
  { path: '',       component: ProductListComponent, title: 'Products List' },
  { path: 'signals',       component: ProductListSignalsComponent, title: 'Products List' },
  { path: 'insert', component: ProductInsertComponent, canDeactivate: [CanDeactivateGuardService], title: 'Creating a new Product' },
  { path: 'update/:id', component: ProductUpdateComponent, canDeactivate: [CanDeactivateGuardService], resolve: { product: ProductDetailResolveService } },
  { path: 'cart',   component: ProductCartComponent },
  { path: ':id',    component: ProductDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }