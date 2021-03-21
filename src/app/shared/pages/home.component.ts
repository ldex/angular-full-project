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
    ) {
        //this.blockingScript(2000);
        this.runInWorker();
    }

    private blockingScript(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    private runInWorker() {
        if (typeof Worker !== 'undefined') {
            console.time('web worker duration');
            const worker = new Worker('./home.worker', { type: 'module' });
            worker.onmessage = ({ data }) => {
                console.log(data);
                console.timeEnd('web worker duration');
            };
            worker.postMessage(2000);
          } else {
            // Web Workers are not supported in this environment (IE 6-9 ?).
            // Check support: https://caniuse.com/?search=web%20worker
            // You should add a fallback so that your program still executes correctly.
          }
    }

    code_error(): void {
        throw new Error("App Component has thrown an error!");
    }

    nav_error(): void {
        this.router.navigateByUrl('/this_page_does_not_exist');
    }

    http_error(): void {
        this.http.get("https://httpstat.us/408?sleep=1000").toPromise();
    }

    http_ok(): void {
        this.http.get("https://httpstat.us/200?sleep=2000").toPromise();
    }
}