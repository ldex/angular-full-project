import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services';

@Component({
    templateUrl: './contact.component.html',
    standalone: true
})
export class ContactComponent implements OnInit {
    private seoService = inject(SeoService);


    ngOnInit(): void {
        this.seoService.setTitleAndDescription('Contact Us');
    }

}