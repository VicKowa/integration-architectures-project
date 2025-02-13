import { Component, OnInit } from '@angular/core';
import {ApiService} from '@app/services/api-service/api.service';
import OdooSalesmanDTO from '@app/dtos/Odoo/OdooSalesmanDTO';
import OdooBonusDTO from '@app/dtos/Odoo/OdooBonusDTO';
import {Router} from '@angular/router';

@Component({
    selector: 'app-salesman-valucon-list-page',
    templateUrl: './salesman-valucon-list-page.component.html',
    styleUrls: ['./salesman-valucon-list-page.component.css']
})
export class SalesmanValuconListPageComponent implements OnInit {
    data: {
        salesman: OdooSalesmanDTO;
        bonuses: OdooBonusDTO[];
    }[] = [];
    displayedColumns: string[] = ['id', 'name'];

    constructor(
        private apiService: ApiService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.fetchAllSalesman();
    }

    fetchAllSalesman(): void {
        this.apiService.getOdooAllSalesman().subscribe((data: OdooSalesmanDTO[]): void => {
            data.forEach((salesman: OdooSalesmanDTO): void => {
                this.apiService.getOdooBonuses(salesman.id).subscribe((bonuses: OdooBonusDTO[]): void => {
                    this.data.push({
                        salesman,
                        bonuses
                    });
                    this.data = [...this.data];
                });
            });

            // To trigger change detection in Angular (updates the view)
            this.data = [...this.data];
        });
        this.data = [...this.data];
    }

    async redirectToSalesman(data: {
        salesman: OdooSalesmanDTO;
        bonuses: OdooBonusDTO[];
    }): Promise<void> {
        await this.router.navigate([`/salesman/valucon/${data.salesman.id}`]);
    }
}
