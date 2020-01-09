import { ProductsRoutingModule } from './products-routing.module';
import { ProductService } from './../services/product.service';
import { ProductListComponent } from './product-list/product-list.component'
import { ProductDetailComponent } from './product-detail/product-detail.component'
import { OrderBy } from './orderBy.pipe'
import { NgModule } from '@angular/core'
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ProductInsertComponent } from './product-insert/product-insert.component';
import { ConfirmDirective } from './confirm.directive'
import { GroupByPipe } from './groupBy.pipe'
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductDetailResolveService } from '../services/product-details-resolve.service';
import { ProductUpdateComponent } from './product-update/product-update.component';

const moduleComponents = [
    ProductDetailComponent,
    ProductListComponent,
    ProductInsertComponent,
    ProductUpdateComponent,
    ProductCartComponent
]

const moduleDirectives = [
    ConfirmDirective
]

const modulePipes = [
    OrderBy,
    GroupByPipe
]

const moduleImports = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule
]

const moduleExports = [
    ProductListComponent
]

const moduleServices = [
    ProductService,
    ProductDetailResolveService
]

@NgModule({
    declarations: [
        ...moduleComponents,
        ...moduleDirectives,
        ...modulePipes
    ],
    imports: [
        ...moduleImports
    ],
    exports: [
        ...moduleExports
    ],
    providers: [
        ...moduleServices
    ],
})
export class ProductsModule { }
