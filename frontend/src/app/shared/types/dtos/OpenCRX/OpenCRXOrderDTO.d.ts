export = OpenCRXOrderDTO;
/**
 * Represents an OpenCRX Order DTO (Data Transfer Object).
 */
declare class OpenCRXOrderDTO {
    /**
     * Creates an OpenCRXOrderDTO instance from a JSON object.
     * @param {Object} position - The JSON object representing the order.
     * @returns {OpenCRXOrderDTO} A new OpenCRXOrderDTO instance.
     * @throws {Error} Throws an error if the input object is invalid.
     */
    static fromJSON(position?: any): OpenCRXOrderDTO;
    /**
     * Creates a new OpenCRXOrderDTO instance.
     * @param {string} href - The reference URL of the order.
     * @param {string} amount - The total amount of the order.
     * @param {string} quantity - The quantity of the product ordered.
     * @param {string} product_href - The reference URL of the product.
     * @param {string} pricePerUnit - The price per unit of the product.
     * @param {string} amountWithTax - The total amount including tax.
     */
    constructor(href: string, amount: string, quantity: string, product_href: string, pricePerUnit: string, amountWithTax: string);
    href: string;
    amount: string;
    quantity: string;
    product_href: string;
    pricePerUnit: string;
    amountWithTax: string;
    product: any;
    /**
     * Converts the OpenCRXOrderDTO instance to a JSON object.
     * @returns {Object} A JSON representation of the OpenCRXOrderDTO.
     */
    toJSON(): any;
}
