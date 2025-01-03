import { OrderEvaluationDTO } from './OrderEvaluationDTO';
import { SocialPerformanceRecordDTO } from './SocialPerformanceRecordDTO';

export enum ApprovalEnum {
    NONE = 'NONE',
    CEO = 'CEO',
    HR = 'HR',
    SALESMAN = 'SALESMAN',
}

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
     * @param {string} sid
     * @param {string} year
     * @param {string} department
     * @param {OrderEvaluationDTO} orderEvaluation
     * @param {SocialPerformanceRecordDTO} socialPerformanceEvaluation
     * @param {ApprovalEnum} approvalStatus
     */
    constructor(
        sid: string,
        year: string,
        department: string,
        orderEvaluation: "" | OrderEvaluationDTO,
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
     * @returns {number} totalBonus of order and social performance evaluation
     * @throws {Error} if OrderEvaluation or SocialPerformanceEvaluation is missing
     */
    calculateTotalBonus(): void {
        if (this.orderEvaluation == null || this.socialPerformanceEvaluation == null) {
            throw new Error("OrderEvaluation or SocialPerformanceEvaluation is missing");
        }
        this.totalBonus = this.orderEvaluation.totalBonus + this.socialPerformanceEvaluation.totalBonus;
    }

    /**
     * Convert a JSON object to a EvaluationDTO object
     * @param {Partial<EvaluationDTO>} json
     * @returns {EvaluationDTO} EvaluationDTO object
     */
    static fromJSON(json: Partial<EvaluationDTO>): EvaluationDTO {
        return new EvaluationDTO(
            json.sid || '',
            json.year || '',
            json.department || '',
            json.orderEvaluation = OrderEvaluationDTO.fromJSON(json.orderEvaluation) || null,
            json.socialPerformanceEvaluation = SocialPerformanceRecordDTO.fromJSON(json.socialPerformanceEvaluation) || null,
            json.approvalStatus || ApprovalEnum.NONE
        );
    }
}
