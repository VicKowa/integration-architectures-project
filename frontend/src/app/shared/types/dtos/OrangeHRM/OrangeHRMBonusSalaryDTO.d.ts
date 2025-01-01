declare class OrangeHRMBonusSalaryDTO {
    /**
     * Create a OrangeHRMBonusSalaryDTO instance from a JSON object.
     * @param {Partial<OrangeHRMBonusSalaryDTO>} json - The JSON object representing the bonus salary.
     * @returns {OrangeHRMBonusSalaryDTO} A new OrangeHRMBonusSalaryDTO instance.
     */
    static fromJSON(json?: Partial<OrangeHRMBonusSalaryDTO>): OrangeHRMBonusSalaryDTO;
    /**
     * Create a OrangeHRMBonusSalaryDTO.
     * @param {string} year
     * @param {string} value
     */
    constructor(year: string, value: string);
    year: string;
    value: string;
}
