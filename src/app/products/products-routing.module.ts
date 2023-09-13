import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductInsertReactiveComponent } from './product-insert-reactive/product-insert.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { ProductDetailResolveService } from '../services/product-details-resolve.service';
import { ProductListSignalsComponent } from './product-list-signals/product-list-signals.component';
import { ProductInsertTemplateComponent } from './product-insert-template/product-insert.component';

const routes: Routes = [
  { path: '',       component: ProductListComponent, title: 'Products List' },
  { path: 'signals',       component: ProductListSignalsComponent, title: 'Products List' },
  { path: 'insert/reactive', component: ProductInsertReactiveComponent, canDeactivate: [CanDeactivateGuardService], title: 'Creating a new Product' },
  { path: 'insert/template', component: ProductInsertTemplateComponent, canDeactivate: [CanDeactivateGuardService], title: 'Creating a new Product' },
  { path: 'update/:id', component: ProductUpdateComponent, canDeactivate: [CanDeactivateGuardService], resolve: { product: ProductDetailResolveService } },
  { path: 'cart',   component: ProductCartComponent, title: 'Shopping Cart' },
  { path: ':id',    component: ProductDetailComponent, title: 'Product Details' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }