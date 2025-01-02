
class OrderEvaluationDTO {
    /**
     * Create a new OrderEvaluation
     * @param {number} totalBonus Result of all order bonuses
     * @param {[{ productNumber: string;
     *             productName: string;
     *             clientRanking: string;
     *             items: number;
     *             bonus: string}]} orders List of orders
     */
    constructor(totalBonus, orders) {
        this.totalBonus = totalBonus;
        this.orders = this.#ensureOrders(orders);
    }

    /**
     * Calculate the total bonus
     */
    calculateTotalBonus() {
        this.totalBonus = this.orders.reduce((acc, order) => acc + order.bonus, 0);
    }

    /**
     * ensure that orders have valid no negative items
     * @param {{productNumber: string, productName: string, clientRanking: string, items: number, bonus: string}[]} orders
     * @returns {{productNumber: string, productName: string, clientRanking: string, items: number, bonus: string}[]} orders
     */
    #ensureOrders(orders) {

        const defaultOrder = {
            productNumber: '',
            productName: '',
            clientRanking: '',
            items: 0,
            bonus: 0,
        }
        const defaultItems = 0;
        return orders.map(order => {
            // Merge default order with order
            const validOrder = Object.assign({}, defaultOrder, order);

            // check if order items is less than 0
            if(validOrder.items < 0) {
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
    static fromJSON(json) {
        this.totalBonus = json.totalBonus;
        this.orders = json.orders;
    }
}

module.exports = OrderEvaluationDTO;