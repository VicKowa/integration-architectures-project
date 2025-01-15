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
     *
     * @param totalBonus - Result of all order bonuses
     * @param orders - List of orders
     */
    constructor(totalBonus: number, orders: Order[]) {
        this.totalBonus = totalBonus;
        this.orders = this.ensureOrders(orders);
    }

    /**
     * Calculate the total bonus
     */
    calculateTotalBonus(): void {
        this.totalBonus = this.orders.reduce((acc: number, order: Order): number => acc + order.bonus, 0);
    }

    /**
     * Ensure that orders have valid non-negative items
     *
     * @param orders - List of orders
     * @returns orders with valid items
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
        return orders.map((order: Order): Order => {
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
     *
     * @param json - JSON object
     * @returns OrderEvaluationDTO object
     */
    static fromJSON(json: Partial<OrderEvaluationDTO>): OrderEvaluationDTO {
        return new OrderEvaluationDTO(
            json.totalBonus || 0,
            json.orders || []
        );
    }
}
