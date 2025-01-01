export = OpenCRXCustomerDTO;
declare class OpenCRXCustomerDTO {
    /**
     * Creates an OpenCRXCustomerDTO instance from a JSON object.
     * @param {Object} customer - The JSON object representing the customer.
     * @returns {OpenCRXCustomerDTO} A new OpenCRXCustomerDTO instance.
     */
    static fromJSON(customer?: any): OpenCRXCustomerDTO;
    /**
     * Create a new OpenCRXCustomerDTO object
     * @param {string} href - The reference URL of the customer.
     * @param {string} name - The name
     * @param {string} accountRating - The account rating
     */
    constructor(href: string, name: string, accountRating: string);
    href: string;
    name: string;
    accountRating: string;
    /**
     * Converts the OpenCRXCustomerDTO instance to a JSON object.
     * @returns {Object} A JSON representation of the OpenCRXCustomerDTO.
     */
    toJSON(): any;
}
