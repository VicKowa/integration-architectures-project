class OdooSalesmanDTO {
    id: string;
    name: string;
    jobTitle: string;

    constructor(id: string, name: string, jobTitle: string) {
        this.id = id;
        this.name = name;
        this.jobTitle = jobTitle;
    }

    static fromJSON(salesman: Partial<OdooSalesmanDTO> = {}): OdooSalesmanDTO {
        return new OdooSalesmanDTO(
            salesman.id || '',
            salesman.name || '',
            salesman.jobTitle || ''
        );
    }
}

export default OdooSalesmanDTO;
