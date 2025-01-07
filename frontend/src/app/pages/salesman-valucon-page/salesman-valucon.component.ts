import {Component, OnInit, ViewChild} from "@angular/core";
import {ApiService} from "@app/services/api-service/api.service";
import OdooBonusDTO from "@app/dtos/Odoo/OdooBonusDTO";
import {ActivatedRoute} from "@angular/router";
import {MatTabGroup} from "@angular/material/tabs";
import OdooSalesmanDTO from "@app/dtos/Odoo/OdooSalesmanDTO";

@Component({
    selector: 'app-salesman-valucon',
    templateUrl: './salesman-valucon.component.html',
    styleUrls: ['./salesman-valucon.component.css']
})

export class SalesmanValuconComponent implements OnInit {
    @ViewChild('tabGroup') tabGroup: MatTabGroup;
    odooBonuses: OdooBonusDTO[] = [];
    salesman: OdooSalesmanDTO | null = null;
    displayedColumns: string[] = ['bonus_reason_id', 'bonus_amount', 'bonus_state'];

    constructor(private apiService: ApiService, private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('sid');
        if(id) {
            this.fetchOdooBonuses(id);
            this.load(id).then(r => console.log(this.salesman));
        }
    }

    fetchOdooBonuses(id: string): void {
        this.apiService.getOdooBonuses(id).subscribe((data: OdooBonusDTO[]): void => {
            this.odooBonuses = data;
        });
    }
    async load(id): Promise<void> {
        await this.fetchOdooSalesman(id);
    }

    async fetchOdooSalesman(id: string): Promise<void> {
        this.apiService.getOdooSalesman(id).subscribe((data: OdooSalesmanDTO): void => {
            this.salesman = data;
            console.log('data: ', data);
            console.log('salesman: ', this.salesman);
        });
    }
}
