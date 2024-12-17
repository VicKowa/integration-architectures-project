import OpenCRXProductDTO from "./OpenCRXProductDTO";

class OpenCRXOrderDTO {
    href: string;
    amount: string;
    quantity: string;
    product_href: string;
    pricePerUnit: string;
    amountWithTax: string;
    product: OpenCRXProductDTO | null;

    constructor(
        href: string,
        amount: string,
        quantity: string,
        product_href: string,
        pricePerUnit: string,
        amountWithTax: string
    ) {
        this.href = href;
        this.amount = amount;
        this.quantity = quantity;
        this.product_href = product_href;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
        this.product = null; // OpenCRXProductDTO
    }

    static fromJSON(position: Partial<OpenCRXOrderDTO> = {}): OpenCRXOrderDTO {
        return new OpenCRXOrderDTO(
            position['@href'] || '',
            position['amount'] || '',
            position['quantity'] || '',
            position['product']?.['@href'] || '',
            position['pricePerUnit'] || '',
            position['amount'] || ''
        );
    }

    toJSON(): {
        product: { name: string; productNumber: string } | string;
        amount: string;
        quantity: string;
        pricePerUnit: string;
        amountWithTax: string
    } {
        return {
            product: this.product?.toJSON() || '',
            amount: this.amount || '',
            quantity: this.quantity || '',
            pricePerUnit: this.pricePerUnit || '',
            amountWithTax: this.amountWithTax || '',
        };
    }
}

export default OpenCRXOrderDTO;
