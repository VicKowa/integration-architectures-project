import Order from "./Order";

export default class OrderEvaluation {
    /**
     * Create a new OrderEvaluation
     * @param {number} totalBonus Result of all order bonuses
     * @param {Order[]} orders List of orders
     */
    constructor(totalBonus, orders) {
        this.totalBonus = totalBonus;
        this.orders = orders;
    }

    /**
     *
     * @param {OrderDTO} orderDTO
     */
    addOrder(orderDTO) {
        this.orders.push(new Order(orderDTO));
    }

}