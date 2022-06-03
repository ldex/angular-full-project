import { Router, CanDeactivate } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  NonNullableFormBuilder
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
}

@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.css']
})
export class ProductInsertComponent implements CanDeactivate<any>, OnInit {

  insertForm: FormGroup<ProductForm>;
  name: FormControl<string>;
  price: FormControl<number>;
  description: FormControl<string>;
  imageUrl: FormControl<string>;

  submitted: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogService: DialogService) { }

  onSubmit() {
    let newProduct: Product = this.insertForm.value as Product;

    this.submitted = true;
    this.productService
      .insertProduct(newProduct)
      .subscribe(
        product => {
          this.productService.clearList();
          this.notificationService.notifyMessage('New Product Saved.');
          this.router.navigateByUrl("/products");
        },
        error => this.notificationService.notifyError('Could not save product. ' + error)
      );
  }

  ngOnInit() {
    let validImgUrlRegex: string = '^(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,5}(?:\/\S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+\.(?:jpg|jpeg|gif|png))$';

    this.name = new FormControl<string>('', [Validators.required, Validators.maxLength(50), CustomValidators.productNameValidator]);
    this.price = new FormControl<number>(null, [Validators.required, Validators.min(0), Validators.max(10000000)]);
    this.description = new FormControl<string>('', [Validators.minLength(3), Validators.maxLength(50)]);
    this.imageUrl = new FormControl<string>('', [Validators.pattern(validImgUrlRegex)]);

    this.insertForm = this.fb.group(
      {
        name: this.name,
        price: this.price,
        description: this.description,
        imageUrl: this.imageUrl,
        discontinued: new FormControl(false),
        fixedPrice: new FormControl(false)
      }, { validators: CustomValidators.priceWithDescription }
    );
  }


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
