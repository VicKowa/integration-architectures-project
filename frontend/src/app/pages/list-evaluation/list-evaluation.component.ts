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

    async ngOnInit(): Promise<void>{+
        // Get the year from the query params
        this.route.queryParams.subscribe(params => {
            this.year = params['year'] || this.year;
        });

        // Get user role
        this.userRole = await this.apiService.getCurrentRole().toPromise();

        // // TODO: Remove dummy data
        // this.userRole = 'ceo';

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
            .filter((e: EvaluationDTO): boolean => e.approvalStatus <= ApprovalEnum.HR)
            .map((e: EvaluationDTO): string => e.sid));

        // sort salesmen into two groups
        //     -> salesmen to evaluate
        //     -> evaluated salesmen
        this.salesmenToEvaluate.data = allSalesmen.filter((s: SalesmanDTO): boolean => ceoEvaluations.has(s.sid));
        this.evaluatedSalesmen.data = allSalesmen.filter((s: SalesmanDTO): boolean => lowerEvaluations.has(s.sid));
    }

    /**
     * Create an evaluation for the selected salesman
     * */
    async createEvaluation(): Promise<void> {
        // get the selected salesman
        const selectedSalesman: Salesman = this.salesmenToEvaluateTable.getSelectedSalesman();

        if (!selectedSalesman)
            return;

        try {
            // create an empty evaluation for the selected salesman if the role is the CEO
            if (this.userRole === 'ceo')
                await this.evaluationService.createEvaluation(selectedSalesman.sid, this.year).toPromise();

            // redirect to the evaluation creation page
            await this.router.navigate(['/eval/create'], {
                queryParams: {
                    year: this.year,
                    sid: selectedSalesman.sid,
                }
            });
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

        if (!salesman)
            return;

        // redirect to the evaluation view page
        await this.router.navigate(['/eval/view'], {
            queryParams: {
                sid: salesman.sid,
                year: this.year
            }
        });
    }

    /**
     * Redirect to the evaluation creation page
     * */
    async onYearChange(selectedYear: string): Promise<void> {
        await this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { year: selectedYear },
            queryParamsHandling: 'merge'
        }).then(() => {
            window.location.reload();
        });
    }
}

