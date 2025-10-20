import { Component, HostBinding, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { SeoService } from '../../services';
import { fadeInAnimation } from '../../animations';

@Component({
    templateUrl: './error.component.html',
    animations: [fadeInAnimation],
    imports: [RouterLink]
})
export class ErrorComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private seoService = inject(SeoService);

    @HostBinding('@fadeInAnimation') animation = true;

    routeParams;


    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(res => this.routeParams = res);
        this.seoService.setTitle('Error!');
    }
}