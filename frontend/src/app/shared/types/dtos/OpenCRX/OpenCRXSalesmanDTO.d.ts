
declare class OpenCRXSalesmanDTO {
    /**
     * Creates an OpenCRXSalesmanDTO instance from a JSON object.
     * @param {Object} account - The JSON object representing the salesman
     * @returns {OpenCRXSalesmanDTO} A new OpenCRXSalesmanDTO instance.
     */
    static fromJSON(account?: any): OpenCRXSalesmanDTO;
    /**
     * Constructor for OpenCRXSalesmanDTO
     * @param {string} href - The reference URL of the salesman.
     * @param {string} governmentId - The government ID of the salesman.
     */
    constructor(href: string, governmentId: string);
    href: string;
    govermentId: string;
}

export default OpenCRXSalesmanDTO;
