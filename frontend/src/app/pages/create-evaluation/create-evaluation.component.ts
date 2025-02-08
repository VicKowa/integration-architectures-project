import { Component, Input as RoutingInput, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api-service/api.service';
import { SalesmanDTO } from '@app/dtos/SalesmanDTO';
import { SalesmanService } from '@app/services/salesman.service';
import { EvaluationService } from '@app/services/evaluation.service';
import { ApprovalEnum, EvaluationDTO} from '@app/dtos/EvaluationDTO';
import { Router } from '@angular/router';
import {Order} from "@app/dtos/OrderEvaluationDTO";
import {SpecifiedRecords} from "@app/dtos/SocialPerformanceRecordDTO";

export interface OrderEvaluationData {
    name: string;
    number: string;
    client: string;
    client_ranking: string;
    items: string;
    bonus: string;
    comments: string;
}

export interface SocialPerformanceRecordData {
    column1: string;
    targetValue: string;
    actualValue: string;
    bonus: string;
    comment: string;
}

@Component({
    selector: 'app-create-bonus',
    templateUrl: './create-evaluation.component.html',
    styleUrls: ['./create-evaluation.component.css']
})
export class CreateEvaluationComponent implements OnInit {

    @RoutingInput() year: string | null;
    @RoutingInput() sid: string | null;

    // default role is salesman
    userRole: string = 'salesman';
    salesman: SalesmanDTO;
    evaluation: EvaluationDTO;

    orderEvaluationData: Array<OrderEvaluationData> = [];

    orderEvaluationBonus: string = '';

    readOnly: boolean = false;

    socialPerformanceRecordData: SocialPerformanceRecordData[] = [
        { column1: 'Leadership Competence', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Openness To Employee', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Social Behaviour To Employee', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Attitude Towards Clients', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Communication Skills', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Integrity To Company', targetValue: '', actualValue: '', bonus: '', comment: '' }
    ];

    socialPerformanceRecordBonus: string = '';

    totalBonus: string = '';

    comments: string = '';

    constructor(
        private apiService: ApiService,
        private salesmanService: SalesmanService,
        private evaluationService: EvaluationService,
        private router: Router
    )
    {
        this.salesman = new SalesmanDTO(
            'Unknown',
            'Unknown',
            'Unknown',
            'Unknown'
        );

        this.evaluation = new EvaluationDTO(
            this.sid,
            this.year,
            'Unknown',
            null,
            null,
            ApprovalEnum.NONE,
            ""
        );
    }

    async ngOnInit(): Promise<void> {
        this.salesman = await this.salesmanService.getSalesmen(this.sid).toPromise();
        this.userRole = await this.apiService.getCurrentRole().toPromise();
        this.readOnly = this.router.url.includes('view');

        this.fetchAndMapEvaluationData();
    }

    /**
     * Fetches the evaluation data from the backend and maps it to the component's properties
     * */
    fetchAndMapEvaluationData(): void {
        if (!this.sid || !this.year) return;

        this.evaluationService.getEvaluation(this.sid, this.year).subscribe({
            next: (evaluation: EvaluationDTO): void => {
                this.evaluation = evaluation;

                // Map order evaluation data
                this.orderEvaluationData = evaluation.orderEvaluation.orders.map((order: Order): OrderEvaluationData => ({
                    name: order.productName,
                    number: order.productNumber,
                    client: '', // Assuming client info is not available in order
                    client_ranking: order.clientRanking,
                    items: order.items.toString(),
                    bonus: order.bonus.toString(),
                    comments: order.comment.toString() // Assuming comments are not available in order
                }));

                // Map social performance record data
                const records: SpecifiedRecords = evaluation.socialPerformanceEvaluation.specifiedRecords;
                this.socialPerformanceRecordData = [
                    {
                        column1: 'Leadership Competence',
                        targetValue: records.leadershipCompetence.targetValue.toString(),
                        actualValue: records.leadershipCompetence.actualValue.toString(),
                        bonus: records.leadershipCompetence.bonus.toString(),
                        comment: records.leadershipCompetence.comment.toString()
                    },
                    {
                        column1: 'Openness To Employee',
                        targetValue: records.opennessToEmployee.targetValue.toString(),
                        actualValue: records.opennessToEmployee.actualValue.toString(),
                        bonus: records.opennessToEmployee.bonus.toString(),
                        comment: records.opennessToEmployee.comment.toString()
                    },
                    {
                        column1: 'Social Behaviour To Employee',
                        targetValue: records.socialBehaviorToEmployee.targetValue.toString(),
                        actualValue: records.socialBehaviorToEmployee.actualValue.toString(),
                        bonus: records.socialBehaviorToEmployee.bonus.toString(),
                        comment: records.socialBehaviorToEmployee.comment.toString()
                    },
                    {
                        column1: 'Attitude Towards Clients',
                        targetValue: records.attitudeToClients.targetValue.toString(),
                        actualValue: records.attitudeToClients.actualValue.toString(),
                        bonus: records.attitudeToClients.bonus.toString(),
                        comment: records.attitudeToClients.comment.toString()
                    },
                    {
                        column1: 'Communication Skills',
                        targetValue: records.communicationSkills.targetValue.toString(),
                        actualValue: records.communicationSkills.actualValue.toString(),
                        bonus: records.communicationSkills.bonus.toString(),
                        comment: records.communicationSkills.comment.toString()
                    },
                    {
                        column1: 'Integrity To Company',
                        targetValue: records.integrityToCompany.targetValue.toString(),
                        actualValue: records.integrityToCompany.actualValue.toString(),
                        bonus: records.integrityToCompany.bonus.toString(),
                        comment: records.integrityToCompany.comment.toString()
                    }
                ];

                this.socialPerformanceRecordBonus = evaluation.socialPerformanceEvaluation.totalBonus.toString();
                this.orderEvaluationBonus = evaluation.orderEvaluation.totalBonus.toString();
                this.totalBonus = evaluation.totalBonus.toString();

                this.comments = evaluation.comment;

                // Update the references to trigger change detection in Angular
                this.orderEvaluationData = [...this.orderEvaluationData];
                this.socialPerformanceRecordData = [...this.socialPerformanceRecordData];
            },
            error: (err: any): void => console.error(`Error fetching evaluation:\n${err}`)
        });
    }

    /**
     * Submits the evaluation based on the user role
     * */
    async submit(): Promise<void> {
        switch (this.userRole) {
            case 'admin':
                await this.onSubmitCeo();
                break;
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

    /**
     * Action to be taken when the CEO submits the evaluation
     * */
    private async onSubmitCeo(): Promise<void> {
        try {
            // Update the order evaluation data
            this.evaluation.orderEvaluation.orders.forEach((order: Order, index: number): void => {
                order.bonus = parseInt(this.orderEvaluationData[index].bonus) || 0;
                order.comment = this.orderEvaluationData[index].comments;
            });

            // Update the social performance record data
            const records: SpecifiedRecords = this.evaluation.socialPerformanceEvaluation.specifiedRecords;
            this.socialPerformanceRecordData.forEach((record: SocialPerformanceRecordData, index: number): void  => {
                const key: string = Object.keys(records)[index];
                records[key].bonus = parseInt(record.bonus) || 0;
                records[key].comment = record.comment;
            });

            // Update bonus and comments
            this.evaluation.comment = this.comments;
            this.evaluation.approvalStatus = ApprovalEnum.CEO;

            this.setBonusValues();

            // Send the updated evaluation to the backend
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            await this.router.navigate(['/eval/list'], { queryParams: { year: this.year } });
        } catch (error) {
            console.error(`Error during CEO submission:\n${error}`);
        }
    }

    /**
     * Action to be taken when the HR submits the evaluation
     * */
    async onSubmitHR(): Promise<void> {
        try {
            this.evaluation.approvalStatus = ApprovalEnum.HR;
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            await this.router.navigate(['/eval/list'], { queryParams: { year: this.year } });
        } catch (error) {
            console.error(`Error during HR submission:\n${error}`);
        }
    }

    /**
     * Action to be taken when the Salesman submits the evaluation
     * */
    async onSubmitSalesman(): Promise<void> {
        try {
            this.evaluation.approvalStatus = ApprovalEnum.SALESMAN;
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            await this.router.navigate(['/eval/list?year=' + this.year]);
        } catch (error) {
            console.error(`Error during Salesman submission:\n${error}`);
        }
    }

    /**
     * Reopens the evaluation
     * */
    async reopen(): Promise<void> {
        try {
            this.evaluation.approvalStatus = ApprovalEnum.NONE;
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            await this.router.navigate(['/eval/list']);
        } catch (error) {
            console.error(`Error during reopening:\n${error}`);
        }
    }

    /**
     * Calculates the total bonus for the evaluation
     * */
    calculateTotalBonus(): void {
        let calculatedOrderEvaluationBonus: number = 0;
        let calculatedSocialPerformanceRecordBonus: number = 0;

        this.orderEvaluationData.forEach((record: OrderEvaluationData): void => {
            calculatedOrderEvaluationBonus += parseInt(record.bonus) || 0;
        });

        this.orderEvaluationBonus = calculatedOrderEvaluationBonus.toString();

        this.socialPerformanceRecordData.forEach((order: SocialPerformanceRecordData): void => {
            calculatedSocialPerformanceRecordBonus += parseInt(order.bonus) || 0;
        });

        this.socialPerformanceRecordBonus = calculatedSocialPerformanceRecordBonus.toString();

        this.totalBonus = (calculatedOrderEvaluationBonus + calculatedSocialPerformanceRecordBonus).toString();
    }

    /**
     * Sets the bonus values for the evaluation
     * */
    private setBonusValues(): void {
        this.evaluation.totalBonus = parseInt(this.totalBonus) || 0;
        this.evaluation.socialPerformanceEvaluation.totalBonus = parseInt(this.socialPerformanceRecordBonus) || 0;
        this.evaluation.orderEvaluation.totalBonus = parseInt(this.orderEvaluationBonus) || 0;
    }
}
