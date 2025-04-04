import {Component, OnInit, ViewChild} from '@angular/core';
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    ChartData,
    ChartOptions,
    ChartType,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/services/api-service/api.service';
import { OrangeHRMSalesmanDTO } from '@app/dtos/OrangeHRM/OrangeHRMSalesmanDTO';
import OpenCRXSaleDTO from '@app/dtos/OpenCRX/OpenCRXSaleDTO';
import { MatTabGroup } from '@angular/material/tabs';
import OpenCRXOrderDTO from '@app/dtos/OpenCRX/OpenCRXOrderDTO';
import { EvaluationService } from '@app/services/evaluation.service';
import { ApprovalEnum, EvaluationDTO } from '@app/dtos/EvaluationDTO';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
    selector: 'app-salesman-details',
    templateUrl: './salesman-details.component.html',
    styleUrls: ['./salesman-details.component.css'],
    styles: [`
        .mat-mdc-table .mat-mdc-row.hr-approval .mat-mdc-cell {
            background-color: rgba(255, 0, 0, 0.1) !important;
        }
    `],
    standalone: false
})

export class SalesmanDetailsComponent implements OnInit {
    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    hrApprovalCache: Map<string, BehaviorSubject<boolean>> = new Map<string, BehaviorSubject<boolean>>();

    salesman: OrangeHRMSalesmanDTO | null = null;
    sales: OpenCRXSaleDTO[] = []; // Placeholder for Sales Orders
    orders: OpenCRXOrderDTO[] = []; // Placeholder for Orders
    selectedSale: OpenCRXSaleDTO | null = null; // Currently selected order
    orderDetails: OpenCRXOrderDTO[] = []; // Details of the selected order
    bonuses: {
        year: string;
        amount: number;
    }[] = [];

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
            year: string;
            amount: number;
        }): string => bonus.year),
        datasets: [
            {
                label: 'Bonuses ($)',
                // get all the amounts from the bonuses array
                data: this.bonuses.map((bonus: {
                    year: string;
                    amount: number;
                }): number => bonus.amount),
                backgroundColor: 'rgba(22, 160, 133, 0.5)',
                borderColor: 'rgba(15, 81, 50, 0.8)',
                borderWidth: 1,
                borderRadius: 5
            }
        ]
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private evaluationService: EvaluationService,
    ) { }

    ngOnInit(): void {
        const sid: string = this.route.snapshot.paramMap.get('sid');
        if (sid) {
            this.fetchSalesmanDetails(sid);
            this.fetchSalesOrders(sid);
            this.fetchBonuses(sid);
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
            this.sales.sort((a: OpenCRXSaleDTO, b: OpenCRXSaleDTO): number => {
                const priorityA: number = parseInt(a.priority, 10); // 10 is the radix
                const priorityB: number = parseInt(b.priority, 10);
                return priorityB - priorityA; // Absteigend sortieren
            });

            // To trigger change detection in Angular (updates the view)
            this.sales = [...this.sales];
            this.orders = [...this.orders];
        });
    }

    /**
     * Fetches the bonuses for a salesman (approved or not)
     *
     * @param sid The ID of the salesman
     * @returns void
     * */
    fetchBonuses(sid: string): void {
        this.evaluationService.getAllEvaluations({ sid }).subscribe((evaluations: EvaluationDTO[]): void => {
            this.bonuses = evaluations
                .filter((e: EvaluationDTO): boolean =>
                    e.approvalStatus === ApprovalEnum.SALESMAN ||
                    e.approvalStatus === ApprovalEnum.HR)
                .map((e: EvaluationDTO): { year: string; amount: number } => ({
                    year: e.year,
                    amount: e.totalBonus
                }));

            console.log('Filtered bonuses:', this.bonuses);
            this.updateChartData();
        });
    }


    /**
     * Redirects to the Bonus View Page (either editable or readonly depending on the approval status)
     *
     * @param bonus The bonus to view
     * */
    viewBonus(bonus: {
        year: string;
        amount: number;
    }): void {
        // redirecting depending on the approval status
        this.evaluationService.getEvaluation(this.salesman.code, bonus.year).subscribe((evaluation: EvaluationDTO): void => {
            this.apiService.getCurrentRole().subscribe((role: string): void => {
                // redirect to the create page if the HR has approved the evaluation
                if (evaluation.approvalStatus === ApprovalEnum.HR && role.toLowerCase() === 'salesman') {
                    void this.router.navigate([`/eval/create/${this.salesman.code}/${bonus.year}`]);
                }
                // redirect to the view page if the HR has not approved the evaluation
                else {
                    void this.router.navigate([`/eval/view/${this.salesman.code}/${bonus.year}`]);
                }
            });
        });
    }

    /**
     * Checks if the HR has approved the bonus of a selected row in the table
     *
     * @param bonus The bonus to check
     * */
    isHrApproval(bonus: { year: string; amount: number }): Observable<boolean> {
        if (!this.salesman || !this.salesman.code) {
            return of(false);
        }

        // key for the stored value in the cache
        const key = `${this.salesman.code}-${bonus.year}`;

        if (this.hrApprovalCache.has(key)) {
            return this.hrApprovalCache.get(key).asObservable();
        }

        const value = new BehaviorSubject<boolean>(false);
        this.hrApprovalCache.set(key, value);

        this.evaluationService.getEvaluation(this.salesman.code, bonus.year).pipe(
            map((evaluation: EvaluationDTO): boolean => evaluation.approvalStatus === ApprovalEnum.HR),
            catchError((err: any): Observable<boolean> => {
                console.error(`Error fetching HR approval status for ${this.salesman.code} in year ${bonus.year}:`, err);
                return of(false);
            })
        ).subscribe((approved: boolean): void => {
            value.next(approved);
        });

        return value.asObservable();
    }

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

    /**
     * Updates the chart data based on the bonuses
     * */
    updateChartData(): void {
        this.chartData = {
            // get all the years from the bonuses array
            labels: this.bonuses.map((bonus: {
                year: string;
                amount: number;
            }): string => bonus.year),
            datasets: [
                {
                    label: 'Bonuses ($)',
                    // get all the amounts from the bonuses array
                    data: this.bonuses.map((bonus: {
                        year: string;
                        amount: number;
                    }): number => bonus.amount),
                    backgroundColor: 'rgba(22, 160, 133, 0.5)',
                    borderColor: 'rgba(15, 81, 50, 0.8)',
                    borderWidth: 1,
                    borderRadius: 5
                }
            ]
        };
    }
}
