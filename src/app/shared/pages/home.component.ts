import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations';

@Component({
    templateUrl: './home.component.html',
    animations: [fadeInAnimation]
})
export class HomeComponent {
    @HostBinding('@fadeInAnimation') animation = true;
    constructor() {

    }
}