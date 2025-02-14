const OrderEvaluationDTO = require('./OrderEvaluationDTO');

class EvaluationDTO {
    /**
     * Create a new EvaluationDTO
     *
     * @param {string} sid
     * @param {string} year
     * @param {string} department
     * @param {OrderEvaluationDTO}orderEvaluation
     * @param {SocialPerformanceRecordDTO} socialPerformanceEvaluation
     * @param approvalStatus
     * @param comment
     */

    constructor(sid,
                year,
                department,
                orderEvaluation,
                socialPerformanceEvaluation,
                approvalStatus,
                comment) {
        this.approvalStatus = approvalStatus || approvalEnum.NONE;
        this.orderEvaluation = orderEvaluation || null;
        this.socialPerformanceEvaluation = socialPerformanceEvaluation || null;
        this.totalBonus = this.calculateTotalBonus() || 0;
        this.year = year;
        this.department = department;
        this.sid = sid || null;
        this.comment = comment || '';
    }

    /**
     * Calculate the total bonus
     *
     * @returns {number} totalBonus of order and social performance evaluation
     * @throws {Error} if OrderEvaluation or SocialPerformanceEvaluation is missing
     */
    calculateTotalBonus() {
        if (this.orderEvaluation == null || this.socialPerformanceEvaluation == null) {
            throw new Error("OrderEvaluation or SocialPerformanceEvaluation is missing");
        }

        return this.totalBonus =
            // Sum of all order evaluation bonuses
            this.orderEvaluation.totalBonus
        +
            // Sum of all social performance evaluation bonuses
            this.socialPerformanceEvaluation.totalBonus
        ;
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
              json.orderEvaluation,
              json.socialPerformanceEvaluation,
              json.approvalStatus,
              json.comment
       )
    }

    // TODO change
    /**
     *
     * @param salesOrders
     * @returns {*}
     */
    static fromOpenCRXSaleDTO(salesOrders) {
        const allOrders = salesOrders.flatMap(sale =>
            sale.orders.map(order => ({
                productNumber: order.crx_product?.productNumber || '',
                productName: order.crx_product?.name || '',
                clientRanking: sale.priority || '',
                items: EvaluationDTO.formatItems(order.quantity) || '0',
                bonus: 0, // Assuming bonus needs to be calculated later
                comment: '',
            }))
        );

        const totalBonus = allOrders.reduce((acc, order) => acc + order.bonus, 0);
        return new OrderEvaluationDTO(totalBonus, allOrders);
    }

    /**
     * Format the items to remove trailing zeros
     * @param {number} quantity
     * @returns {string} formatted quantity
     */
    static formatItems(quantity) {
        return parseFloat(quantity).toString();
    }
}

/**
 * Enum for approval status
 * @type {{SALESMAN: string, HR: string, NONE: string, CEO: string}}
 */
const approvalEnum = {
    NONE: 0,
    CEO: 1,
    HR: 2,
    SALESMAN: 3,
};

module.exports = EvaluationDTO;