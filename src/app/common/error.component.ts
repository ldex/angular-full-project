import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

    routeParams;
    data;

    constructor(private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.routeParams = this.activatedRoute.snapshot.queryParams;
        this.data = this.activatedRoute.snapshot.data;
    }
}