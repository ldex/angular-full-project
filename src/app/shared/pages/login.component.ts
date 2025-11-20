import { Router } from '@angular/router';
import { AuthService, SeoService } from '../../services';
import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from "@angular/forms";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule]
})
export class LoginComponent implements AfterViewInit, OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private seoService = inject(SeoService);

    error = '';

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