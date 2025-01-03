class OpenCRXCustomerDTO {
    /**
     * Create a new OpenCRXCustomerDTO object
     * @param {string} href - The reference URL of the customer.
     * @param {string} name - The name
     * @param {string} accountRating - The account rating
     */
    constructor(href, name, accountRating) {
        this.href = href;
        this.name = name;
        this.accountRating = accountRating;

    }

    /**
     * Creates an OpenCRXCustomerDTO instance from a JSON object.
     * @param {Partial<OpenCRXCustomerDTO>} customer - The JSON object representing the customer.
     * @returns {OpenCRXCustomerDTO} A new OpenCRXCustomerDTO instance.
     */
    static fromJSON(customer = {}) {
        if (!customer || typeof customer !== 'object') {
            throw new Error("Invalid customer object");
        }

        return new OpenCRXCustomerDTO(
            customer['@href'] || '',
            customer['name'] || '',
            customer['accountRating'] || ''
        );
    }

    /**
     * Converts the OpenCRXCustomerDTO instance to a JSON object.
     * @returns {{name: string; accountRating: string}} A JSON representation of the OpenCRXCustomerDTO.
     */
    toJSON() {
        return {
            name: this.name || '',
            accountRating: this.accountRating || ''
        };
    }
}

module.exports = OpenCRXCustomerDTO;