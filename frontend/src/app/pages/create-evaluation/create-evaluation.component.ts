import { Component, Input as RoutingInput, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api-service/api.service';
import { SalesmanDTO } from '@app/dtos/SalesmanDTO';
import { SalesmanService } from '@app/services/salesman.service';
import { EvaluationService } from '@app/services/evaluation.service';
import { ApprovalEnum, EvaluationDTO} from '@app/dtos/EvaluationDTO';
import { Router } from '@angular/router';



@Component({
    selector: 'app-create-bonus',
    templateUrl: './create-evaluation.component.html',
    styleUrls: ['./create-evaluation.component.css']
})
export class CreateEvaluationComponent implements OnInit {

    @RoutingInput() year: string | null;
    @RoutingInput() sid: string | null;

    userRole: string = 'salesman';
    salesman: SalesmanDTO;
    evaluation: EvaluationDTO;

    orderEvaluationData: Array<{
        name: string,
        number: string,
        client: string,
        client_ranking: string,
        items: string,
        bonus: string,
        comments: string
    }> = [];

    orderEvaluationBonus = '';

    socialPerformanceRecordData: {
        column1: string,
        targetValue: string,
        actualValue: string,
        bonus: string,
        comment: string
    }[] = [
        { column1: 'Leadership Competence', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Openness To Employee', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Social Behaviour To Employee', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Attitude Towards Clients', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Communication Skills', targetValue: '', actualValue: '', bonus: '', comment: '' },
        { column1: 'Integrity To Company', targetValue: '', actualValue: '', bonus: '', comment: '' }
    ];

    socialPerformanceRecordBonus = '';

    totalBonus = '';

    comments = '';

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

        // this.fetchOrderEvaluationData();
        this.fetchAndMapEvaluationData();

        // switch (this.userRole) {
        //     case 'admin':
        //         await this.onInitCeo();
        //         break;
        //     case 'ceo':
        //         await this.onInitCeo();
        //         break;
        //     case 'hr':
        //         await this.onInitHR();
        //         break;
        //     case 'salesman':
        //         await this.onInitSalesman();
        //         break;
        //     default:
        // }
    }


    fetchAndMapEvaluationData(): void {
        if (!this.sid || !this.year) return;

        this.evaluationService.getEvaluation(this.sid, this.year).subscribe({
            next: (evaluation: EvaluationDTO) => {
                this.evaluation = evaluation;
                console.log(evaluation);

                // Map order evaluation data
                this.orderEvaluationData = evaluation.orderEvaluation.orders.map(order => ({
                    name: order.productName,
                    number: order.productNumber,
                    client: '', // Assuming client info is not available in order
                    client_ranking: order.clientRanking,
                    items: order.items.toString(),
                    bonus: order.bonus.toString(),
                    comments: order.comment.toString() // Assuming comments are not available in order
                }));

                // Map social performance record data
                const records = evaluation.socialPerformanceEvaluation.specifiedRecords;
                this.socialPerformanceRecordData = [
                    { column1: 'Leadership Competence', targetValue: records.leadershipCompetence.targetValue.toString(), actualValue: records.leadershipCompetence.actualValue.toString(), bonus: records.leadershipCompetence.bonus.toString(), comment: records.leadershipCompetence.comment.toString() },
                    { column1: 'Openness To Employee', targetValue: records.opennessToEmployee.targetValue.toString(), actualValue: records.opennessToEmployee.actualValue.toString(), bonus: records.opennessToEmployee.bonus.toString(), comment: records.opennessToEmployee.comment.toString() },
                    { column1: 'Social Behaviour To Employee', targetValue: records.socialBehaviorToEmployee.targetValue.toString(), actualValue: records.socialBehaviorToEmployee.actualValue.toString(), bonus: records.socialBehaviorToEmployee.bonus.toString(), comment: records.socialBehaviorToEmployee.comment.toString() },
                    { column1: 'Attitude Towards Clients', targetValue: records.attitudeToClients.targetValue.toString(), actualValue: records.attitudeToClients.actualValue.toString(), bonus: records.attitudeToClients.bonus.toString(), comment: records.attitudeToClients.comment.toString() },
                    { column1: 'Communication Skills', targetValue: records.communicationSkills.targetValue.toString(), actualValue: records.communicationSkills.actualValue.toString(), bonus: records.communicationSkills.bonus.toString(), comment: records.communicationSkills.comment.toString() },
                    { column1: 'Integrity To Company', targetValue: records.integrityToCompany.targetValue.toString(), actualValue: records.integrityToCompany.actualValue.toString(), bonus: records.integrityToCompany.bonus.toString(), comment: records.integrityToCompany.comment.toString()}
                ];

                this.socialPerformanceRecordBonus = evaluation.socialPerformanceEvaluation.totalBonus.toString();
                this.orderEvaluationBonus = evaluation.orderEvaluation.totalBonus.toString();
                this.totalBonus = evaluation.totalBonus.toString();

                this.comments = evaluation.comment;

                // Update the references to trigger change detection
                this.orderEvaluationData = [...this.orderEvaluationData];
                this.socialPerformanceRecordData = [...this.socialPerformanceRecordData];
            },
            error: (err) => console.error('Error fetching evaluation:', err)
        });
    }

    async onInitCeo(): Promise<void> {
        this.fetchAndMapEvaluationData();
    }

    private calculateSocialPerformanceRecordBonus(): void {


        // Angular Change Detection
        this.socialPerformanceRecordData = [...this.socialPerformanceRecordData];
    }

    async onInitHR(): Promise<void> {
        this.evaluationService.getEvaluation(this.sid, this.year).subscribe((evaluation: EvaluationDTO) => {
            this.evaluation = evaluation;
        });
    }

    async onInitSalesman(): Promise<void> {
        this.evaluationService.getEvaluation(this.sid, this.year).subscribe((evaluation: EvaluationDTO) => {
            this.evaluation = evaluation;
        });
    }

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

    // private async onSubmitCeo(): Promise<void> {
    //     try {
    //         const spr = this.createSocialPerformanceRecord();
    //         const oe = this.createOrderEvaluation();
    //
    //         this.evaluation.socialPerformanceEvaluation = spr;
    //         this.evaluation.orderEvaluation = oe;
    //         this.evaluation.approvalStatus = ApprovalEnum.CEO;
    //
    //         console.log(this.evaluation);
    //         // await this.evaluationService.createEvaluation(this.evaluation).toPromise();
    //     } catch (error) {
    //         console.error('Error during CEO submission:', error);
    //     }
    // }
    private async onSubmitCeo(): Promise<void> {
        try {
            // Update the order evaluation data
            this.evaluation.orderEvaluation.orders.forEach((order, index) => {
                order.bonus = parseInt(this.orderEvaluationData[index].bonus) || 0;
                order.comment = this.orderEvaluationData[index].comments;
            });

            // Update the social performance record data
            const records = this.evaluation.socialPerformanceEvaluation.specifiedRecords;
            this.socialPerformanceRecordData.forEach((record, index) => {
                console.log("record", record);
                const key = Object.keys(records)[index];
                records[key].bonus = parseInt(record.bonus) || 0;
                records[key].comment = record.comment;
            });

            // Update bonus and comments

            this.evaluation.comment = this.comments;
            this.evaluation.approvalStatus = ApprovalEnum.CEO;

            this.setBonusValues();

            // Send the updated evaluation to the backend
            console.log(this.evaluation);
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            this.router.navigate(['/eval/list']);
        } catch (error) {
            console.error('Error during CEO submission:', error);
        }
    }

    async onSubmitHR(): Promise<void> {
        try {
            this.evaluation.approvalStatus = ApprovalEnum.HR;
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            this.router.navigate(['/eval/list']);
        } catch (error) {
            console.error('Error during HR submission:', error);
        }
    }

    async onSubmitSalesman(): Promise<void> {
        try {
            this.evaluation.approvalStatus = ApprovalEnum.SALESMAN;
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            this.router.navigate(['/eval/list']);
        } catch (error) {
            console.error('Error during Salesman submission:', error);
        }
    }

    async reopen() {
        try {
            this.evaluation.approvalStatus = ApprovalEnum.NONE;
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();
            this.router.navigate(['/eval/list']);
        } catch (error) {
            console.error('Error during reopening:', error);
        }
    }



    calculateTotalBonus(): void {
        let calculatedOrderEvaluationBonus = 0;
        let calculatedSocialPerformanceRecordBonus = 0;

        this.orderEvaluationData.forEach((record) => {
            calculatedOrderEvaluationBonus += parseInt(record.bonus) || 0;
        });
        this.orderEvaluationBonus = calculatedOrderEvaluationBonus.toString();

        this.socialPerformanceRecordData.forEach((order) => {
            calculatedSocialPerformanceRecordBonus += parseInt(order.bonus) || 0;
        });
        this.socialPerformanceRecordBonus = calculatedSocialPerformanceRecordBonus.toString();

        this.totalBonus = (calculatedOrderEvaluationBonus + calculatedSocialPerformanceRecordBonus).toString();
    }

    private setBonusValues(): void {
        this.evaluation.totalBonus = parseInt(this.totalBonus) || 0;
        this.evaluation.socialPerformanceEvaluation.totalBonus = parseInt(this.socialPerformanceRecordBonus) || 0;
        this.evaluation.orderEvaluation.totalBonus = parseInt(this.orderEvaluationBonus) || 0;
    }
}
