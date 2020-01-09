import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    templateUrl: './home.component.html'
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