declare class OdooBonusDTO {
    /**
     * Creates an OdooBonusDTO instance from a JSON object.
     * @param {Partial<OdooBonusDTO>} bonus
     * @returns {OdooBonusDTO}
     */
    static fromJSON(bonus?: Partial<OdooBonusDTO>): OdooBonusDTO;
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
