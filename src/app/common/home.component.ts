import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { fadeInAnimation } from '../animations';

@Component({
    templateUrl: './home.component.html',
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent {
    constructor(private router: Router) { }

    code_error(): void {
        throw new Error("testing code error");
    }

    nav_error(): void {
        this.router.navigateByUrl('/this_page_does_not_exist');
    }
}