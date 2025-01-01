class OpenCRXProductDTO {
    /**
     * Creates a new OpenCRXProductDTO instance.
     * @param {string} href
     * @param {string} name
     * @param {string} productNumber
     */
    constructor(href, name, productNumber) {
        this.href = href;
        this.name = name;
        this.productNumber = productNumber;
    }

    /**
     * Creates an OpenCRXProductDTO instance from a JSON object.
     * @param {Partial<OpenCRXProductDTO>} product - The JSON object representing the product.
     * @returns {OpenCRXProductDTO} A new OpenCRXProductDTO instance.
     */
    static fromJSON(product = {}) {
        if (!product || typeof product !== 'object') {
            throw new Error("Invalid product object");
        }

        return new OpenCRXProductDTO(
            product['@href'] || '',
            product['name'] || '',
            product['productNumber'] || ''
        );
    }

    /**
     * Converts the OpenCRXProductDTO instance to a JSON object.
     * @returns {{name: string; productNumber: string}} A JSON representation of the OpenCRXProductDTO.
     */
    toJSON() {
        return {
            name: this.name || '',
            productNumber: this.productNumber || '',
        };
    }

}

module.exports = OpenCRXProductDTO;


