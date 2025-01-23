import { Component, Input as RoutingInput, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api-service/api.service';
import { SalesmanDTO } from '@app/dtos/SalesmanDTO';
import { SalesmanService } from '@app/services/salesman.service';
import { EvaluationService } from '@app/services/evaluation.service';
import { ApprovalEnum, EvaluationDTO } from '@app/dtos/EvaluationDTO';
import { SocialPerformanceRecordDTO } from "@app/dtos/SocialPerformanceRecordDTO";
import { OrderEvaluationDTO } from "@app/dtos/OrderEvaluationDTO";
import OpenCRXSaleDTO from "@app/dtos/OpenCRX/OpenCRXSaleDTO";

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
        comments: string
    }[] = [
        { column1: 'Leadership Competence', targetValue: '', actualValue: '', bonus: '', comments: '' },
        { column1: 'Openness To Employee', targetValue: '', actualValue: '', bonus: '', comments: '' },
        { column1: 'Social Behaviour To Employee', targetValue: '', actualValue: '', bonus: '', comments: '' },
        { column1: 'Attitude Towards Clients', targetValue: '', actualValue: '', bonus: '', comments: '' },
        { column1: 'Communication Skills', targetValue: '', actualValue: '', bonus: '', comments: '' },
        { column1: 'Integrity To Company', targetValue: '', actualValue: '', bonus: '', comments: '' }
    ];

    socialPerformanceRecordBonus = '';

    comments = '';

    constructor(
        private apiService: ApiService,
        private salesmanService: SalesmanService,
        private evaluationService: EvaluationService
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
            ApprovalEnum.NONE
        );
    }

    async ngOnInit(): Promise<void> {
        this.salesman = await this.salesmanService.getSalesmen(this.sid).toPromise();
        this.userRole = await this.apiService.getCurrentRole().toPromise();

        this.fetchOrderEvaluationData();

        switch (this.userRole) {
            case 'admin':
                await this.onInitCeo();
                break;
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

    fetchOrderEvaluationData(): void {
        if (!this.sid) return;

        this.apiService.getSalesOrders(this.sid).subscribe({
            next: (sales: OpenCRXSaleDTO[]) => {
                sales.forEach((sale) => {
                    sale.orders.forEach((order) => {
                        this.orderEvaluationData.push({
                            name: order.crx_product?.name || '',
                            number: order.crx_product?.productNumber || '',
                            client: sale.customer?.name || '',
                            client_ranking: sale.priority || '',
                            items: order.quantity || '',
                            bonus: '',
                            comments: ''
                        });
                    });
                });

                // Sort by name, then by client ranking (numeric, descending)
                this.orderEvaluationData.sort((a, b) => {
                    const nameComparison = a.name.localeCompare(b.name);
                    if (nameComparison !== 0) {
                        return nameComparison;
                    }
                    // Sort by client ranking in descending order
                    return parseInt(b.client_ranking, 10) - parseInt(a.client_ranking, 10);
                });

                // Map client_ranking numbers to terms
                const rankingMap: { [key: number]: string } = {
                    1: 'Low',
                    2: 'Medium',
                    3: 'High',
                    4: 'Very High',
                    5: 'Excellent'
                };

                // Replace rankings with mapped terms
                this.orderEvaluationData = this.orderEvaluationData.map((item) => ({
                    ...item,
                    client_ranking: rankingMap[item.client_ranking] || 'Unknown'
                }));

                // Update the reference to trigger change detection
                this.orderEvaluationData = [...this.orderEvaluationData];

                // Calculate Bonus
                this.calculateOrderEvaluationBonus();
            },
            error: (err) => console.error('Error fetching sales orders:', err)
        });
    }

    async onInitCeo(): Promise<void> {
        this.evaluation = new EvaluationDTO(
            this.sid,
            this.year,
            'unknown',
            null,
            null,
            ApprovalEnum.NONE
        );

        // Random Target and Actual Values
        this.socialPerformanceRecordData.forEach((record: {
            targetValue: string,
            actualValue: string
        }): void => {
            record.targetValue = Math.floor(Math.random() * 5).toString();
            record.actualValue = Math.floor(Math.random() * 5).toString();
        });

        // Angular Change Detection
        this.socialPerformanceRecordData = [...this.socialPerformanceRecordData];

        // Calculate Bonus
        this.calculateSocialPerformanceRecordBonus();
    }

    private calculateSocialPerformanceRecordBonus(): void {


        // Angular Change Detection
        this.socialPerformanceRecordData = [...this.socialPerformanceRecordData];
    }

    private calculateOrderEvaluationBonus(): void {
        const revertToNumber = (ranking: string): number => {
            switch (ranking) {
                case 'Excellent':
                    return 5;
                case 'Very High':
                    return 4;
                case 'High':
                    return 3;
                case 'Medium':
                    return 2;
                case 'Low':
                    return 1;
                default:
                    return 0;
            }
        }

        // Rule:
        // client_ranking = 'Excellent':
        //      0 <= items < 10 -> factor = 125
        //      10 <= items <= 20 -> factor = 140
        //      20 < items -> factor = 155
        // client_ranking = 'Very High':
        //      0 <= items < 10 -> factor = 110
        //      10 <= items <= 20 -> factor = 125
        //      20 < items -> factor = 140
        // client_ranking = 'High':
        //      0 <= items < 10 -> factor = 80
        //      10 <= items <= 20 -> factor = 95
        //      20 < items -> factor = 110
        // client_ranking = 'Medium':
        //      0 <= items < 10 -> factor = 50
        //      10 <= items <= 20 -> factor = 65
        //      20 < items -> factor = 80
        // client_ranking = 'Low':
        //      0 <= items < 10 -> factor = 20
        //      10 <= items <= 20 -> factor = 35
        //      20 < items -> factor = 50

        this.orderEvaluationData.forEach((order: {
            client_ranking: string,
            items: string,
            bonus: string
        }): void => {
            const clientRanking: string = order.client_ranking;
            const items: number = parseInt(order.items);
            let factor: number = 0;

            console.log('clientRanking:', clientRanking);

            switch (clientRanking) {
                case 'Excellent':
                    if (items < 10)
                        factor = 125;
                    else if (items <= 20)
                        factor = 140;
                    else
                        factor = 155;
                    break;
                case 'Very High':
                    if (items < 10)
                        factor = 110;
                    else if (items <= 20)
                        factor = 125;
                    else
                        factor = 140;
                    break;
                case 'High':
                    if (items < 10)
                        factor = 80;
                    else if (items <= 20)
                        factor = 95;
                    else
                        factor = 110;
                    break;
                case 'Medium':
                    if (items < 10)
                        factor = 50;
                    else if (items <= 20)
                        factor = 65;
                    else
                        factor = 80;
                    break;
                case 'Low':
                    if (items < 10)
                        factor = 20;
                    else if (items <= 20)
                        factor = 35;
                    else
                        factor = 50;
                    break;
                default:
                    factor = 0;
            }

            order.bonus = (factor * revertToNumber(clientRanking)).toString();
        });

        // Angular Change Detection
        this.orderEvaluationData = [...this.orderEvaluationData];
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

    private async onSubmitCeo(): Promise<void> {
        try {
            const spr = this.createSocialPerformanceRecord();
            const oe = this.createOrderEvaluation();

            this.evaluation.socialPerformanceEvaluation = spr;
            this.evaluation.orderEvaluation = oe;
            this.evaluation.approvalStatus = ApprovalEnum.CEO;

            console.log(this.evaluation);
            // await this.evaluationService.createEvaluation(this.evaluation).toPromise();
        } catch (error) {
            console.error('Error during CEO submission:', error);
        }
    }

    private createSocialPerformanceRecord(): SocialPerformanceRecordDTO {
        const records = this.socialPerformanceRecordData.map((record) =>
            SocialPerformanceRecordDTO.createSpecifiedRecord(
                parseInt(record.targetValue) || 0,
                parseInt(record.actualValue) || 0,
                parseInt(record.bonus) || 0
            )
        );

        return SocialPerformanceRecordDTO.fromJSON({
            specifiedRecords: {
                leadershipCompetence: records[0],
                opennessToEmployee: records[1],
                socialBehaviorToEmployee: records[2],
                attitudeToClients: records[3],
                communicationSkills: records[4],
                integrityToCompany: records[5]
            },
            totalBonus: 0
        });
    }

    private createOrderEvaluation(): OrderEvaluationDTO {
        const orders = this.orderEvaluationData.map((order) =>
            OrderEvaluationDTO.createOrder(
                order.number,
                order.name,
                order.client_ranking,
                parseInt(order.items) || 0,
                parseInt(order.bonus) || 0
            )
        );

        return OrderEvaluationDTO.fromJSON({ orders, totalBonus: 0 });
    }

    async onSubmitHR(): Promise<void> {
        console.log('onSubmitHr');
        // TODO: call evaluationService.updateEvaluation with modified EvaluationDTO
    }

    async onSubmitSalesman(): Promise<void> {
        console.log('onSubmitSalesman');
        // TODO: call evaluationService.updateEvaluation with modified EvaluationDTO(Only approvalStatus allowed to be changed)
    }
}
