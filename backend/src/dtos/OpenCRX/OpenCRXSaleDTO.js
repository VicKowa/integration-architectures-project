class OpenCRXSaleDTO {

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
    constructor(href, salesRep_href, totalAmountIncludingTax, name, customer_href, activeOn, contractNumber, priority) {
        this.href = href;
        this.salesRep_href = salesRep_href;
        this.totalAmountIncludingTax = totalAmountIncludingTax;
        this.name = name;
        this.customer_href = customer_href;
        this.activeOn = activeOn;
        this.contractNumber = contractNumber;
        this.priority = priority;
        /* @type {OpenCRXOrderDTO[]} */
        this.orders = []; // List of OpenCRXOrderDTOs
        /* @type {OpenCRXCustomerDTO} */
        this.customer = null; // OpenCRXCustomerDTO
    }

    /**
     * Creates an OpenCRXSaleDTO instance from a JSON object.
     * @param {Partial<OpenCRXSaleDTO>} salesOrder - The JSON object representing the sales order.
     * @returns {OpenCRXSaleDTO} A new OpenCRXSaleDTO instance.
     */
    static fromJSON(salesOrder = {}) {
        if (!salesOrder || typeof salesOrder !== 'object') {
            throw new Error("Invalid salesOrder object");
        }

        return new OpenCRXSaleDTO(
            salesOrder['@href'] || '',
            salesOrder?.salesRep?.['@href'] || '',
            salesOrder['totalAmountIncludingTax'] || '',
            salesOrder['name'] || '',
            salesOrder?.customer?.['@href'] || '',
            salesOrder['activeOn'] || '',
            salesOrder['contractNumber'] || '',
            salesOrder['priority'] || ''
        );
    }

    /**
     * Converts the OpenCRXSaleDTO instance to a JSON object.
     * @returns {{name: string, contractNumber: string, orders: [{OpenCRXOrderDTO}], priority: string, totalAmountIncludingTax: string, activeOn: string, customer: {OpenCRXCustomerDTO}}}
     */
    toJSON() {
        return {
            name: this.name || '',
            activeOn: this.activeOn || '',
            contractNumber: this.contractNumber || '',
            priority: this.priority || '',
            totalAmountIncludingTax: this.totalAmountIncludingTax || '',
            customer: this.customer ? this.customer.toJSON() : '',
            orders: Array.isArray(this.orders) ? this.orders.map(order => order.toJSON()) : [],
        };
    }
}

module.exports = OpenCRXSaleDTO;
