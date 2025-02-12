import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { User } from '@app/models/User';
import { UserService } from '@app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit, OnDestroy {

    user: User;
    buttons: { title: string; routerLink?: string; action?: () => void }[] = [];
    private authSubscription: Subscription;

    // The buttonMap provides the mapping between roles and buttons.
    private buttonMap = new class ButtonMap {
        private getButtonMap(username: string): Record<string, { title: string; routerLink?: string; action?: () => void }[]> {
            return {
                salesman_valucon: [
                    { title: 'Welcome', routerLink: '/example' },
                    { title: 'My Profile', routerLink: `salesman/valucon/${username}` }
                ],
                salesman: [
                    { title: 'Welcome', routerLink: '/example' },
                    { title: 'My Profile', routerLink: `salesman/${username}` }
                ],
                ceo: [
                    { title: 'Welcome', routerLink: '/example' },
                    {
                        title: 'Dashboard',
                        action: () => window.location.href = '/eval/list?year=2025'
                    },
                    { title: 'SmartHoover', routerLink: 'salesman/list' }
                ],
                hr: [
                    { title: 'Welcome', routerLink: '/example' },
                    {
                        title: 'Dashboard',
                        action: () => window.location.href = '/eval/list?year=2025'
                    },
                    { title: 'SmartHoover', routerLink: 'salesman/list' },
                    { title: 'Valucon', routerLink: 'salesman/valucon/list' }
                ],
                admin: [
                    { title: 'Welcome', routerLink: '/example' },
                    {
                        title: 'Dashboard',
                        action: () => window.location.href = '/eval/list?year=2025'
                    },
                    { title: 'SmartHoover', routerLink: 'salesman/list' },
                    { title: 'Valucon', routerLink: 'salesman/valucon/list' }
                ],
            };
        }

        public getButtons(user: User): { title: string; routerLink?: string; action?: () => void }[] {
            return this.getButtonMap(user.username)[user.role] || [];
        }
    }();

    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        // Subscribe to login state changes.
        // When the user is logged in, fetch the user data.
        // When logged out, clear the local state.
        this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            if (isLoggedIn) {
                this.fetchUser();
            } else {
                this.clearUserData();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    /**
     * Logout the current user.
     */
    handleLogout(): void {
        console.log('Logging out...');
        this.authService.logout().subscribe({
            next: () => {
                // Clear the local state immediately after a successful logout.
                this.clearUserData();
                // Navigate to the login page.
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Logout failed:', err);
                // Even on error, clear local state and navigate to login.
                this.clearUserData();
                this.router.navigate(['/login']);
            }
        });
    }

    /**
     * Fetches the currently logged-in user's details.
     */
    fetchUser(): void {
        this.userService.getOwnUser().subscribe({
            next: (user: User): void => {
                this.user = user;
                this.buttons = this.buttonMap.getButtons(this.user);
            },
            error: (err): void => {
                console.error('Error fetching user:', err);
                this.router.navigate(['/login']);
            }
        });
    }

    /**
     * Clears the local user data and button array.
     */
    private clearUserData(): void {
        this.user = null;
        this.buttons = [];
    }
}
