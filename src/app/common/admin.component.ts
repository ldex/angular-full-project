import { AdminService } from './../services/admin.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './admin.component.html'
})
export class AdminComponent {
    constructor(private adminService: AdminService) { }

    profile: string = '';

    getProfile() {
        this.adminService
            .getProfile()
            .subscribe(
                response => this.profile = response
            );
    }
}