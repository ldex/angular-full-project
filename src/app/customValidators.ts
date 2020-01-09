import { NgControl } from '@angular/forms';

export interface ValidationResult {
 [key:string]:boolean;
}

export class CustomValidators {

static priceWithDescription(group) {
  
  let price = group.controls.price;
  let description = group.controls.description;
  
  // Mark group as touched so we can add invalid class easily
  group.markAsTouched();

  if (price.value > 100 && description.value == "") {
    return { "descriptionRequiredFromPrice": true }
  }

  return null;
}

 static startsWithNumber(control: NgControl): ValidationResult {  
   if ( control.value !="" && !isNaN(control.value.charAt(0)) ){
     return { "startsWithNumber": true };
   } 
   return null;
 }

  static productNameValidator(control): ValidationResult {
    // Alphabets, numbers and space(' ') no special characters min 3 and max 50 characters. 
    if (control.value == "") {
      return null;
    }
    if (control.value.match(/^[A-Za-z0-9 ]{3,50}$/)) {
      return null;
    } else {
      return { 'invalidProductName': true };
    }
  }

   static creditCardValidator(control): ValidationResult {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }
     
  static emailValidator(control): ValidationResult {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
        return { 'invalidEmailAddress': true };
      }
    }
     
   static passwordValidator(control): ValidationResult {
     // {6,100}           - Assert password is between 6 and 100 characters
     // (?=.*[0-9])       - Assert a string has at least one number
     if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
       return null;
     } else {
       return { 'invalidPassword': true };
     }
  }

  static zipValidator(control) {
    var valid = /^\d{5}$/.test(control.value);
    if(valid){
        return null;
    }
    return { "invalidZip":true };
}
 
}