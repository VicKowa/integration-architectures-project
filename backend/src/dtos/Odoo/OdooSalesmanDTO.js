class OdooSalesmanDTO {
    /**
     * Create a OdooSalesmanDTO.
     * @param {string} id
     * @param {string} name
     * @param {string} jobTitle
     */
    constructor(id, name, jobTitle) {
        this.id = id;
        this.name = name;
        this.jobTitle = jobTitle;
    }

    /**
     *
     * @param {Partial<OdooSalesmanDTO>} salesman
     * @returns {OdooSalesmanDTO}
     */
    static fromJSON(salesman = {}) {
        return new OdooSalesmanDTO(
            salesman['id'] || '',
            salesman['name'] || '',
            salesman['job_title'] || ''
        );
    }
}

module.exports = OdooSalesmanDTO;