/**
 * Represents an OpenCRX Order DTO (Data Transfer Object).
 */
class OpenCRXOrderDTO {
    /**
     * Creates a new OpenCRXOrderDTO instance.
     * @param {string} href - The reference URL of the order.
     * @param {string} amount - The total amount of the order.
     * @param {string} quantity - The quantity of the product ordered.
     * @param {string} product_href - The reference URL of the product.
     * @param {string} pricePerUnit - The price per unit of the product.
     * @param {string} amountWithTax - The total amount including tax.
     */
    constructor(href, amount, quantity, product_href, pricePerUnit, amountWithTax) {
        this.href = href;
        this.amount = amount;
        this.quantity = quantity;
        this.product_href = product_href;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
        /* @type {OpenCRXProductDTO} */
        this.product = null; // Placeholder for OpenCRXProductDTO
    }

    /**
     * Creates an OpenCRXOrderDTO instance from a JSON object.
     * @param {Partial<OpenCRXOrderDTO>} position - The JSON object representing the order.
     * @returns {OpenCRXOrderDTO} A new OpenCRXOrderDTO instance.
     * @throws {Error} Throws an error if the input object is invalid.
     */
    static fromJSON(position = {}) {
        if (!position || typeof position !== 'object') {
            throw new Error("Invalid position object");
        }

        return new OpenCRXOrderDTO(
            position['@href'] || '',
            position['amount'] || '',
            position['quantity'] || '',
            position['product']?.['@href'] || '',
            position['pricePerUnit'] || '',
            position['amount'] || ''
        );
    }

    /**
     * Converts the OpenCRXOrderDTO instance to a JSON object.
     * @returns {{product: string; amount: string; quantity: string; pricePerUnit: string; amountWithTax: string}} A JSON representation of the OpenCRXOrderDTO.
     */
    toJSON() {
        return {
            product: this.product ? this.product.toJSON() : '',
            amount: this.amount || '',
            quantity: this.quantity || '',
            pricePerUnit: this.pricePerUnit || '',
            amountWithTax: this.amountWithTax || '',
        };
    }
}


module.exports = OpenCRXOrderDTO;
