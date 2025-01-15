class OdooBonusDTO {
    /**
     * Creates an instance of OdooBonusDTO.
     * @param {string} id
     * @param {string} state
     * @param {string} employee_id
     * @param {string} bonus_reason_id
     * @param {string} bonus_amount
     */
      constructor(id, state, employee_id, bonus_reason_id, bonus_amount) {
          this.id = id;
          this.state = state;
          this.employee_id = employee_id;
          this.bonus_reason_id = bonus_reason_id;
          this.bonus_amount = bonus_amount;
      }

    /**
     * Creates an OdooBonusDTO instance from a JSON object.
     * @param {Partial<OdooBonusDTO>} bonus
     * @returns {OdooBonusDTO}
     */
      static fromJSON(bonus = {}) {
            return new OdooBonusDTO(
                bonus['id'] || '',
                bonus['state'] || '',
                bonus['employee_id'] || '',
                bonus['bonus_reason_id'] || '',
                bonus['bonus_amount'] || ''
            );
      }
}

module.exports = OdooBonusDTO;