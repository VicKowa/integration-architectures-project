import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { User } from '@app/models/User';


@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css'],
    standalone: false
})
export class LandingPageComponent implements OnInit {

    firstname = '';
    lastname = '';

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getOwnUser().subscribe((user: User): void => {
            this.firstname = user.firstname;
            this.lastname = user.lastname;
        });
    }
}
