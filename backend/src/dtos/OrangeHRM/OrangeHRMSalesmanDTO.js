class OrangeHRMSalesmanDTO {
    constructor(firstName, lastName, middleName, code, jobTitle, employeeId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.code = code;
        this.jobTitle = jobTitle;
        this.employeeId = employeeId;
    }

    static fromJSON(json = {}) {
        return new OrangeHRMSalesmanDTO(
            json['firstName'] || '',
            json['lastName'] || '',
            json['middleName'] || '',
            json['code'] || '',
            json['jobTitle'] || '',
            json['employeeId'] || ''
        );
    }
}

module.exports = OrangeHRMSalesmanDTO;