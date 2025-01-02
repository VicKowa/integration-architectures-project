import OpenCRXCustomerDTO from './OpenCRXCustomerDTO';
import OpenCRXOrderDTO from './OpenCRXOrderDTO';

class OpenCRXSaleDTO {
    href: string;
    salesRep_href: string;
    totalAmountIncludingTax: string;
    name: string;
    customer_href: string;
    activeOn: string;
    contractNumber: string;
    priority: string;
    orders: OpenCRXOrderDTO[];
    customer: OpenCRXCustomerDTO | null;

    constructor(
        href: string,
        salesRep_href: string,
        totalAmountIncludingTax: string,
        name: string,
        customer_href: string,
        activeOn: string,
        contractNumber: string,
        priority: string,
        orders: OpenCRXOrderDTO[] = [],
        customer: OpenCRXCustomerDTO | null = null
    ) {
        this.href = href;
        this.salesRep_href = salesRep_href;
        this.totalAmountIncludingTax = totalAmountIncludingTax;
        this.name = name;
        this.customer_href = customer_href;
        this.activeOn = activeOn;
        this.contractNumber = contractNumber;
        this.priority = priority;
        this.orders = orders;
        this.customer = customer;
    }

    static fromJSON(salesOrder: Partial<OpenCRXSaleDTO> = {}): OpenCRXSaleDTO {
        const orders: OpenCRXOrderDTO[] = (salesOrder.orders || []).map((order: Partial<OpenCRXOrderDTO>): OpenCRXOrderDTO =>
            OpenCRXOrderDTO.fromJSON(order)
        );

        const customer = salesOrder.customer
            ? OpenCRXCustomerDTO.fromJSON(salesOrder.customer)
            : null;

        return new OpenCRXSaleDTO(
            salesOrder.href || '',
            salesOrder.salesRep_href || '',
            salesOrder.totalAmountIncludingTax || '',
            salesOrder.name || '',
            salesOrder.customer?.href || '',
            salesOrder.activeOn || '',
            salesOrder.contractNumber || '',
            salesOrder.priority || '',
            orders,
            customer
        );
    }

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
        } {
        return {
            name: this.name || '',
            activeOn: this.activeOn || '',
            contractNumber: this.contractNumber || '',
            priority: this.priority || '',
            totalAmountIncludingTax: this.totalAmountIncludingTax || '',
            customer: this.customer?.toJSON() || '',
            orders: this.orders.map((order: OpenCRXOrderDTO): {
                crx_product: { name: string; productNumber: string } | string;
                amount: string;
                quantity: string;
                pricePerUnit: string;
                amountWithTax: string;
            } => order.toJSON()) || []
        };
    }
}

export default OpenCRXSaleDTO;
