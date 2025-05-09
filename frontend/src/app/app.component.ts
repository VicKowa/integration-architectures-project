import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
    constructor(
        public authService: AuthService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe((value: boolean): void => {
            this.cd.markForCheck();
        });
    }
}
