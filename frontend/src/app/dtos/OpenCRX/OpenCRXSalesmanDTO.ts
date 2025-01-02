class OpenCRXSalesmanDTO {
    href: string;
    governmentId: string;

    constructor(href: string, governmentId: string) {
        this.href = href;
        this.governmentId = governmentId;
    }

    static fromJSON(account: Partial<OpenCRXSalesmanDTO> = {}): OpenCRXSalesmanDTO {
        return new OpenCRXSalesmanDTO(
            account.href || '',
            account.governmentId || ''
        );
    }
}

export default OpenCRXSalesmanDTO;
