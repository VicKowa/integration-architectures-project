class OdooSalesmanDTO {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromJSON(salesman: Partial<OdooSalesmanDTO> = {}): OdooSalesmanDTO {
        return new OdooSalesmanDTO(
            salesman.id || '',
            salesman.name || ''
        );
    }
}
