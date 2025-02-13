import { Component, OnInit } from '@angular/core';
import {UserService} from "@app/services/user.service";


@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

    firstname: string = '';
    lastname: string = '';

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getOwnUser().subscribe(user => {
            this.firstname = user.firstname;
            this.lastname = user.lastname;
        });
    }
}
