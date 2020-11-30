import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SeoService } from '../../services';
import { fadeInAnimation } from '../../animations';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class ErrorComponent implements OnInit {

    state$: Observable<any>;
    routeData;

    constructor(
        private activatedRoute: ActivatedRoute,
        private seoService: SeoService) {
    }

    ngOnInit() {
        this.routeData = this.activatedRoute.snapshot.data;
        this.seoService.setTitle('Error!');
    }
}