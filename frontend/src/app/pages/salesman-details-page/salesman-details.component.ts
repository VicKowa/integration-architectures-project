import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from "../../services/api-service/api.service";
import { Salesman } from '../../models/Salesman';

@Component({
  selector: 'app-salesman-details',
  templateUrl: './salesman-details.component.html',
  styleUrls: ['./salesman-details.component.css']
})
export class SalesmanDetailsComponent {
    salesman: Salesman | null = null;
    salesOrders: any[] = []; // Placeholder for Sales Orders
    selectedOrder: any | null = null; // Currently selected order
    orderDetails: any[] = []; // Details of the selected order
    bonuses: string[] = []; // Bonuses for the salesman

    constructor(private route: ActivatedRoute, private apiService: ApiService) { }

    ngOnInit(): void {
        const sid = this.route.snapshot.paramMap.get('sid');
        if (sid) {
            this.fetchSalesmanDetails(sid);
            this.fetchSalesOrders(sid);
            this.fetchBonuses(sid);
        }
    }

    fetchSalesmanDetails(sid: string): void {
        this.apiService.getSalesmanById(sid).subscribe((data: Salesman) => {
            this.salesman = data;
        });
    }

    fetchSalesOrders(sid: string): void {
        this.apiService.getSalesOrders(sid).subscribe((orders: any[]) => {
            this.salesOrders = orders;
        });
    }

    fetchBonuses(sid: string): void {
        this.apiService.getBonuses(sid).subscribe((bonuses: string[]) => {
            this.bonuses = bonuses;
        });
    }

    selectOrder(order: any): void {
        this.selectedOrder = order;
        this.fetchOrderDetails(order.id);
    }

    fetchOrderDetails(orderId: string): void {
        this.apiService.getOrderDetails(orderId).subscribe((details: any[]) => {
            this.orderDetails = details;
        });
    }
}
