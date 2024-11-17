class SalesMan {
    constructor(firstname, lastname, sid, socialPerformanceRecords = []) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.sid = sid;

        this.socialPerformanceRecords = this.#validateRecords(socialPerformanceRecords);
    }

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

    addSocialPerformanceRecord(record) {
        if (this.socialPerformanceRecords.find(r => r.year === record.year)) {
            throw new Error(`Ein Record für das Jahr ${record.year} existiert bereits.`);
        }
        this.socialPerformanceRecords.push(record);
    }

    getSocialPerformanceRecord(year) {
        return this.socialPerformanceRecords.find(r => r.year === year);
    }
}

module.exports = SalesMan;