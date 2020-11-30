import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services';

@Component({
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

    constructor(
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.seoService.setTitleAndDescription('Contact Us');
    }

}