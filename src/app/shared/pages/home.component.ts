import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fadeInAnimation } from 'src/app/animations';

@Component({
    templateUrl: './home.component.html',
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent {
    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    code_error(): void {
        throw new Error("App Component has thrown an error!");
    }

    nav_error(): void {
        this.router.navigateByUrl('/this_page_does_not_exist');
    }

    http_error(): void {
        this.http.get("https://httpstat.us/404?sleep=2000").toPromise();
    }

    http_ok(): void {
        this.http.get("https://httpstat.us/200?sleep=2000").toPromise();
    }
}