declare class OdooSalesmanDTO {
    /**
     *
     * @param {Partial<OdooSalesmanDTO>} salesman
     * @returns {OdooSalesmanDTO}
     */
    static fromJSON(salesman?: Partial<OdooSalesmanDTO>): OdooSalesmanDTO;
    /**
     * Create a OdooSalesmanDTO.
     * @param {string} id
     * @param {string} name
     */
    constructor(id: string, name: string);
    id: string;
    name: string;
}

export default OdooSalesmanDTO;
