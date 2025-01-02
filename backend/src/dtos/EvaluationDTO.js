const OrderEvaluationDTO = require('./OrderEvaluationDTO');
const SocialPerformanceRecordDTO = require('./SocialPerformanceRecordDTO');

class EvaluationDTO {

    /**
     * Create a new EvaluationDTO
     * @param {string} sid
     * @param {string} year
     * @param {string} department
     * @param {OrderEvaluationDTO}orderEvaluation
     * @param {SocialPerformanceRecordDTO} socialPerformanceEvaluation
     * @param approvalStatus
     */

    constructor(sid, year, department, orderEvaluation, socialPerformanceEvaluation, approvalStatus) {
        this.approvalStatus = approvalStatus || approvalEnum.NONE;
        this.orderEvaluation = [] || orderEvaluation;
        this.socialPerformanceEvaluation = [] || socialPerformanceEvaluation;
        this.totalBonus = 0;
        this.year = year;
        this.department = department;
        this.sid = sid || null;
    }

    /**
     * Calculate the total bonus
     * @returns {number} totalBonus of order and social performance evaluation
     * @throws {Error} if OrderEvaluation or SocialPerformanceEvaluation is missing
     */
    calculateTotalBonus() {
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
    static fromJSON(json) {
        this.sid = json.sid;
        this.year = json.year;
        this.department = json.department;
        this.orderEvaluation = OrderEvaluationDTO.fromJSON(json.orderEvaluation);
        this.socialPerformanceEvaluation = SocialPerformanceRecordDTO.fromJSON(json.socialPerformanceEvaluation);
        this.totalBonus = json.totalBonus;
        this.approvalStatus = json.approvalStatus;
    }
}

/**
 * Enum for approval status
 * @type {{SALESMAN: string, HR: string, NONE: string, CEO: string}}
 */
const approvalEnum = {
    NONE: 'NONE',
    CEO: 'CEO',
    HR: 'HR',
    SALESMAN: 'SALESMAN',
};

module.exports = EvaluationDTO;