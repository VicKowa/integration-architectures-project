class OrderEvaluation {
    /**
     * Create a new OrderEvaluation
     * @param {OrderEvaluationDTO} orderEvaluationDTO - The order evaluation data transfer object
     */
    constructor(orderEvaluationDTO) {
        this.totalBonus = orderEvaluationDTO.totalBonus || 0;
        this.orders = orderEvaluationDTO.orders || [];
    }
}

module.exports = OrderEvaluation;