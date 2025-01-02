class OdooBonusDTO {
    id: string;
    state: string;
    employee_id: string;
    bonus_reason_id: string;
    bonus_amount: string;

    constructor(
        id: string,
        state: string,
        employee_id: string,
        bonus_reason_id: string,
        bonus_amount: string
    ) {
        this.id = id;
        this.state = state;
        this.employee_id = employee_id;
        this.bonus_reason_id = bonus_reason_id;
        this.bonus_amount = bonus_amount;
    }

    static fromJSON(bonus: Partial<OdooBonusDTO> = {}): OdooBonusDTO {
        return new OdooBonusDTO(
            bonus.id || '',
            bonus.state || '',
            bonus.employee_id || '',
            bonus.bonus_reason_id || '',
            bonus.bonus_amount || ''
        );
    }
}

export default OdooBonusDTO;
