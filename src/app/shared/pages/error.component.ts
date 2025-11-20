import { Component, HostBinding, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { SeoService } from '../../services';

@Component({
    templateUrl: './error.component.html',
    imports: [RouterLink]
})
export class ErrorComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private seoService = inject(SeoService);

    routeParams;


    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(res => this.routeParams = res);
        this.seoService.setTitle('Error!');
    }
}