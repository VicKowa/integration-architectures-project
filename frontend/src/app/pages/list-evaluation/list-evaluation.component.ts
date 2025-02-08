import {Component, Input as RoutingInput, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Salesman} from '@app/models/Salesman';
import {SalesmanTableComponent} from '@app/components/salesman-table/salesman-table.component';
import {SalesmanService} from '@app/services/salesman.service';
import {EvaluationService} from '@app/services/evaluation.service';
import {SalesmanDTO} from '@app/dtos/SalesmanDTO';
import {ApprovalEnum, EvaluationDTO} from '@app/dtos/EvaluationDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '@app/services/api-service/api.service';

@Component({
    selector: 'app-listed-bonuses-page',
    templateUrl: './list-evaluation.component.html',
    styleUrls: ['./list-evaluation.component.css'],
})
export class ListEvaluationComponent implements OnInit {

    @RoutingInput() year: string = "2025"; // Default year is 2025
    years: number[] = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

    userRole: string;

    salesmenToEvaluate: MatTableDataSource<SalesmanDTO> = new MatTableDataSource();
    evaluatedSalesmen: MatTableDataSource<SalesmanDTO> = new MatTableDataSource();

    @ViewChild('salesmenToEvaluateTable') salesmenToEvaluateTable!: SalesmanTableComponent;
    @ViewChild('evaluatedSalesmenTable') evaluatedSalesmenTable!: SalesmanTableComponent;

    constructor(
        private apiService: ApiService,
        private salesmanService: SalesmanService,
        private evaluationService: EvaluationService,
        private router: Router,
        private route: ActivatedRoute
    )
    {

    }

    async ngOnInit(): Promise<void>{
        this.route.queryParams.subscribe(params => {
            this.year = params['year'] || this.year;
        });

        this.userRole = await this.apiService.getCurrentRole().toPromise();

        // // TODO: Remove dummy data
        // this.userRole = 'ceo';

        switch (this.userRole) {
        case 'ceo':
            await this.onInitCeo();
            break;
        case 'hr':
            await this.onInitHR();
            break;
        default:
        }
    }

    async onInitCeo(): Promise<void> {
        const allSalesmen: SalesmanDTO[] = await this.salesmanService.getAllSalesmen().toPromise();
        console.log(allSalesmen);
        const allEvaluations: Set<string> = new Set((await this.evaluationService
            .getAllEvaluations({year: this.year}).toPromise())
            .filter((e: EvaluationDTO): boolean => e.approvalStatus !== ApprovalEnum.NONE)
            .map((e: EvaluationDTO): string => e.sid));

        this.salesmenToEvaluate.data = allSalesmen.filter((s: SalesmanDTO): boolean => !allEvaluations.has(s.sid));
        this.evaluatedSalesmen.data = allSalesmen.filter((s: SalesmanDTO): boolean => allEvaluations.has(s.sid));
    }

    async onInitHR(): Promise<void> {
        const allSalesmen: SalesmanDTO[] = await this.salesmanService.getAllSalesmen().toPromise();

        const allEvaluations: EvaluationDTO[] = (await this.evaluationService
            .getAllEvaluations({year: this.year}).toPromise());

        const ceoEvaluations: Set<string> = new Set(allEvaluations
            .filter((e: EvaluationDTO): boolean => e.approvalStatus === ApprovalEnum.CEO)
            .map((e: EvaluationDTO): string => e.sid));

        const higherEvaluations: Set<string> = new Set(allEvaluations
            .filter((e: EvaluationDTO): boolean =>  e.approvalStatus >= ApprovalEnum.HR)
            .map((e: EvaluationDTO): string => e.sid));

        this.salesmenToEvaluate.data = allSalesmen.filter((s: SalesmanDTO): boolean => ceoEvaluations.has(s.sid));
        this.evaluatedSalesmen.data = allSalesmen.filter((s: SalesmanDTO): boolean => higherEvaluations.has(s.sid));
    }

    async createEvaluation(): Promise<void> {
        const selectedSalesman: Salesman = this.salesmenToEvaluateTable.getSelectedSalesman();

        if (!selectedSalesman) {
            return;
        }

        console.log('Create bonus for ' + selectedSalesman.firstname + ' ' + selectedSalesman.lastname);

        try {
            await this.evaluationService.createEvaluation(selectedSalesman.sid, this.year).toPromise();
            await this.router.navigate(['/eval/create'], {
                queryParams: {
                    year: this.year, // TODO remove year
                    sid: selectedSalesman.sid,
                }
            });
        } catch (error) {
            console.error('Error creating evaluation:', error);
        }
    }

    onYearChange(selectedYear: string): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { year: selectedYear },
            queryParamsHandling: 'merge'
        }).then(() => {
            window.location.reload();
        });
    }
}
