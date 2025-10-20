import { Component, HostBinding, OnInit, inject } from '@angular/core';
import { AdminService, SeoService } from '../../services';
import { fadeInAnimation } from '../../animations';

@Component({
    templateUrl: './admin.component.html',
    animations: [fadeInAnimation],
    standalone: true
})
export class AdminComponent implements OnInit {
    private adminService = inject(AdminService);
    private seoService = inject(SeoService);


    @HostBinding('@fadeInAnimation') animation = true;


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