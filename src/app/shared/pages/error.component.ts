import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { SeoService } from '../../services';
import { fadeInAnimation } from '../../animations';

@Component({
    templateUrl: './error.component.html',
    animations: [fadeInAnimation]
})
export class ErrorComponent implements OnInit {
    @HostBinding('@fadeInAnimation') animation = true;

    routeParams;

    constructor(
        private activatedRoute: ActivatedRoute,
        private seoService: SeoService) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(res => this.routeParams = res);
        this.seoService.setTitle('Error!');
    }
}