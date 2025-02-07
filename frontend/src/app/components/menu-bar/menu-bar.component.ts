import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { User } from '@app/models/User';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

    user: User;

    /*
    This array holds the definition of the menu's buttons.
    */
    buttons = [];

    private buttonMap = new class ButtonMap {

        private getButtonMap(username: string): Record<string, { title: string; routerLink: string }[]> {
            return  {
                salesman_valucon: [
                    {title: 'Welcome', routerLink: ''},
                    {title: 'My Profile', routerLink: `salesman/valucon/${username}`}
                ],
                salesman: [
                    {title: 'Welcome', routerLink: ''},
                    {title: 'My Profile', routerLink: `salesman/${username}`},
                ],
                ceo: [
                    {title: 'Welcome', routerLink: ''},
                    {title: 'Dashboard', routerLink: 'eval/list'},
                    {title: 'SmartHoover', routerLink: 'salesman/list'},
                ],
                hr: [
                    { title: 'Welcome', routerLink: '' },
                    { title: 'Dashboard', routerLink: 'eval/list' },
                    { title: 'SmartHoover', routerLink: 'salesman/list' },
                    { title: 'Valucon', routerLink: 'salesman/valucon/list' },
                ],
                admin: [
                    { title: 'Welcome', routerLink: '' },
                    { title: 'Dashboard', routerLink: 'eval/list' },
                    { title: 'SmartHoover', routerLink: 'salesman/list' },
                    { title: 'Valucon', routerLink: 'salesman/valucon/list' },
                ],
            };
        }


        public getButtons(user: User): { title: string; routerLink: string }[] {
            return this.getButtonMap(user.username)[user.role];
        }
    }();

    /**
     * The following parameters specify objects, which will be provided by dependency injection
     *
     * @param authService
     * @param router
     * @param userService
     */
    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.fetchUser();
    }

    ngOnRefresh(): void {
        this.fetchUser();
    }

    /**
     * Function which handles clicking the logout button
     */
    handleLogout(): void {
        this.authService.logout().subscribe();
        void this.router.navigate(['login']); // after logout, go back to the login-page
    }

    /**
     * Fetches information about the logged-in user
     */
    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            this.buttons = this.buttonMap.getButtons(this.user);
        });
    }
}
