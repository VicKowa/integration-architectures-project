import { inject } from '@angular/core';
import {Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, take, tap } from 'rxjs/operators';
import {Observable} from 'rxjs';

export const authGuard: CanActivateFn = (
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    return authService.isLoggedIn$.pipe(
        // Wait until the auth state is known (assuming you initialize it to null)
        filter((loggedIn: boolean | null): boolean => loggedIn !== null),
        take(1),
        tap((isLoggedIn: boolean | UrlTree): void => {
            if (!isLoggedIn) {
                // If the user is not logged in, redirect them to the login page
                void router.navigate(['/login']);
            }
        })
    );
};
