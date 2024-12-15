class OpenCRXSalesmanDTO {
    constructor(href, governmentId) {
        this.href = href;
        this.govermentId = governmentId;
    }

    static fromJSON(account = {}) {
        return new OpenCRXSalesmanDTO(
            account["@href"] || '',
            account["governmentId"] || ''
        )
    }
}

module.exports = OpenCRXSalesmanDTO;