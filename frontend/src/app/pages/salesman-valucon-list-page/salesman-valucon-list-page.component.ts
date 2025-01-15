import { Component, OnInit } from '@angular/core';
import {ApiService} from "@app/services/api-service/api.service";
import OdooSalesmanDTO from "@app/dtos/Odoo/OdooSalesmanDTO";
import OdooBonusDTO from "@app/dtos/Odoo/OdooBonusDTO";

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
    displayedColumns: string[] = ['id', 'name', 'bonus'];

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.fetchAllSalesman();
    }

    fetchAllSalesman() {
        this.apiService.getOdooAllSalesman().subscribe((data: OdooSalesmanDTO[]): void => {
            data.forEach((salesman: OdooSalesmanDTO): void => {
                this.apiService.getOdooBonuses(salesman.id).subscribe((bonuses: OdooBonusDTO[]): void => {
                    this.data.push({
                        salesman: salesman,
                        bonuses: bonuses
                    });
                    this.data = [...this.data];
                });
            });

            // To trigger change detection in Angular (updates the view)
            this.data = [...this.data];
        });
        this.data = [...this.data];
    }
}
