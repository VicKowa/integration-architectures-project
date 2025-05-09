import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Credentials } from '@app/models/Credentials';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {

    // object for input-binding
    credentials: Credentials;

    loginError: string;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.resetCredentials();
    }

    /**
     * handles login operation, by calling the authService
     */
    performLogin(): void{
        this.authService.login(this.credentials).subscribe((response): void => {
            if (response.status === 200){ // if response status is 200, assume login was successful
                this.resetCredentials();
                this.enterApplication();
            }else{
                this.loginError = response.body as string;
            }
        },
        (error: HttpErrorResponse): void => {
            this.loginError = error.error as string;
        }
        );
    }

    /**
     * resets login form
     */
    resetCredentials(): void{
        this.credentials = new Credentials('', '');
    }

    /**
     * redirects to the landing page
     */
    enterApplication(): void{
        void this.router.navigate(['']);
    }

    /**
     * redirects to the registration page
     */
    register(): void {
        void this.router.navigate(['register']);
    }
}
