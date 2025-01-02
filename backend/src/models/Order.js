export default class Order {

    /**
     * Create a new Order
     * @param {OrderDTO} orderDTO - The order data transfer object
     */
    constructor(orderDTO) {
        this.productNumber = orderDTO.productNumber;
        this.productName = orderDTO.productName;
        this.clientRanking = orderDTO.clientRanking;
        this.items = orderDTO.items;
        this.bonus = orderDTO.bonus;
    }
}