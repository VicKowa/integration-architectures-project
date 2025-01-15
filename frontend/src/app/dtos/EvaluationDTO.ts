import { OrderEvaluationDTO } from './OrderEvaluationDTO';
import { SocialPerformanceRecordDTO } from './SocialPerformanceRecordDTO';

/* eslint-disable no-shadow */
export enum ApprovalEnum {
    NONE = 0,
    CEO = 1,
    HR = 2,
    SALESMAN = 3,
}
/* eslint-enable no-shadow */

export class EvaluationDTO {
    sid: string | null;
    year: string;
    department: string;
    orderEvaluation: OrderEvaluationDTO;
    socialPerformanceEvaluation: SocialPerformanceRecordDTO;
    totalBonus: number;
    approvalStatus: ApprovalEnum;

    /**
     * Create a new EvaluationDTO
     *
     * @param sid - The unique identifier of the evaluation
     * @param year - The year of the evaluation
     * @param department - The department of the evaluation
     * @param orderEvaluation - The order evaluation
     * @param socialPerformanceEvaluation - The social performance evaluation
     * @param approvalStatus - The approval status of the evaluation
     */
    constructor(
        sid: string,
        year: string,
        department: string,
        orderEvaluation: OrderEvaluationDTO,
        socialPerformanceEvaluation: SocialPerformanceRecordDTO,
        approvalStatus: ApprovalEnum
    ) {
        this.sid = sid || null;
        this.year = year;
        this.department = department;
        this.orderEvaluation = orderEvaluation || null;
        this.socialPerformanceEvaluation = socialPerformanceEvaluation || null;
        this.totalBonus = 0;
        this.approvalStatus = approvalStatus || ApprovalEnum.NONE;
    }

    /**
     * Calculate the total bonus
     *
     * @returns totalBonus of order and social performance evaluation
     */
    calculateTotalBonus(): void {
        if (this.orderEvaluation == null || this.socialPerformanceEvaluation == null) {
            throw new Error('OrderEvaluation or SocialPerformanceEvaluation is missing');
        }

        this.totalBonus =
            // Sum of all order evaluation bonuses
            this.orderEvaluation.totalBonus
            +
            // Sum of all social performance evaluation bonuses
            this.socialPerformanceEvaluation.totalBonus
        ;
    }

    /**
     * Convert a JSON object to a EvaluationDTO object
     *
     * @param json - JSON object
     * @returns EvaluationDTO object
     */
    static fromJSON(json: Partial<EvaluationDTO>): EvaluationDTO {
        return new EvaluationDTO(
            json.sid || '',
            json.year || '',
            json.department || '',
            OrderEvaluationDTO.fromJSON(json.orderEvaluation) || null,
            SocialPerformanceRecordDTO.fromJSON(json.socialPerformanceEvaluation) || null,
            json.approvalStatus || ApprovalEnum.NONE
        );
    }
}
