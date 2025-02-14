class OpenCRXSalesmanDTO {
    /**
     * Constructor for OpenCRXSalesmanDTO
     * @param {string} href - The reference URL of the salesman.
     * @param {string} governmentId - The government ID of the salesman.
     */
    constructor(href, governmentId) {
        this.href = href;
        this.governmentId = governmentId;
    }

    /**
     * Creates an OpenCRXSalesmanDTO instance from a JSON object.
     * @param {Partial<OpenCRXSalesmanDTO>} account - The JSON object representing the salesman
     * @returns {OpenCRXSalesmanDTO} A new OpenCRXSalesmanDTO instance.
     */
    static fromJSON(account = {}) {
        if (!account || typeof account !== 'object') {
            throw new Error("Invalid account object");
        }

        return new OpenCRXSalesmanDTO(
            account["@href"] || '',
            account["governmentId"] || ''
        );
    }
}

module.exports = OpenCRXSalesmanDTO;