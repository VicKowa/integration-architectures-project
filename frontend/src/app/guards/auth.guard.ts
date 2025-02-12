import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn$.pipe(
        // Wait until the auth state is known (assuming you initialize it to null)
        filter((loggedIn: boolean | null) => loggedIn !== null),
        take(1),
        tap(isLoggedIn => {
            if (!isLoggedIn) {
                // If the user is not logged in, redirect them to the login page
                router.navigate(['/login']);
            }
        })
    );
};
