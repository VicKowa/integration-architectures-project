import { Component } from '@angular/core';
import { NgForm} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs/operators";
import UserDTO from "@app/dtos/UserDTO";



@Component({
    selector: 'app-registration-view',
    templateUrl: './salesman-register-page.component.html',
    styleUrls: ['./salesman-register-page.component.css']
})
export class SalesmanRegisterComponent {
    loading = false;
    submitted = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    onSubmit(form: NgForm) {
        this.submitted = true;

        // stop here if form is invalid
        if (form.invalid) {
            return;
        }

        this.loading = true;

        this.authService.register(form.value as UserDTO)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../login'], {relativeTo: this.route});
                },
                error: error => {
                    console.error('Registration failed', error);
                    this.loading = false;
                }
            });
    }

}
