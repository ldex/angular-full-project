import { Router, CanDeactivate } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { NotificationService, DialogService } from '../../services';
import { Observable, from } from 'rxjs';
import { CustomValidators } from '../../customValidators';

@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.css']
})
export class ProductInsertComponent implements CanDeactivate<any>, OnInit {

  insertForm: FormGroup;
  name: FormControl;
  price: FormControl;
  description: FormControl;
  imageUrl: FormControl;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogService: DialogService) { }

  onSubmit() {
    let newProduct = this.insertForm.value;
    this.submitted = true;
    this.productService
      .insertProduct(newProduct)
      .subscribe(
        product => {
          this.productService.clearCache();
          this.notificationService.notifyMessage('New Product Saved.');
          this.router.navigateByUrl("/products");
        },
        error => this.notificationService.notifyError('Could not save product. ' + error)
      );
  }

  ngOnInit() {
    let validImgUrlRegex: string = '^(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,5}(?:\/\S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+\.(?:jpg|jpeg|gif|png))$';

    this.name = new FormControl('', [Validators.required, Validators.maxLength(50), CustomValidators.productNameValidator]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000000)]);
    this.description = new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]);
    this.imageUrl = new FormControl('', [Validators.pattern(validImgUrlRegex)]);

    this.insertForm = this.fb.group(
      {
        'name': this.name,
        'price': this.price,
        'description': this.description,
        'discontinued': false,
        'fixedPrice': false,
        'imageUrl': this.imageUrl
      }, { validator: CustomValidators.priceWithDescription }
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
