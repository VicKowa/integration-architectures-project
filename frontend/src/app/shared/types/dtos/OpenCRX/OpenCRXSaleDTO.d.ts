declare class OpenCRXSaleDTO {
    /**
     * Creates an OpenCRXSaleDTO instance from a JSON object.
     * @param {Object} salesOrder - The JSON object representing the sales order.
     * @returns {OpenCRXSaleDTO} A new OpenCRXSaleDTO instance.
     */
    static fromJSON(salesOrder?: any): OpenCRXSaleDTO;
    /**
     * Create a new OpenCRXSaleDTO
     * @param {string} href
     * @param {string} salesRep_href
     * @param {string} totalAmountIncludingTax
     * @param {string} name
     * @param {string} customer_href
     * @param {string} activeOn
     * @param {string} contractNumber
     * @param {string} priority
     */
    constructor(href: string, salesRep_href: string, totalAmountIncludingTax: string, name: string, customer_href: string, activeOn: string, contractNumber: string, priority: string);
    href: string;
    salesRep_href: string;
    totalAmountIncludingTax: string;
    name: string;
    customer_href: string;
    activeOn: string;
    contractNumber: string;
    priority: string;
    orders: any[];
    customer: any;
    /**
     * Converts the OpenCRXSaleDTO instance to a JSON object.
     * @returns {{name: string, contractNumber: string, orders: [{OpenCRXOrderDTO}], priority: string, totalAmountIncludingTax: string, activeOn: string, customer: {OpenCRXCustomerDTO}}}
     */
    toJSON(): {
        name: string;
        activeOn: string;
        contractNumber: string;
        priority: string;
        totalAmountIncludingTax: string;
        customer: { name: string; accountRating: string } | string;
        orders: {
            crx_product: { name: string; productNumber: string } | string;
            amount: string;
            quantity: string;
            pricePerUnit: string;
            amountWithTax: string;
        }[];
    }
}

export default OpenCRXSaleDTO;
