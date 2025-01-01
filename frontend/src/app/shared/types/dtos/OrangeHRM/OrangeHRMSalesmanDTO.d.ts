
declare class OrangeHRMSalesmanDTO {
    /**
     * Creates an OrangeHRMSalesmanDTO instance from a JSON object.
     * @param {Partial<OrangeHRMSalesmanDTO>} json - The JSON object representing the salesman.
     * @returns {OrangeHRMSalesmanDTO} A new OrangeHRMSalesmanDTO instance.
     */
    static fromJSON(json?: Partial<OrangeHRMSalesmanDTO>): OrangeHRMSalesmanDTO;
    /**
     * Constructor for OrangeHRMSalesmanDTO
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} middleName
     * @param {string} code
     * @param {string} jobTitle
     * @param {string} employeeId
     */
    constructor(firstName: string, lastName: string, middleName: string, code: string, jobTitle: string, employeeId: string);
    firstName: string;
    lastName: string;
    middleName: string;
    code: string;
    jobTitle: string;
    employeeId: string;
}

export default OrangeHRMSalesmanDTO;
