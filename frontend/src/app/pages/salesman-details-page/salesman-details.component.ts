import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from "../../services/api-service/api.service";
import { OrangeHRMSalesmanDTO } from "../../dtos/OrangeHRM/OrangeHRMSalesmanDTO";
import OpenCRXSaleDTO from "../../dtos/OpenCRX/OpenCRXSaleDTO";
import {MatTabGroup} from "@angular/material/tabs";
import OpenCRXOrderDTO from "../../dtos/OpenCRX/OpenCRXOrderDTO";

@Component({
    selector: 'app-salesman-details',
    templateUrl: './salesman-details.component.html',
    styleUrls: ['./salesman-details.component.css']
})
export class SalesmanDetailsComponent {
    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    salesman: OrangeHRMSalesmanDTO | null = null;
    sales: OpenCRXSaleDTO[] = []; // Placeholder for Sales Orders
    orders: OpenCRXOrderDTO[] = []; // Placeholder for Orders
    selectedSale: OpenCRXSaleDTO | null = null; // Currently selected order
    orderDetails: OpenCRXOrderDTO[] = []; // Details of the selected order
    bonuses: string[] = []; // Bonuses for the salesman

    constructor(private route: ActivatedRoute, private apiService: ApiService) { }

    ngOnInit(): void {
        const sid = this.route.snapshot.paramMap.get('sid');
        if (sid) {
            this.fetchSalesmanDetails(sid);
            this.fetchSalesOrders(sid);
            // this.fetchBonuses(sid);
        }
    }

    /**
     * Fetches the details of a salesman by their ID
     *
     * @param sid The ID of the salesman
     * */
    fetchSalesmanDetails(sid: string): void {
        this.apiService.getSalesmanById(sid).subscribe((data: OrangeHRMSalesmanDTO) => {
            this.salesman = data;
        });
    }

    /**
     * Fetches the sales orders for a salesman
     *
     * @param sid The ID of the salesman
     * */
    fetchSalesOrders(sid: string): void {
        this.apiService.getSalesOrders(sid).subscribe((sales: OpenCRXSaleDTO[]) => {
            // get the orders from the sales object
            for (let sale of sales) {
                this.sales.push(sale);
                for (let order of sale.orders) {
                    // Does not trigger change detection in Angular
                    this.orders.push(order);
                }
            }

            // sort the sales by priority
            this.sales.sort((a, b) => {
                const priorityA = parseInt(a.priority);
                const priorityB = parseInt(b.priority);
                return priorityB - priorityA; // Absteigend sortieren
            });

            // To trigger change detection in Angular (updates the view)
            this.sales = [...this.sales];
            this.orders = [...this.orders];
        });
    }

    /**
     * Fetches the bonuses for a salesman
     *
     * @param sid The ID of the salesman
     * */
    fetchBonuses(sid: string): void {
        this.apiService.getBonuses(sid).subscribe((bonuses: string[]) => {
            this.bonuses = bonuses;
        });
    }

    /**
     * Selects an order
     *
     * @param sale The order to select
     * */
    selectSale(sale: OpenCRXSaleDTO): void {
        this.orderDetails = [];
        console.log('sale: ', sale);
        this.selectedSale = sale;

        for (let order of sale.orders) {
            this.orderDetails.push(order);
        }

        this.orderDetails = [...this.orderDetails];
    }
}
