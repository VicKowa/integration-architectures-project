import {Component, OnInit, ViewChild} from '@angular/core';
import { Chart, ChartOptions, ChartType, ChartData } from "chart.js";
import { BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@app/services/api-service/api.service';
import { OrangeHRMSalesmanDTO } from '@app/dtos/OrangeHRM/OrangeHRMSalesmanDTO';
import OpenCRXSaleDTO from '@app/dtos/OpenCRX/OpenCRXSaleDTO';
import {MatTabGroup} from '@angular/material/tabs';
import OpenCRXOrderDTO from '@app/dtos/OpenCRX/OpenCRXOrderDTO';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
    selector: 'app-salesman-details',
    templateUrl: './salesman-details.component.html',
    styleUrls: ['./salesman-details.component.css']
})
export class SalesmanDetailsComponent implements OnInit {
    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    salesman: OrangeHRMSalesmanDTO | null = null;
    sales: OpenCRXSaleDTO[] = []; // Placeholder for Sales Orders
    orders: OpenCRXOrderDTO[] = []; // Placeholder for Orders
    selectedSale: OpenCRXSaleDTO | null = null; // Currently selected order
    orderDetails: OpenCRXOrderDTO[] = []; // Details of the selected order
    bonuses: {
        year: string,
        amount: number
    }[] = [
        { year: '2019', amount: 1000 },
        { year: '2020', amount: 2000 },
        { year: '2021', amount: 3000 },
        { year: '2022', amount: 4000 },
        { year: '2023', amount: 5000 },
        { year: '2024', amount: 6000 },
        { year: '2025', amount: 7000 },
    ]; // Bonuses for the salesman (here: example data in ascending order)

    // Chart.js options
    public chartOptions: ChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Yearly Bonuses'
            }
        }
    };
    public chartType: ChartType = 'bar';
    public chartData: ChartData<'bar'> = {
        // get all the years from the bonuses array
        labels: this.bonuses.map((bonus: {
            year: string,
            amount:number
        }): string => bonus.year),
        datasets: [
            {
                label: 'Bonuses ($)',
                // get all the amounts from the bonuses array
                data: this.bonuses.map((bonus: {
                    year: string,
                    amount: number
                }): number => bonus.amount),
                backgroundColor: 'rgba(22, 160, 133, 0.5)',
                borderColor: 'rgba(15, 81, 50, 0.8)',
                borderWidth: 1,
                borderRadius: 5
            }
        ]
    };

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
        this.apiService.getSalesmanById(sid).subscribe((data: OrangeHRMSalesmanDTO): void => {
            this.salesman = data;
        });
    }

    /**
     * Fetches the sales orders for a salesman
     *
     * @param sid The ID of the salesman
     * @returns void
     * */
    fetchSalesOrders(sid: string): void {
        this.apiService.getSalesOrders(sid).subscribe((sales: OpenCRXSaleDTO[]): void => {
            // get the orders from the sales object
            for (const sale of sales) {
                this.sales.push(sale);
                for (const order of sale.orders) {
                    // Does not trigger change detection in Angular
                    this.orders.push(order);
                }
            }

            // sort the sales by priority
            this.sales.sort((a, b): number => {
                const priorityA = parseInt(a.priority, 10); // 10 is the radix
                const priorityB = parseInt(b.priority, 10);
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
     * @returns void
     * */
    // TODO: Implement bonus endpoint for bonuses from all years

    /**
     * Selects an order
     *
     * @param sale The order to select
     * */
    selectSale(sale: OpenCRXSaleDTO): void {
        this.orderDetails = [];
        this.selectedSale = sale;

        for (const order of sale.orders) {
            this.orderDetails.push(order);
        }

        this.orderDetails = [...this.orderDetails];
    }
}
