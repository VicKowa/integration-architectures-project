import { Component } from '@angular/core';

@Component({
    selector: 'app-create-bonus',
    templateUrl: './create-bonus.component.html',
    styleUrls: ['./create-bonus.component.css']
})
export class CreateBonusComponent {
    salesman = {
        sid: '123456',
        name: 'John Doe',
        department: 'Sales',
        year: '2024'
    };

    tab1Data = [
        { column1: 'Data1', column2: 'Data2', column3: 'Data3', column4: 'Data4', editableValue: '', comments: '' },
        { column1: 'Data1', column2: 'Data2', column3: 'Data3', column4: 'Data4', editableValue: '', comments: '' },
    ];

    tab1BonusValue = '';

    tab2Data = [
        { column1: 'DataA', column2: 'DataB', column3: 'DataC', editableValue: '', comments: '' },
        { column1: 'DataA', column2: 'DataB', column3: 'DataC', editableValue: '', comments: '' },
    ];

    tab2BonusValue = '';

    comments = '';

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
