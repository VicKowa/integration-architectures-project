class OrangeHRMSalesmanDTO {
    firstName: string;
    lastName: string;
    middleName: string;
    code: string;
    jobTitle: string;
    employeeId: string;

    constructor(
        firstName: string,
        lastName: string,
        middleName: string,
        code: string,
        jobTitle: string,
        employeeId: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.code = code;
        this.jobTitle = jobTitle;
        this.employeeId = employeeId;
    }

    static fromJSON(json: Partial<OrangeHRMSalesmanDTO> = {}): OrangeHRMSalesmanDTO {
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

export default OrangeHRMSalesmanDTO;
