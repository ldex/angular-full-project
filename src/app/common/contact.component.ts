import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';

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