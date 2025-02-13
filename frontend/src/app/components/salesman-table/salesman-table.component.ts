import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {SalesmanDTO} from '@app/dtos/SalesmanDTO';

@Component({
    selector: 'app-salesman-table',
    templateUrl: './salesman-table.component.html',
    styleUrls: ['./salesman-table.component.css'],
    standalone: false
})
export class SalesmanTableComponent implements AfterViewInit {
    @Input() salesmenDataSource: MatTableDataSource<SalesmanDTO> = null;
    @Input() globalSelectedSalesman: SalesmanDTO | null = null;

    // Event, um einen Salesman an die Elternkomponente zu übergeben
    @Output() salesmanSelected = new EventEmitter<SalesmanDTO>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;

    constructor() {
    }

    ngAfterViewInit(): void {
        this.salesmenDataSource.sort = this.sort;
        this.salesmenDataSource.paginator = this.paginator;
    }

    selectSalesman(salesman: SalesmanDTO): void {
        this.salesmanSelected.emit(salesman);
    }


    getSelectedSalesman(): SalesmanDTO | null {
        return this.globalSelectedSalesman;
    }
}
