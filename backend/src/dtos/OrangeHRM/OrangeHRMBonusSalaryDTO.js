class OrangeHRMBonusSalaryDTO {
    constructor(year, value) {
        this.year = year;
        this.value = value;
    }

    static fromJSON(json = {}) {
        return new OrangeHRMBonusSalaryDTO(
            json['year'] || '',
            json['value'] || ''
        );
    }
}