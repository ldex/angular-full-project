import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NotificationService, DialogService } from '../../services';
import { Observable, from } from 'rxjs';
import { CustomValidators } from '../../customValidators';
import { Product } from '../product.interface';

interface ProductForm {
  name: FormControl<string>;
  price: FormControl<number>;
  description: FormControl<string>;
  imageUrl: FormControl<string>;
  discontinued: FormControl<boolean>;
  fixedPrice: FormControl<boolean>;
  modifiedDate: FormControl<Date>;
}

@Component({
  selector: 'app-product-insert-reactive',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.css']
})
export class ProductInsertReactiveComponent  implements OnInit {

  insertForm: FormGroup<ProductForm>;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogService: DialogService) { }

  onSubmit() {
    let newProduct: Product = this.insertForm.getRawValue();

    this.submitted = true;
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

  ngOnInit() {
    const validImgUrlRegex: RegExp = new RegExp('^(https?://[a-zA-Z0-9-.]+.[a-zA-Z]{2,5}(?:/S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+.(?:jpg|jpeg|gif|png))(\\?(?:&?[^=&]*=[^=&]*)*)?$')

    this.insertForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), CustomValidators.productNameValidator]],
        price: [null as number, [Validators.required, Validators.min(0), Validators.max(100000)]],
        description: ['', [Validators.minLength(5), Validators.maxLength(500)]],
        imageUrl: ['', [Validators.pattern(validImgUrlRegex)]],
        discontinued: [false],
        fixedPrice: [false],
        modifiedDate: [null]
      }, { validators: CustomValidators.priceWithDescription }
    );
  }

  get name() { return this.insertForm.get('name'); }
  get price() { return this.insertForm.get('price'); }
  get description() { return this.insertForm.get('description'); }
  get imageUrl() { return this.insertForm.get('imageUrl'); }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if product is unchanged or submitted.
    if (!this.insertForm.dirty || this.submitted) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    let p = this.dialogService.confirm('Discard changes?');
    let o = from(p);
    return o;
  }

}
