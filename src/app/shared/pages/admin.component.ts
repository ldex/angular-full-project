import { Component, OnInit } from '@angular/core';
import { AdminService, SeoService } from '../../services';
import { fadeInAnimation } from '../../animations';

@Component({
    templateUrl: './admin.component.html',
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class AdminComponent implements OnInit {
    constructor(
        private adminService: AdminService,
        private seoService: SeoService
    ) { }

    profile: string = '';

    getProfile() {
        this.adminService
            .getProfile()
            .subscribe(
                response => this.profile = response
            );
    }

    ngOnInit(): void {
        this.seoService.setTitleAndDescription('Administration');
    }
}