class OrangeHRMBonusSalaryDTO {
    /**
     * Create a OrangeHRMBonusSalaryDTO.
     * @param {string} year
     * @param {string} value
     */
    constructor(year, value) {
        this.year = year;
        this.value = value;
    }

    /**
     * Create a OrangeHRMBonusSalaryDTO instance from a JSON object.
     * @param {Partial<OrangeHRMBonusSalaryDTO>} json - The JSON object representing the bonus salary.
     * @returns {OrangeHRMBonusSalaryDTO} A new OrangeHRMBonusSalaryDTO instance.
     */
    static fromJSON(json = {}) {
        return new OrangeHRMBonusSalaryDTO(
            json['year'] || '',
            json['value'] || ''
        );
    }
}