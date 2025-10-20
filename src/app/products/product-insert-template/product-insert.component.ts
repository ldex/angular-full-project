import { Component, inject } from '@angular/core';
import { Product } from '../product.interface';
import { Router } from '@angular/router';
import { ProductService, NotificationService } from 'src/app/services';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-insert-template',
    templateUrl: './product-insert.component.html',
    styleUrls: ['./product-insert.component.css'],
    imports: [FormsModule]
})
export class ProductInsertTemplateComponent {
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);


  onSubmit(newProduct: Product) {
    this.productService
      .insertProduct(newProduct)
      .subscribe({
        next: (product) => {
          this.productService.clearList();
          this.notificationService.notifyMessage('New product saved on server with id: ' + product.id);
          this.router.navigateByUrl("/products");
        },
        error: (error) => this.notificationService.notifyError('Could not save product. ' + error)
      });
  }

}
