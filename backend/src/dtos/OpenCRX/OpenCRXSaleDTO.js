class OpenCRXSaleDTO {
    constructor(href, salesRep_href, totalAmountIncludingTax, name, customer_href, activeOn, contractNumber, priority) {
        this.href = href;
        this.salesRep_href = salesRep_href;
        this.totalAmountIncludingTax = totalAmountIncludingTax;
        this.name = name;
        this.customer_href = customer_href;
        this.activeOn = activeOn;
        this.contractNumber = contractNumber;
        this.priority = priority;
        this.orders = []; // List of OpenCRXOrderDTOs
        this.customer = null; // OpenCRXCustomerDTO
    }

    static fromJSON(salesOrder = {}) {
        return new OpenCRXSaleDTO(
            salesOrder['@href'] || '',
            salesOrder['salesRep']['@href'] || '',
            salesOrder['totalAmountIncludingTax'] || '',
            salesOrder['name'] || '',
            salesOrder['customer']['@href'] || '',
            salesOrder['activeOn'] || '',
            salesOrder['contractNumber'] || '',
            salesOrder['priority'] || '',

        );
    }

    toJSON() {
        return {
            name: this.name || '',
            activeOn: this.activeOn || '',
            contractNumber: this.contractNumber || '',
            priority: this.priority || '',
            totalAmountIncludingTax: this.totalAmountIncludingTax || '',
            customer: this.customer.toJSON() || '',
            orders: this.orders.map(order => order.toJSON()) || '',
        }
    }
}

module.exports = OpenCRXSaleDTO;
