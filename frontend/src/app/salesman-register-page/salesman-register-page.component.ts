import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
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
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required, this.validateUsername()],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: this.mustMatch('password', 'confirmPassword')
        });

        // Check username availability on each input change
        const usernameControl = this.registerForm.get('username');
        if (usernameControl) {
            usernameControl.valueChanges.subscribe(() => {
                this.checkUsername();
            });
        }
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

    private validateUsername(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (!control.value) {
                return null;
            }

            this.authService.isValidUsername(control.value)
                .subscribe(
                    (response) => {
                        if (!response.body.valid) {
                            control.setErrors({"usernameTaken": true});
                        } else {
                            control.setErrors(null);
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            return null;
        }

    }

    private checkUsername(): void {
        const control = this.registerForm.get('username');
        if (control) {
            this.validateUsername()(control);
        }
    }
}
