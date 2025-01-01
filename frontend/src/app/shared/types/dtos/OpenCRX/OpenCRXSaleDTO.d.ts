export = OpenCRXSaleDTO;
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
     * @param {number} priority
     */
    constructor(href: string, salesRep_href: string, totalAmountIncludingTax: string, name: string, customer_href: string, activeOn: string, contractNumber: string, priority: number);
    href: string;
    salesRep_href: string;
    totalAmountIncludingTax: string;
    name: string;
    customer_href: string;
    activeOn: string;
    contractNumber: string;
    priority: number;
    orders: any[];
    customer: any;
    /**
     *
     * @returns {Object} A JSON representation of the OpenCRXSaleDTO.
     */
    toJSON(): any;
}
