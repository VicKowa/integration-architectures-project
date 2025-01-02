declare class OrderEvaluationDTO {
    /**
     * Convert a JSON object to a OrderEvaluationDTO object
     * @param {Partial<OrderEvaluationDTO>} json - JSON object
     * @returns {OrderEvaluationDTO} OrderEvaluationDTO object
     */
    static fromJSON(json: Partial<OrderEvaluationDTO>): OrderEvaluationDTO;
    /**
     * Create a new OrderEvaluation
     * @param {number} totalBonus Result of all order bonuses
     * @param {[{ productNumber: string;
     *             productName: string;
     *             clientRanking: string;
     *             items: number;
     *             bonus: string}]} orders List of orders
     */
    constructor(totalBonus: number, orders: [
        {
            productNumber: string;
            productName: string;
            clientRanking: string;
            items: number;
            bonus: string;
        }
    ]);
    totalBonus: number;
    orders: {
        productNumber: string;
        productName: string;
        clientRanking: string;
        items: number;
        bonus: string;
    }[];
    /**
     * Calculate the total bonus
     */
    calculateTotalBonus(): void;
    #private;
}


export default OrderEvaluationDTO;
