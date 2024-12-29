import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api-service/api.service";
import { OrangeHRMSalesmanDTO } from "../../dtos/OrangeHRM/OrangeHRMSalesmanDTO";
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

    displayedColumns: string[] = ['sid', 'firstname', 'lastname', 'recordCount'];
    salesmen: OrangeHRMSalesmanDTO[] = [];

    constructor(private apiService: ApiService, private router : Router) { }

    ngOnInit(): void {
        this.fetchSalesmen();
    }

    fetchSalesmen(): void {
        this.apiService.getSalesman().subscribe((data: OrangeHRMSalesmanDTO[]) => {
            this.salesmen = data;
        });
    }

    getRecordCount(salesman: OrangeHRMSalesmanDTO): number {
        return 0; // TODO: Implement record count
    }

    navigateToDetails(sid: string): void {
        this.router.navigate(['/salesman', sid]).then(r => console.log('Navigation result:', r));
    }
}
