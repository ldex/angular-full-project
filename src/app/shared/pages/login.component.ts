import { Router } from '@angular/router';
import { AuthService, SeoService } from '../../services';
import { Component, ViewChild, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { NgForm, FormsModule } from "@angular/forms";
import { fadeInAnimation } from '../../animations';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' },
    standalone: true,
    imports: [FormsModule]
})
export class LoginComponent implements AfterViewInit, OnInit {
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private seoService: SeoService
    ) { }

    loginUser(form: NgForm) {
        if (form.valid) {
            this.authService
                .login(form.value.username, form.value.password) // ngModel automatically map model from html input's names (use [(ngModel)] for a custom ts model)
                .subscribe(
                    loginSuccess => {
                        if (loginSuccess) {
                            this.router.navigateByUrl('/admin');
                        } else {
                            this.error = 'Invalid username or password!';
                        }
                    }
                );
        }
    }

    // #region Auto focus
    @ViewChild('username') private usernameInput: ElementRef;

    setFocus() {
        this.usernameInput.nativeElement.focus();
    }

    ngAfterViewInit(): void {
        this.setFocus();
    }
    // #endregion

    ngOnInit(): void {
        this.seoService.setTitleAndDescription('Login');
    }


}