export interface Order {
    productNumber: string;
    productName: string;
    clientRanking: string;
    items: number;
    bonus: number;
}

export class OrderEvaluationDTO {
    totalBonus: number;
    orders: Order[];

    /**
     * Create a new OrderEvaluation
     * @param {number} totalBonus Result of all order bonuses
     * @param {Order[]} orders List of orders
     */
    constructor(totalBonus: number, orders: Order[]) {
        this.totalBonus = totalBonus;
        this.orders = this.ensureOrders(orders);
    }

    /**
     * Calculate the total bonus
     */
    calculateTotalBonus(): void {
        this.totalBonus = this.orders.reduce((acc, order) => acc + order.bonus, 0);
    }

    /**
     * Ensure that orders have valid non-negative items
     * @param {Order[]} orders
     * @returns {Order[]} orders with valid items
     */
    private ensureOrders(orders: Order[]): Order[] {
        const defaultOrder: Order = {
            productNumber: '',
            productName: '',
            clientRanking: '',
            items: 0,
            bonus: 0,
        };
        const defaultItems = 0;
        return orders.map(order => {
            // Merge default order with order
            const validOrder = { ...defaultOrder, ...order };

            // Check if order items is less than 0
            if (validOrder.items < 0) {
                validOrder.items = defaultItems;
            }

            return validOrder;
        });
    }

    /**
     * Convert a JSON object to a OrderEvaluationDTO object
     * @param {Partial<OrderEvaluationDTO>} json - JSON object
     * @returns {OrderEvaluationDTO} OrderEvaluationDTO object
     */
    static fromJSON(json: Partial<OrderEvaluationDTO>): OrderEvaluationDTO {
        return new OrderEvaluationDTO(
            json.totalBonus || 0,
            json.orders || []
        );
    }
}
