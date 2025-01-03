class OrangeHRMSalesmanDTO {
    /**
     * Constructor for OrangeHRMSalesmanDTO
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} middleName
     * @param {string} code
     * @param {string} jobTitle
     * @param {string} employeeId
     */
    constructor(firstName, lastName, middleName, code, jobTitle, employeeId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.code = code;
        this.jobTitle = jobTitle;
        this.employeeId = employeeId;
    }

    /**
     * Creates an OrangeHRMSalesmanDTO instance from a JSON object.
     * @param {Partial<OrangeHRMSalesmanDTO>} json - The JSON object representing the salesman.
     * @returns {OrangeHRMSalesmanDTO} A new OrangeHRMSalesmanDTO instance.
     */
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