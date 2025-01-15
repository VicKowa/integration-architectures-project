import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {SalesmanDTO} from '@app/dtos/SalesmanDTO';
import {MatTab} from '@angular/material/tabs';

@Component({
    selector: 'app-salesman-table',
    templateUrl: './salesman-table.component.html',
    styleUrls: ['./salesman-table.component.css'],
})
export class SalesmanTableComponent implements AfterViewInit {
    @Input() salesmenDataSource: MatTableDataSource<SalesmanDTO> = null;
    private selectedSalesman: SalesmanDTO | null = null;

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
        this.selectedSalesman = salesman;
    }


    getSelectedSalesman(): SalesmanDTO | null {
        return this.selectedSalesman;
    }
}
