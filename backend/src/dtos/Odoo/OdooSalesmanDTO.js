class OdooSalesmanDTO {
    /**
     * Create a OdooSalesmanDTO.
     * @param {string} id
     * @param {string} name
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     *
     * @param {Object} salesman
     * @returns {OdooSalesmanDTO}
     */
    static fromJSON(salesman = {}) {
        return new OdooSalesmanDTO(
            salesman['id'] || '',
            salesman['name'] || ''
        );
    }
}