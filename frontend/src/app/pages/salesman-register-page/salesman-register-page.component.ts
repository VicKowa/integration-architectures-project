import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
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
    loading: boolean = false;
    submitted: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        // Initialize form with validators
        this.registerForm = this.formBuilder.nonNullable.group({
            username: ['', {
                validators: Validators.required,
                asyncValidators: [this.validateUsername()],
                updateOn: 'blur'
            }],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: this.mustMatch('password', 'confirmPassword')
        });

        // Check username availability on each input change
        const usernameControl = this.registerForm.get('username');
        if (usernameControl) {
            usernameControl.valueChanges.subscribe(() => {
                this.checkUsername();
            });
        }
    }

    // Convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    /**
     * On form submission, check if form is valid and register user
     * If registration is successful, redirect to login page
     * */
    onSubmit(): void {
        this.submitted = true;

        // Stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;

        // Register user
        this.authService.register(this.registerForm.value as UserDTO)
            //
            .pipe(first())
            // Handle response from Server
            .subscribe({
                // If registration is successful, redirect to login page
                next: () => {
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                // If registration fails, log error
                error: error => {
                    console.error('Registration failed', error);
                    this.loading = false;
                }
            });
    }

    /**
     * Custom validator to check if password and confirmPassword fields match
     *
     * @param controlName - name of the password field
     * @param matchingControlName - name of the confirmPassword field
     * */
    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            // Get the controls
            const control: AbstractControl = formGroup.get(controlName);
            const matchingControl: AbstractControl = formGroup.get(matchingControlName);

            // If either control is not found, return null
            if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
                return;
            }

            // If the controls do not match, set an error on the confirmPassword field
            if (control?.value !== matchingControl?.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    /**
     * Custom async validator to check if username is already taken
     * */
    private validateUsername(): ValidatorFn {
        // Return a function that takes a control and returns a Promise
        return (control: AbstractControl): Promise<ValidationErrors | null> => {
            // Return a Promise that resolves with a ValidationErrors object
            return new Promise((resolve) => {
                // If the control is empty, return null
                if (!control.value) {
                    resolve(null);
                    return;
                }

                // Check if the username is already taken
                this.authService.isValidUsername(control.value)
                    .subscribe({
                        // If the username is not taken, resolve with null
                        next: (response) => {
                            // If the response is not valid, resolve with an error object
                            if (!response.body.valid) {
                                resolve({ usernameTaken: false });
                            }
                            // If the response is valid, resolve with null
                            else {
                                resolve(null);
                            }
                        },
                        // If an error occurs, log the error and resolve with an error object
                        error: (error) => {
                            console.error('Error checking username: ', error);
                            resolve({ usernameTaken: true });
                        }
                    });
            });
        }
    }

    /**
     * Check if the username is already taken
     * */
    private checkUsername(): void {
        // Get the username control and validate it
        const control = this.registerForm.get('username');
        if (control) {
            this.validateUsername()(control);
        }
    }
}
