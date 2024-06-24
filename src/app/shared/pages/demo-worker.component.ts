import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations';

@Component({
    templateUrl: './demo-worker.component.html',
    animations: [fadeInAnimation],
    standalone: true
})
export class DemoWorkerComponent {

    @HostBinding('@fadeInAnimation') animation = true;

    useWorker: boolean = true;

    constructor() {
        this.useWorker ? this.runInWorker() : this.blockingScript(2000);
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
            const worker = new Worker(new URL('./compute.worker', import.meta.url), { type: 'module' });
            worker.onmessage = ({ data }) => {
                console.log(data);
                console.timeEnd('web worker duration');
            };
            worker.postMessage(2000); // trigger the work inside the worker
          } else {
            // Web Workers are not supported in this environment (IE 6-9 ?).
            // Check support: https://caniuse.com/?search=web%20worker
            // You should add a fallback so that your program still executes correctly.
          }
    }
}