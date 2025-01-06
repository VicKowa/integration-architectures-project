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
     * @param totalBonus
     */

    constructor(sid, year, department, orderEvaluation, socialPerformanceEvaluation, approvalStatus, totalBonus) {
        this.sid = sid || null;
        this.year = year;
        this.department = department;
        this.orderEvaluation = [] || orderEvaluation;
        this.socialPerformanceEvaluation = [] || socialPerformanceEvaluation;
        this.approvalStatus = approvalStatus || approvalEnum.NONE;
        this.totalBonus = totalBonus;
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
        return new EvaluationDTO(
            json.sid,
            json.year,
            json.department,
            OrderEvaluationDTO.fromJSON(json.orderEvaluation),
            SocialPerformanceRecordDTO.fromJSON(json.socialPerformanceEvaluation),
            json.approvalStatus,
            json.totalBonus,
        );
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