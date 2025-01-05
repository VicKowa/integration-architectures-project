import {Component, OnInit} from '@angular/core';
import { ApiService } from '../../services/api-service/api.service';

@Component({
    selector: 'app-create-bonus',
    templateUrl: './create-bonus.component.html',
    styleUrls: ['./create-bonus.component.css']
})
export class CreateBonusComponent implements OnInit {
    // Default role is empty
    currentRole = '';

    salesman = {
        sid: '123456',
        name: 'John Doe',
        department: 'Sales',
        year: '2024'
    };

    tab1Data = [
        { column1: 'Data1', column2: 'Data2', column3: 'Data3', column4: 'Data4', bonus: '', comments: '' },
        { column1: 'Data1', column2: 'Data2', column3: 'Data3', column4: 'Data4', bonus: '', comments: '' },
    ];

    tab1BonusValue = '';

    tab2Data = [
        { column1: 'DataA', column2: 'DataB', column3: 'DataC', bonus: '', comments: '' },
        { column1: 'DataA', column2: 'DataB', column3: 'DataC', bonus: '', comments: '' },
    ];

    tab2BonusValue = '';

    comments = '';

    constructor(private apiService : ApiService) { }

    ngOnInit(): void {
        this.fetchRole();
    }

    fetchRole(): void {
        this.apiService.getCurrentRole().subscribe((role): void => {
            this.currentRole = role;
        });

        console.log('currentRole:', this.currentRole);
    }

    submit(): void {
        console.log('Data submitted:', {
            tab1Data: this.tab1Data,
            tab1BonusValue: this.tab1BonusValue,
            tab2Data: this.tab2Data,
            tab2BonusValue: this.tab2BonusValue,
            comments: this.comments,
        });
    }
}
