declare class OdooSalesmanDTO {
    /**
     *
     * @param {Object} salesman
     * @returns {OdooSalesmanDTO}
     */
    static fromJSON(salesman?: any): OdooSalesmanDTO;
    /**
     * Create a OdooSalesmanDTO.
     * @param {string} id
     * @param {string} name
     */
    constructor(id: string, name: string);
    id: string;
    name: string;
}
