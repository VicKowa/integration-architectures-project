class OdooBonusDTO {
      constructor(id, state, employee_id, bonus_reason_id, bonus_amount) {
          this.id = id;
          this.state = state;
          this.employee_id = employee_id;
          this.bonus_reason_id = bonus_reason_id;
          this.bonus_amount = bonus_amount;
      }

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