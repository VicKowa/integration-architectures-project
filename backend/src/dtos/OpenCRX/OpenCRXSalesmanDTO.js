
class OpenCRXSalesmanDTO {
    constructor(xri, governmentId) {
        this.xri = xri;
        this.govermentId = governmentId;
    }

    static fromJSON(account = {}) {
        return new OpenCRXSalesmanDTO(
            account["saleRep"]["@href"] || '',
            account["governmentId"] || ''
        )
    }
}