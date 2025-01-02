import OrderEvaluationDTO from "@shared/types/dtos/OrderEvaluationDTO";

export = OrderEvaluation;
declare class OrderEvaluation {
    /**
     * Create a new OrderEvaluation
     * @param {OrderEvaluationDTO} orderEvaluationDTO - The order evaluation data transfer object
     */
    constructor(orderEvaluationDTO: OrderEvaluationDTO);
    totalBonus: any;
    orders: any;
}
