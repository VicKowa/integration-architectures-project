import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api-service/api.service";
import { Salesman } from '../../models/Salesman';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

    displayedColumns: string[] = ['sid', 'firstname', 'lastname', 'recordCount'];
    salesmen: Salesman[] = [];

    constructor(private apiService: ApiService, private router : Router) { }

    ngOnInit(): void {
        this.fetchSalesmen();
    }

    fetchSalesmen(): void {
        this.apiService.getSalesman().subscribe((data: Salesman[]) => {
            console.log('Salesmen loaded:', data); // Debugging
            this.salesmen = data;
        });
    }

    getRecordCount(salesman: Salesman): number {
        return salesman.socialPerformanceRecords.length;
    }

    navigateToDetails(sid: string): void {
        this.router.navigate(['/salesman', sid]).then(r => console.log('Navigation result:', r));
    }
}
