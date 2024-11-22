/**
 * Represents a social performance record of a salesman
 */
class SocialPerformanceRecord {
    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param year
     * @param totalBonus
     * @param department
     * @param specifiedRecords
     */
    constructor(year, totalBonus, department, specifiedRecords = {}) {
        this.year = year;
        this.totalBonus = totalBonus;
        this.department = department;
        this.specifiedRecords = this.#ensureAllTypes(specifiedRecords);
    }

    /**
     * Returns the records with all necessary types
     * @param records
     * @returns {{}}
     */
    #ensureAllTypes(records) {
        const requiredTypes = [
            'leadershipCompetence',
            'opennessToEmployee',
            'socialBehaviorToEmployee',
            'attitudeToClients',
            'communicationSkills',
            'integrityToCompany'
        ];
        const defaultRecord = { targetValue: 0, actualValue: 0, bonus: 0 };

        return requiredTypes.reduce((validated, type) => {
            validated[type] = records[type] || { ...defaultRecord };
            return validated;
        }, {});
    }

    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param targetValue
     * @param actualValue
     * @param bonus
     * @returns {{bonus, targetValue, actualValue}}
     */
    static createSpecifiedRecord(targetValue, actualValue, bonus) {
        return { targetValue, actualValue, bonus };
    }

    /**
     * Creates a new SocialPerformanceRecord from a JSON object
     * @param json
     * @returns {SocialPerformanceRecord}
     */
    static fromJSON(json) {
        const { year, totalBonus, department, ...specifiedRecords } = json;
        return new SocialPerformanceRecord(year, totalBonus, department, specifiedRecords);
    }
}

module.exports = SocialPerformanceRecord;
