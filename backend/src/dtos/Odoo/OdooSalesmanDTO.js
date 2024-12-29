class OdooSalesmanDTO {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static fromJSON(salesman = {}) {
        return new OdooSalesmanDTO(
            salesman['id'] || '',
            salesman['name'] || ''
        );
    }
}