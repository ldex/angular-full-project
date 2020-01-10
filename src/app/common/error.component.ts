import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { fadeInAnimation } from '../animations';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class ErrorComponent implements OnInit {

    routeParams;
    data;

    constructor(
        private activatedRoute: ActivatedRoute,
        private seoService: SeoService) {
    }

    ngOnInit() {
        this.routeParams = this.activatedRoute.snapshot.queryParams;
        this.data = this.activatedRoute.snapshot.data;
        
        this.seoService.setTitle('Error!');
    }
}