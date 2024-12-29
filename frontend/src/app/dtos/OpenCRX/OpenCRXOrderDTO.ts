import OpenCRXProductDTO from "./OpenCRXProductDTO";

class OpenCRXOrderDTO {
    href: string;
    amount: string;
    quantity: string;
    product_href: string;
    pricePerUnit: string;
    amountWithTax: string;
    product_: OpenCRXProductDTO | null;

    constructor(
        href: string,
        amount: string,
        quantity: string,
        product_href: string,
        pricePerUnit: string,
        amountWithTax: string,
        product: OpenCRXProductDTO | null = null
    ) {
        this.href = href;
        this.amount = amount;
        this.quantity = quantity;
        this.product_href = product_href;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
        this.product_ = product;
    }

    static fromJSON(position: Partial<OpenCRXOrderDTO> = {}): OpenCRXOrderDTO {
        // @ts-ignore
        const product = OpenCRXProductDTO.fromJSON(position.product);

        return new OpenCRXOrderDTO(
            position['href'] || '',
            position['amount'] || '',
            position['quantity'] || '',
            position['product_href'] || '',
            position['pricePerUnit'] || '',
            position['amountWithTax'] || '',
            product
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
            product: this.product_?.toJSON() || '',
            amount: this.amount || '',
            quantity: this.quantity || '',
            pricePerUnit: this.pricePerUnit || '',
            amountWithTax: this.amountWithTax || '',
        };
    }
}

export default OpenCRXOrderDTO;
