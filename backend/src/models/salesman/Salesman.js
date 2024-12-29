/**
 * Represents a salesman
 */
class Salesman {
    /**
     * Creates a new salesman
     * @param firstname
     * @param lastname
     * @param sid
     * @param socialPerformanceRecords
     */
    constructor(firstname, lastname, sid, socialPerformanceRecords = []) {
        this._id = undefined;
        this.firstname = firstname;
        this.lastname = lastname;
        this.sid = sid;

        // orange hrm data


        this.socialPerformanceRecords = this.#validateRecords(socialPerformanceRecords);
    }

    /**
     * Validates the records for a salesman
     * @param records
     * @returns {*[]}
     */
    #validateRecords(records) {
        const years = new Set();
        const validatedRecords = [];

        for (const record of records) {
            if (years.has(record.year)) {
                throw new Error(`Ein Record für das Jahr ${record.year} existiert bereits.`);
            }
            years.add(record.year);
            validatedRecords.push(record);
        }

        return validatedRecords;
    }

    /**
     * Adds a new social performance record to the salesman
     * @param salesman
     * @param record
     */
    static addSocialPerformanceRecord(salesman, record) {
        if (salesman.socialPerformanceRecords.find(r => r.year === record.year))
            throw new Error(`Ein Record für das Jahr ${record.year} existiert bereits.`);

        salesman.socialPerformanceRecords.push(record);
    }

    /**
     * Returns the social performance record for a specific year
     * @param year
     * @returns {*}
     */
    getSocialPerformanceRecord(year) {
        return this.socialPerformanceRecords.find(r => r.year === year);
    }

    /**
     * Creates a new SocialPerformanceRecord with specified values from a JSON object
     * @param json
     * @returns {Salesman}
     */
    static fromJSON(json) {
        const { firstname, lastname, sid, socialPerformanceRecords = [] } = json;
        return new Salesman(firstname, lastname, sid, socialPerformanceRecords);
    }
}

module.exports = Salesman;