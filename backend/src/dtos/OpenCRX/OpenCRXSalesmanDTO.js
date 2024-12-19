class OpenCRXSalesmanDTO {
    constructor(href, governmentId) {
        this.href = href;
        this.govermentId = governmentId;
    }

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