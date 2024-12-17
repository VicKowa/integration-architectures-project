class OrangeHRMBonusSalaryDTO {
    year: string;
    value: string;

    constructor(year: string, value: string) {
        this.year = year;
        this.value = value;
    }

    static fromJSON(json: Partial<OrangeHRMBonusSalaryDTO> = {}): OrangeHRMBonusSalaryDTO {
        return new OrangeHRMBonusSalaryDTO(
            json['year'] || '',
            json['value'] || ''
        );
    }
}

export default OrangeHRMBonusSalaryDTO;
