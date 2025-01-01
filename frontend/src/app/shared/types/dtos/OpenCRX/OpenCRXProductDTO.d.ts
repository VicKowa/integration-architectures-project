declare class OpenCRXProductDTO {
    /**
     * Creates an OpenCRXProductDTO instance from a JSON object.
     * @param {Object} product - The JSON object representing the product.
     * @returns {OpenCRXProductDTO} A new OpenCRXProductDTO instance.
     */
    static fromJSON(product?: any): OpenCRXProductDTO;
    /**
     * Creates a new OpenCRXProductDTO instance.
     * @param {string} href
     * @param {string} name
     * @param {string} productNumber
     */
    constructor(href: string, name: string, productNumber: string);
    href: string;
    name: string;
    productNumber: string;
    /**
     * Converts the OpenCRXProductDTO instance to a JSON object.
     * @returns {Object} A JSON representation of the OpenCRXProductDTO.
     */
    toJSON(): any;
}

export default OpenCRXProductDTO;
