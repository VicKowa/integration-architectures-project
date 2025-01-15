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

    userRole: string;
    salesman: SalesmanDTO;
    evaluation: EvaluationDTO;

    orderEvaluationData: Array<{
        name: string,
        number: string,
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
        this.salesman = new SalesmanDTO('Unknown','Unknown','Unknown','Unknown');
    }

    async ngOnInit(): Promise<void> {
        this.salesman = await this.salesmanService.getSalesmen(this.sid).toPromise();
        this.userRole = await this.apiService.getCurrentRole().toPromise();

        this.fetchOrderEvaluationData();

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

    fetchOrderEvaluationData(): void {
        if (!this.sid) return;

        this.apiService.getSalesOrders(this.sid).subscribe({
            next: (sales: OpenCRXSaleDTO[]) => {
                sales.forEach((sale) => {
                    sale.orders.forEach((order) => {
                        this.orderEvaluationData.push({
                            name: order.crx_product?.name || '',
                            number: order.crx_product?.productNumber || '',
                            client_ranking: sale.priority || '',
                            items: order.quantity || '',
                            bonus: '',
                            comments: ''
                        });
                    });
                });

                this.orderEvaluationData = [...this.orderEvaluationData];
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

            await this.evaluationService.createEvaluation(this.evaluation).toPromise();
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
        // TODO: call evaluationService.updateEvaluation with modified EvaluationDTO
    }

    async onSubmitSalesman(): Promise<void> {
        // TODO: call evaluationService.updateEvaluation with modified EvaluationDTO(Only approvalStatus allowed to be changed)
    }
}
