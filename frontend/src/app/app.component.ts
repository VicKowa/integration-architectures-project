import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(
        protected authService: AuthService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe((value: boolean) => {
            console.log('Aktueller isLoggedIn-Wert in Menubar:', value);
            this.cd.markForCheck();
        });
    }
}
