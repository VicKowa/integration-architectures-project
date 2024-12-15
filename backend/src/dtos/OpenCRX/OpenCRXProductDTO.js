class OpenCRXProductDTO {
    constructor(href, name, productNumber) {
        this.href = href;
        this.name = name;
        this.productNumber = productNumber;
    }

    static fromJSON(product = {}) {
        return new OpenCRXProductDTO(
            product['@href'] || '',
            product['name'] || '',
            product['productNumber'] || ''
        );
    }

    toJSON() {
        return {
            name: this.name || '',
            productNumber: this.productNumber || '',
        }
    }

}

module.exports = OpenCRXProductDTO;


