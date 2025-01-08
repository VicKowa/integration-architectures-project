import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import UserDTO from '@app/dtos/UserDTO';

@Component({
    selector: 'app-registration-view',
    templateUrl: './salesman-register-page.component.html',
    styleUrls: ['./salesman-register-page.component.css']
})
export class SalesmanRegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: this.mustMatch('password', 'confirmPassword')
        });

        // Check username availability on each input change
        this.registerForm.get('username').valueChanges.subscribe(() => {
            this.checkUsername();
        });
    }

    get f() { return this.registerForm.controls; }

    onSubmit(): void {
        this.submitted = true;

        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;

        this.authService.register(this.registerForm.value as UserDTO)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Registration failed', error);
                    this.loading = false;
                }
            });
    }

    // Custom validator to check that two fields match
    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                return;
            }

            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    checkUsername(): void {
        const username = this.registerForm.get('username').value;

        if (username) {
            this.authService.isValidUsername(username).subscribe(
                (isValid) => {
                    if (!isValid) {
                        this.registerForm.get('username').setErrors({ usernameTaken: true });
                    } else {
                        this.registerForm.get('username').setErrors(null);
                    }
                },
                (error) => {
                    console.error('Error checking username:', error);
                    this.registerForm.get('username').setErrors({ usernameTaken: true });
                }
            );
        }
    }
}
