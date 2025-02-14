import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import UserDTO from '@app/dtos/UserDTO';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-registration-view',
    templateUrl: './salesman-register-page.component.html',
    styleUrls: ['./salesman-register-page.component.css'],
    standalone: false
})
export class SalesmanRegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    salesmanData: {
        valid: boolean;
        ohrm: boolean;
    } = {
            valid: false,
            ohrm: false
        };

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
                validators: (control: AbstractControl<any, any>): ValidationErrors => Validators.required(control),
                asyncValidators: [(control: AbstractControl<any, any>): ValidationErrors => this.validateUsername()(control)],
                updateOn: 'blur'
            }],
            firstname: ['', (control: AbstractControl<any, any>): ValidationErrors => Validators.required(control)],
            lastname: ['', (control: AbstractControl<any, any>): ValidationErrors => Validators.required(control)],
            email: ['', [
                (control: AbstractControl<any, any>): ValidationErrors => Validators.required(control),
                (control: AbstractControl<any, any>): ValidationErrors => Validators.email(control)
            ]],
            password: ['', [(control: AbstractControl<any, any>): ValidationErrors => Validators.required(control)]],
            confirmPassword: ['', (control: AbstractControl<any, any>): ValidationErrors => Validators.required(control)]
        }, {
            validators: (formGroup: AbstractControl<any, any>): ValidationErrors =>
                this.mustMatch('password', 'confirmPassword')(formGroup)
        });

        // Check username availability on each input change
        const usernameControl: AbstractControl<any, any> = this.registerForm.get('username');
        if (usernameControl) {
            usernameControl.valueChanges.subscribe((): void => {
                this.checkUsername();
            });
        }
    }

    // Convenience getter for easy access to form fields
    get f(): {
        [key: string]: AbstractControl<any, any>;
        } { return this.registerForm.controls; }

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
        const user: UserDTO = this.registerForm.value as UserDTO;
        user.role = this.salesmanData.ohrm ? 'salesman' : 'salesman_valucon';

        this.authService.register(user)
            .pipe(first())
            // Handle response from Server
            .subscribe({
                // If registration is successful, redirect to login page
                next: (): void => {
                    void this.router.navigate(['../login'], { relativeTo: this.route });
                },
                // If registration fails, log error
                error: (error: Error): void => {
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
    mustMatch(controlName: string, matchingControlName: string): (formGroup: AbstractControl) => ValidationErrors | null {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            // Get the controls
            const control: AbstractControl = formGroup.get(controlName);
            const matchingControl: AbstractControl = formGroup.get(matchingControlName);

            // If either control is not found, return null
            if (matchingControl?.errors && !matchingControl.errors.mustMatch) {
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
        return (control: AbstractControl): Promise<ValidationErrors | null> =>
            // Return a Promise that resolves with a ValidationErrors object
            new Promise((resolve: (value: (ValidationErrors | PromiseLike<ValidationErrors>)) => void): void => {
                // If the control is empty, return null
                if (!control.value) {
                    resolve(null);
                    return;
                }

                // Check if the username is already taken
                const username: string = typeof control.value === 'string' ? control.value : '';
                this.authService.isValidUsername(username)
                    .subscribe({
                        // If the username is not taken, resolve with null
                        next: (response: HttpResponse<{
                            valid: boolean;
                            ohrm: boolean;
                        }>): void => {
                            // save the response
                            this.salesmanData = response.body;

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
                        error: (error: unknown): void => {
                            if (error instanceof Error) {
                                console.error('Error checking username: ', error.message);
                            } else {
                                console.error('Error checking username: ', error);
                            }

                            resolve({ usernameTaken: true });
                        }
                    });
            });
    }

    /**
     * Check if the username is already taken
     * */
    private checkUsername(): void {
        // Get the username control and validate it
        const control: AbstractControl<any, any> = this.registerForm.get('username');
        if (control) {
            this.validateUsername()(control);
        }
    }

    /**
     * Redirect to login page
     * */
    login(): void {
        void this.router.navigate(['../login'], { relativeTo: this.route });
    }
}
