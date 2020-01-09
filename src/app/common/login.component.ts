import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Component, ViewChild, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { fadeInAnimation } from '../animations';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class LoginComponent implements AfterViewInit, OnInit {
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private titleService: Title,
        private metaTagService: Meta
    ) { }

    loginUser(form: NgForm) {
        if (form.valid) {
            this.authService
                .login(form.value.username, form.value.password)
                .subscribe(
                    result => {
                        if (result) {
                            this.router.navigateByUrl('/admin');
                        } else {
                            this.error = 'Invalid username or password!';
                        }
                    }
                );
        }
    }

    ngAfterViewInit(): void {
        this.setFocus();
    }

    @ViewChild('username', { static: false }) myInput: ElementRef;

    setFocus() {
        this.myInput.nativeElement.focus();
    }

    ngOnInit(): void {
        this.setSEO();
    }

    private setSEO() {
        this.titleService.setTitle('Login');
        this.metaTagService.updateTag({ name: 'description', content: 'This is the Angular Store Login Page.' });
    }
}