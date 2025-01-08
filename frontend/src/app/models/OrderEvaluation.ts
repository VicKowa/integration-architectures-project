import {Order, OrderEvaluationDTO} from '../dtos/OrderEvaluationDTO';

export class OrderEvaluation {
    totalBonus: number;
    orders: Order[];

    /**
     * Create a new OrderEvaluation
     *
     * @param orderEvaluationDTO - The order evaluation data transfer object
     */
    constructor(orderEvaluationDTO: OrderEvaluationDTO) {
        this.totalBonus = orderEvaluationDTO.totalBonus || 0;
        this.orders = orderEvaluationDTO.orders || [];
    }
}
