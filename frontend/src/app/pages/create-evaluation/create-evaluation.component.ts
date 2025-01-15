import {Component, Input as RoutingInput, OnInit} from '@angular/core';
import { ApiService } from '@app/services/api-service/api.service';
import {SalesmanDTO} from '@app/dtos/SalesmanDTO';
import {SalesmanService} from '@app/services/salesman.service';
import { EvaluationDTO } from '@app/dtos/EvaluationDTO';

@Component({
    selector: 'app-create-bonus',
    templateUrl: './create-evaluation.component.html',
    styleUrls: ['./create-evaluation.component.css']
})
export class CreateEvaluationComponent implements OnInit {

    @RoutingInput() year: string | null;
    @RoutingInput() sid: string | null;

    userRole: string;
    salesman: SalesmanDTO;
    evaluation: EvaluationDTO;


    // TODO: Remove dummy data
    tab1Data = [
        {column1: 'Data1', column2: 'Data2', column3: 'Data3', column4: 'Data4', bonus: '', comments: ''},
        {column1: 'Data1', column2: 'Data2', column3: 'Data3', column4: 'Data4', bonus: '', comments: ''},
    ];

    tab1BonusValue = '';

    tab2Data = [
        {column1: 'DataA', column2: 'DataB', column3: 'DataC', bonus: '', comments: ''},
        {column1: 'DataA', column2: 'DataB', column3: 'DataC', bonus: '', comments: ''},
    ];

    tab2BonusValue = '';

    comments = '';

    constructor(
        private apiService: ApiService,
        private salesmanService: SalesmanService
    )
    {
        this.salesman = new SalesmanDTO('Unknown','Unknown','Unknown','Unknown');
    }

    async ngOnInit(): Promise<void> {

        this.salesman = await this.salesmanService.getSalesmen(this.sid).toPromise();
        this.userRole = await this.apiService.getCurrentRole().toPromise();

        switch (this.userRole) {
        case 'ceo':
            await this.onInitCeo();
            break;
        case 'hr':
            await this.onInitHR();
            break;
        case 'salesman':
            await this.onInitSalesman();
            break;
        default:
        }
    }

    async onInitCeo(): Promise<void> {
        // TODO: Create EvaluationDTO
    }

    async onInitHR(): Promise<void> {
        // TODO: Get EvaluationDTO from evaluationService
    }

    async onInitSalesman(): Promise<void> {
        // TODO: Get EvaluationDTO from evaluationService
    }

    async submit(): Promise<void> {
        switch (this.userRole) {
        case 'ceo':
            await this.onSubmitCeo();
            break;
        case 'hr':
            await this.onSubmitHR();
            break;
        case 'salesman':
            await this.onSubmitSalesman();
            break;
        default:
        }
    }

    async onSubmitCeo(): Promise<void> {
        // TODO: call evaluationService.createEvaluation with EvaluationDTO
    }

    async onSubmitHR(): Promise<void> {
        // TODO: call evaluationService.updateEvaluation with modified EvaluationDTO
    }

    async onSubmitSalesman(): Promise<void> {
        // TODO: call evaluationService.updateEvaluation with modified EvaluationDTO(Only approvalStatus allowed to be changed)
    }
}
