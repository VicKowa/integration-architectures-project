import { Component, Input as RoutingInput, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Salesman } from '@app/models/Salesman';
import { SalesmanTableComponent } from '@app/components/salesman-table/salesman-table.component';
import { SalesmanService } from '@app/services/salesman.service';
import { EvaluationService } from '@app/services/evaluation.service';
import { SalesmanDTO } from '@app/dtos/SalesmanDTO';
import { ApprovalEnum, EvaluationDTO } from '@app/dtos/EvaluationDTO';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@app/services/api-service/api.service';

@Component({
    selector: 'app-listed-bonuses-page',
    templateUrl: './list-evaluation.component.html',
    styleUrls: ['./list-evaluation.component.css'],
    standalone: false
})
export class ListEvaluationComponent implements OnInit {
    @RoutingInput() year = '2025'; // Default year is 2025
    years: number[] = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

    userRole: string;

    eventData: {
        selectedSalesman: SalesmanDTO | null;
        toEvaluate: boolean;
    } = {
            selectedSalesman: null,
            toEvaluate: false
        };

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
    ) { }

    async ngOnInit(): Promise<void>{
        // Get the year from the query params
        this.route.queryParams.subscribe((params: Params): void => {
            if (typeof params.year === 'string') {
                this.year = params.year;
            }
        });

        // Get user role
        this.userRole = await this.apiService.getCurrentRole().toPromise();

        // different actions based on role
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

    /**
     * Actions to be taken when the user is a CEO
     * */
    async onInitCeo(): Promise<void> {
        // get all salesmen
        const allSalesmen: SalesmanDTO[] = await this.salesmanService.getAllSalesmen().toPromise();

        // get all evaluations from the year
        //     -> filter out evaluations with approval status NONE
        //     -> get the sid of the evaluations
        const allEvaluations: Set<string> = new Set((await this.evaluationService
            .getAllEvaluations({year: this.year}).toPromise())
            .filter((e: EvaluationDTO): boolean => e.approvalStatus !== ApprovalEnum.NONE)
            .map((e: EvaluationDTO): string => e.sid));

        // sort salesmen into two groups
        //     -> salesmen to evaluate
        //     -> evaluated salesmen
        this.salesmenToEvaluate.data = allSalesmen.filter((s: SalesmanDTO): boolean => !allEvaluations.has(s.sid));
        this.evaluatedSalesmen.data = allSalesmen.filter((s: SalesmanDTO): boolean => allEvaluations.has(s.sid));
    }

    /**
     * Actions to be taken when the user is an HR
     * */
    async onInitHR(): Promise<void> {
        // get all salesmen
        const allSalesmen: SalesmanDTO[] = await this.salesmanService.getAllSalesmen().toPromise();

        // get all evaluations from the year
        const allEvaluations: EvaluationDTO[] = (await this.evaluationService
            .getAllEvaluations({year: this.year}).toPromise());

        //     -> filter evaluations with approval status CEO
        //     -> get the sid of the evaluations
        const ceoEvaluations: Set<string> = new Set(allEvaluations
            .filter((e: EvaluationDTO): boolean => e.approvalStatus === ApprovalEnum.CEO)
            .map((e: EvaluationDTO): string => e.sid));

        //     -> filter evaluations with approval status HR or lower, so that HR can view them again
        //     -> get the sid of the evaluations
        const lowerEvaluations: Set<string> = new Set(allEvaluations
            .filter((e: EvaluationDTO): boolean => e.approvalStatus >= ApprovalEnum.HR)
            .map((e: EvaluationDTO): string => e.sid));

        // sort salesmen into two groups
        //     -> salesmen to evaluate
        //     -> evaluated salesmen
        this.salesmenToEvaluate.data = allSalesmen.filter((s: SalesmanDTO): boolean => ceoEvaluations.has(s.sid));
        this.evaluatedSalesmen.data = allSalesmen.filter((s: SalesmanDTO): boolean => lowerEvaluations.has(s.sid));
    }

    /**
     * Set the selected salesman
     * */
    onSalesmanSelected(salesman: SalesmanDTO, toEvaluate: boolean): void {
        this.eventData = {
            selectedSalesman: salesman,
            toEvaluate
        };
    }

    /**
     * Create an evaluation for the selected salesman
     * */
    async createEvaluation(): Promise<void> {
        // get the selected salesman
        const selectedSalesman: Salesman = this.salesmenToEvaluateTable.getSelectedSalesman();

        console.log('selectedSalesman:', selectedSalesman);

        if (!selectedSalesman) {
            return;
        }

        // check if the selected salesman is already being evaluated
        let evaluation: EvaluationDTO = null;
        try {
            evaluation = await this.evaluationService.getEvaluation(selectedSalesman.sid, this.year).toPromise();
        } catch (_) {
            // do nothing
        }

        if (evaluation) {
            // redirect to the evaluation creation page because it already exists
            await this.router.navigate([`/eval/create/${selectedSalesman.sid}/${this.year}`]);

            // stop the function so that the evaluation is not created again
            return;
        }

        try {
            // create an empty evaluation for the selected salesman if the role is the CEO
            if (this.userRole === 'ceo') {
                await this.evaluationService.createEvaluation(selectedSalesman.sid, this.year).toPromise();
            }

            // redirect to the evaluation creation page
            await this.router.navigate([`/eval/create/${selectedSalesman.sid}/${this.year}`]);
        } catch (error) {
            console.error('Error creating evaluation:', error);
        }
    }

    /**
     * View the (already existing) evaluation of the selected salesman
     * */
    async viewEvaluation(): Promise<void> {
        // get the selected salesman
        const salesman: Salesman = this.evaluatedSalesmenTable.getSelectedSalesman();

        if (!salesman) {
            return;
        }

        // redirect to the evaluation view page
        await this.router.navigate([`/eval/view/${salesman.sid}/${this.year}`]);
    }

    /**
     * Redirect to the evaluation creation page
     * */
    async onYearChange(selectedYear: string): Promise<void> {
        await this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { year: selectedYear },
            queryParamsHandling: 'merge'
        }).then((): void => {
            window.location.reload();
        });
    }
}

