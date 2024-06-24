import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fadeInAnimation } from 'src/app/animations';

@Component({
    templateUrl: './test.component.html',
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' },
    standalone: true
})
export class TestComponent {
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    code_error(): void {
        throw new Error("App Component has thrown an error!");
    }

    nav_error(): void {
        this.router.navigateByUrl('/this_page_does_not_exist');
    }

    http_error(): void {
        this.http.get("https://run.mocky.io/v3/78c4a834-ff6b-4b35-8ad1-78423870ee1b").subscribe();
    }
}