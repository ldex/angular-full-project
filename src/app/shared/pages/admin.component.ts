import { Component, HostBinding, OnInit, inject } from '@angular/core';
import { AdminService, SeoService } from '../../services';

@Component({
    templateUrl: './admin.component.html',
    standalone: true
})
export class AdminComponent implements OnInit {
    private adminService = inject(AdminService);
    private seoService = inject(SeoService);

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