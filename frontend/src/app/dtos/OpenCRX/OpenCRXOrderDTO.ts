import OpenCRXProductDTO from './OpenCRXProductDTO';

class OpenCRXOrderDTO {
    href: string;
    amount: string;
    quantity: string;
    product_href: string;
    pricePerUnit: string;
    amountWithTax: string;
    crx_product: OpenCRXProductDTO | null;

    constructor(
        href: string,
        amount: string,
        quantity: string,
        product_href: string,
        pricePerUnit: string,
        amountWithTax: string,
        crx_product: OpenCRXProductDTO | null = null
    ) {
        this.href = href;
        this.amount = amount;
        this.quantity = quantity;
        this.product_href = product_href;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
        this.crx_product = crx_product;
    }

    static fromJSON(position: Partial<OpenCRXOrderDTO> = {}): OpenCRXOrderDTO {
        const product: OpenCRXProductDTO = OpenCRXProductDTO.fromJSON(position.crx_product);

        return new OpenCRXOrderDTO(
            position.href || '',
            position.amount || '',
            position.quantity || '',
            position.product_href || '',
            position.pricePerUnit || '',
            position.amountWithTax || '',
            product
        );
    }

    toJSON(): {
        crx_product: { name: string; productNumber: string } | string;
        amount: string;
        quantity: string;
        pricePerUnit: string;
        amountWithTax: string;
        } {
        return {
            crx_product: this.crx_product?.toJSON() || '',
            amount: this.amount || '',
            quantity: this.quantity || '',
            pricePerUnit: this.pricePerUnit || '',
            amountWithTax: this.amountWithTax || '',
        };
    }
}

export default OpenCRXOrderDTO;
