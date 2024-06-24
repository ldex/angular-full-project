import { Routes } from "@angular/router";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { CanDeactivateGuardService } from "../services";
import { ProductCartComponent } from "./product-cart/product-cart.component";
import { ProductInsertReactiveComponent } from "./product-insert-reactive/product-insert.component";
import { ProductInsertTemplateComponent } from "./product-insert-template/product-insert.component";
import { ProductListSignalsComponent } from "./product-list-signals/product-list-signals.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductUpdateComponent } from "./product-update/product-update.component";
import { productResolver } from "./product.resolver";

export const productsRoutes: Routes = [
  { path: '',       component: ProductListComponent, title: 'Products List' },
  { path: 'signals',       component: ProductListSignalsComponent, title: 'Products List' },
  { path: 'insert/reactive', component: ProductInsertReactiveComponent, canDeactivate: [CanDeactivateGuardService], title: 'Creating a new Product' },
  { path: 'insert/template', component: ProductInsertTemplateComponent, canDeactivate: [CanDeactivateGuardService], title: 'Creating a new Product' },
  { path: 'update/:id', component: ProductUpdateComponent, canDeactivate: [CanDeactivateGuardService], resolve: { product: productResolver } },
  { path: 'cart',   component: ProductCartComponent, title: 'Shopping Cart' },
  { path: ':id',    component: ProductDetailComponent, title: 'Product Details' }
  ];