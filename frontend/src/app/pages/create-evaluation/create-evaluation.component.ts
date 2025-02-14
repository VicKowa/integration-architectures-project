import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api-service/api.service';
import { BonusServiceService } from '@app/services/bonus-service.service';
import { SalesmanDTO } from '@app/dtos/SalesmanDTO';
import { SalesmanService } from '@app/services/salesman.service';
import { EvaluationService } from '@app/services/evaluation.service';
import { ApprovalEnum, EvaluationDTO } from '@app/dtos/EvaluationDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '@app/dtos/OrderEvaluationDTO';
import { Record, SocialPerformanceRecordDTO, SpecifiedRecords } from '@app/dtos/SocialPerformanceRecordDTO';

export interface OrderEvaluationData {
    name: string;
    number_: string;
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
    styleUrls: ['./create-evaluation.component.css'],
    standalone: false
})
export class CreateEvaluationComponent implements OnInit {

    year: string | null;
    sid: string | null;

    // default role is salesman
    userRole = 'salesman';
    salesman: SalesmanDTO;
    evaluation: EvaluationDTO;

    orderEvaluationData: Array<OrderEvaluationData> = [];

    orderEvaluationBonus = '';

    readOnly = false;

    socialPerformanceRecordData: SocialPerformanceRecordData[] = [
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
        private bonusService: BonusServiceService,
        private router: Router,
        private route: ActivatedRoute
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
            ''
        );
    }

    async ngOnInit(): Promise<void> {
        this.sid = this.route.snapshot.paramMap.get('sid');
        this.year = this.route.snapshot.paramMap.get('year'); // or paramMap.get('year') if set as a route parameter

        if (!this.sid || !this.year) {
            console.error('Salesman ID or Year is missing in the route parameters.');
            return;
        }

        this.salesman = await this.salesmanService.getSalesmen(this.sid).toPromise();
        this.userRole = await this.apiService.getCurrentRole().toPromise();
        this.readOnly = this.router.url.includes('view');

        this.fetchAndMapEvaluationData();
    }

    /**
     * Fetches the evaluation data from the backend and maps it to the component's properties
     * */
    fetchAndMapEvaluationData(): void {
        if (!this.sid || !this.year) {
            return;
        }

        this.evaluationService.getEvaluation(this.sid, this.year).subscribe({
            next: (evaluation: EvaluationDTO): void => {
                this.evaluation = evaluation;

                // Map order evaluation data
                this.orderEvaluationData = evaluation.orderEvaluation.orders.map((order: Order): OrderEvaluationData => ({
                    name: order.productName,
                    number_: order.productNumber,
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
            error: (err: Error): void => console.error('Error fetching evaluation: ', err)
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
            //     -> Update the bonus with the values in the input fields or 0
            //     -> Update the comments with the values in the input fields
            this.evaluation.orderEvaluation.orders.forEach((order: Order, index: number): void => {
                order.bonus = parseInt(this.orderEvaluationData[index].bonus, 10) || 0;
                order.comment = this.orderEvaluationData[index].comments;
            });

            // Update the social performance record data
            //     -> Update the bonus with the values in the input fields or 0
            //     -> Update the comments with the values in the input fields
            this.socialPerformanceRecordData.forEach((record: SocialPerformanceRecordData, index: number): void  => {
                // Get the key of the record
                const key: string = Object.keys(this.evaluation.socialPerformanceEvaluation.specifiedRecords)[index];

                (this.evaluation.socialPerformanceEvaluation.specifiedRecords[key] as Record).bonus =
                    parseInt(record.bonus, 10) ||
                    0;
                (this.evaluation.socialPerformanceEvaluation.specifiedRecords[key] as Record).comment =
                    record.comment ||
                    '';
            });

            // Update the general comment
            this.evaluation.comment = this.comments;

            // Set the approval status to CEO
            this.evaluation.approvalStatus = ApprovalEnum.CEO;

            this.setBonusValues();

            // Send the updated evaluation to the backend
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();

            // Navigate to the list of evaluations
            await this.router.navigate(['/eval/list'], { queryParams: { year: this.year } });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error during CEO submission: ', error.message);
            } else {
                console.error('Error during CEO submission: ', error);
            }
        }
    }

    /**
     * Action to be taken when the HR submits the evaluation
     * */
    async onSubmitHR(): Promise<void> {
        try {
            // Remove all potential changes made by the HR assistant
            this.evaluation = await this.evaluationService.getEvaluation(this.sid, this.year).toPromise();

            // Approved by HR
            this.evaluation.approvalStatus = ApprovalEnum.HR;

            // Update the evaluation (in this case only the approval status)
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();

            // Navigate to the list of evaluations
            await this.router.navigate(['/eval/list'], { queryParams: { year: this.year } });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error during HR submission: ', error.message);
            } else {
                console.error('Error during HR submission: ', error);
            }
        }
    }

    /**
     * Action to be taken when the Salesman submits the evaluation
     * */
    async onSubmitSalesman(): Promise<void> {
        try {
            // Set the approval status to SALESMAN
            this.evaluation.approvalStatus = ApprovalEnum.SALESMAN;

            // Update the evaluation with no changes except the approval status
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();



            // Redirect to the My Profile page
            await this.router.navigate(['/salesman/' + this.sid]);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error during Salesman submission: ', error.message);
            } else {
                console.error('Error during Salesman submission: ', error);
            }
        }
    }

    /**
     * Reopens the evaluation
     * */
    async reopen(): Promise<void> {
        try {
            // Set the approval status to NONE
            this.evaluation.approvalStatus = ApprovalEnum.NONE;

            // Update the evaluation (with all changes from HR)
            console.log(this.evaluation);
            await this.evaluationService.updateEvaluation(this.evaluation).toPromise();

            // Navigate to the list of evaluations or the My Profile page
            if (this.userRole === 'salesman') {
                await this.router.navigate(['/salesman/' + this.sid]);
            } else {
                await this.router.navigate(['/eval/list'], { queryParams: { year: this.year } });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error during reopening: ', error.message);
            } else {
                console.error('Error during reopening: ', error);
            }
        }
    }

    /**
     * Calculates the total bonus for the evaluation
     * */
    calculateTotalBonus(): void {
        let calculatedOrderEvaluationBonus = 0;
        let calculatedSocialPerformanceRecordBonus = 0;

        this.orderEvaluationData.forEach((order: OrderEvaluationData): void => {
            calculatedOrderEvaluationBonus += parseInt(order.bonus, 10) || 0;
        });

        this.orderEvaluationBonus = calculatedOrderEvaluationBonus.toString();

        this.socialPerformanceRecordData.forEach((record: SocialPerformanceRecordData): void => {
            calculatedSocialPerformanceRecordBonus += parseInt(record.bonus, 10) || 0;
        });

        this.socialPerformanceRecordBonus = calculatedSocialPerformanceRecordBonus.toString();

        this.totalBonus = (calculatedOrderEvaluationBonus + calculatedSocialPerformanceRecordBonus).toString();
    }

    /**
     * Called when the user (HR) updates the actual and target values of the social performance record.
     * Adjusts the view to reflect the changes.
     * */
    updateSocialPerformanceRecord(): void {
        // Update the local evaluation object with the new values
        const keys: string[] = Object.keys(this.evaluation.socialPerformanceEvaluation.specifiedRecords);
        keys.forEach((key: string, index: number): void => {
            (this.evaluation.socialPerformanceEvaluation.specifiedRecords[key] as Record).targetValue =
                parseInt(this.socialPerformanceRecordData[index].targetValue, 10) || 0;

            (this.evaluation.socialPerformanceEvaluation.specifiedRecords[key] as Record).actualValue =
                parseInt(this.socialPerformanceRecordData[index].actualValue, 10) || 0;
        });

        // Recalculate the bonus
        this.bonusService.recalculateSPRBonus(this.evaluation).subscribe({
            next: (record: SocialPerformanceRecordDTO): void => {
                // Save the new bonus values in the evaluation object
                this.evaluation.socialPerformanceEvaluation = record;

                // Update the bonus values in the view
                this.socialPerformanceRecordData.forEach((_: SocialPerformanceRecordData, index: number): void => {
                    this.socialPerformanceRecordData[index].bonus =
                        (record.specifiedRecords[keys[index]] as Record).bonus.toString() ||
                        '';
                });

                this.calculateTotalBonus();
            }
        });
    }

    /**
     * Sets the bonus values for the evaluation
     * */
    private setBonusValues(): void {
        this.evaluation.totalBonus = parseInt(this.totalBonus, 10) || 0;
        this.evaluation.socialPerformanceEvaluation.totalBonus = parseInt(this.socialPerformanceRecordBonus, 10) || 0;
        this.evaluation.orderEvaluation.totalBonus = parseInt(this.orderEvaluationBonus, 10) || 0;
    }
}
