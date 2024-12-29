import OpenCRXCustomerDTO from "./OpenCRXCustomerDTO";
import OpenCRXOrderDTO from "./OpenCRXOrderDTO";

class OpenCRXSaleDTO {
    href: string;
    salesRep_href: string;
    totalAmountIncludingTax: string;
    name: string;
    customer_href: string;
    activeOn: string;
    contractNumber: string;
    priority: string;
    orders: OpenCRXOrderDTO[]; // List of OpenCRXOrderDTOs
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
        this.orders = orders; // List of OpenCRXOrderDTOs
        this.customer = customer; // OpenCRXCustomerDTO
    }

    static fromJSON(salesOrder: Partial<OpenCRXSaleDTO> = {}): OpenCRXSaleDTO {
        // Erstelle die Liste der Bestellungen (orders), wenn Daten vorhanden sind
        const orders = (salesOrder.orders || []).map(order =>
            OpenCRXOrderDTO.fromJSON(order)
        );

        // Erstelle das Kundenobjekt (customer), wenn Daten vorhanden sind
        const customer = salesOrder.customer
            ? OpenCRXCustomerDTO.fromJSON(salesOrder.customer)
            : null;

        return new OpenCRXSaleDTO(
            salesOrder['href'] || '',
            salesOrder['salesRep']?.['href'] || '',
            salesOrder['totalAmountIncludingTax'] || '',
            salesOrder['name'] || '',
            salesOrder['customer']?.['href'] || '',
            salesOrder['activeOn'] || '',
            salesOrder['contractNumber'] || '',
            salesOrder['priority'] || '',
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
            product: { name: string; productNumber: string } | string;
            amount: string;
            quantity: string;
            pricePerUnit: string;
            amountWithTax: string
        }[]
    } {
        return {
            name: this.name || '',
            activeOn: this.activeOn || '',
            contractNumber: this.contractNumber || '',
            priority: this.priority || '',
            totalAmountIncludingTax: this.totalAmountIncludingTax || '',
            customer: this.customer?.toJSON() || '',
            orders: this.orders.map(order => order.toJSON()) || []
        };
    }
}

export default OpenCRXSaleDTO;
