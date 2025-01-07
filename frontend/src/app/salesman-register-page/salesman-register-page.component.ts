import { Component } from '@angular/core';

@Component({
    selector: 'app-registration-view',
    templateUrl: './salesman-register-page.component.html',
    styleUrls: ['./salesman-register-page.component.css']
})
export class SalesmanRegisterComponent {
    onSubmit() {
        console.log('Form submitted!');
    }
}
