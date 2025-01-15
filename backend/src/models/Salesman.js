/**
 * Represents a salesman
 */
class Salesman {
    /**
     * Creates a new salesman
     * @param firstname : string
     * @param lastname : string
     * @param sid : string
     * @param jobTitle : string
     */
    constructor(firstname, lastname, sid, jobTitle){
        this.firstname = firstname;
        this.lastname = lastname;
        this.sid = sid;
        this.jobTitle = jobTitle;
    }

    /**
     * Creates a new SocialPerformanceRecord with specified values from a JSON object
     * @param json
     * @returns {Salesman}
     */
    static fromJSON(json) {
        return new Salesman(
            json.firstname,
            json.lastname,
            json.sid,
            json.jobTitle
        );
    }
}

module.exports = Salesman;