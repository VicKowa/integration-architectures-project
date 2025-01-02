export class OrderDTO {

    /**
     * Create a new OrderDTO
     * @param {string} productNumber
     * @param {string} productName
     * @param {string} clientRanking
     * @param {number} items
     * @param {number} bonus
     */
    constructor(productNumber, productName, clientRanking, items, bonus) {
        this.productNumber = productNumber;
        this.productName = productName;
        this.clientRanking = clientRanking;
        this.items = items;
        this.bonus = bonus;
    }

    /**
     * Create a new OrderDTO from a JSON object
     * @param json - The JSON object representing a OpenCRXOrderDTO
     * @returns {OrderDTO}
     */
    fromJSON(json) {
        return new OrderDTO(
            json.product.productNumber || '',
            json.product.productName || '',
            json.clientRanking || '',
            json.quantity || 0,
            json.bonus || 0
        );
    }
}