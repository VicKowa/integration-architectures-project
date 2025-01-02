import OrderEvaluationDTO from './OrderEvaluationDTO';
import SocialPerformanceRecordDTO from './SocialPerformanceRecordDTO';

declare class EvaluationDTO {
    /**
     * Convert a JSON object to a EvaluationDTO object
     * @param {Partial<EvaluationDTO>} json
     * @returns {EvaluationDTO} EvaluationDTO object
     */
    static fromJSON(json: Partial<EvaluationDTO>): EvaluationDTO;
    /**
     * Create a new EvaluationDTO
     * @param {string} sid
     * @param {string} year
     * @param {string} department
     * @param {OrderEvaluationDTO}orderEvaluation
     * @param {SocialPerformanceRecordDTO} socialPerformanceEvaluation
     * @param approvalStatus
     */
    constructor(sid: string, year: string, department: string, orderEvaluation: OrderEvaluationDTO, socialPerformanceEvaluation: SocialPerformanceRecordDTO, approvalStatus: any);
    approvalStatus: any;
    orderEvaluation: any[] | OrderEvaluationDTO;
    socialPerformanceEvaluation: any[] | SocialPerformanceRecordDTO;
    totalBonus: number;
    year: string;
    department: string;
    sid: string;
    /**
     * Calculate the total bonus
     * @returns {number} totalBonus of order and social performance evaluation
     * @throws {Error} if OrderEvaluation or SocialPerformanceEvaluation is missing
     */
    calculateTotalBonus(): number;
}

export default EvaluationDTO;
