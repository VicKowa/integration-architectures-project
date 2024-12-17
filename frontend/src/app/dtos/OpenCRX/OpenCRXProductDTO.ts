class OpenCRXProductDTO {
    href: string;
    name: string;
    productNumber: string;

    constructor(href: string, name: string, productNumber: string) {
        this.href = href;
        this.name = name;
        this.productNumber = productNumber;
    }

    static fromJSON(product: Partial<OpenCRXProductDTO> = {}): OpenCRXProductDTO {
        return new OpenCRXProductDTO(
            product['@href'] || '',
            product['name'] || '',
            product['productNumber'] || ''
        );
    }

    toJSON(): { name: string; productNumber: string } {
        return {
            name: this.name || '',
            productNumber: this.productNumber || '',
        };
    }
}

export default OpenCRXProductDTO;
