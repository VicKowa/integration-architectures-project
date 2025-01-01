declare class OdooBonusDTO {
    /**
     * Creates an OdooBonusDTO instance from a JSON object.
     * @param {Object} bonus
     * @returns {OdooBonusDTO}
     */
    static fromJSON(bonus?: any): OdooBonusDTO;
    /**
     * Creates an instance of OdooBonusDTO.
     * @param {string} id
     * @param {string} state
     * @param {string} employee_id
     * @param {string} bonus_reason_id
     * @param {string} bonus_amount
     */
    constructor(id: string, state: string, employee_id: string, bonus_reason_id: string, bonus_amount: string);
    id: string;
    state: string;
    employee_id: string;
    bonus_reason_id: string;
    bonus_amount: string;
}
