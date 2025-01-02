/**
 * Represents a social performance record of a salesman
 */
class SocialPerformanceRecordDTO {
    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {Object} specifiedRecords
     */
    constructor(specifiedRecords = {}) {
        this.specifiedRecords = this.#ensureAllTypes(specifiedRecords);
    }

    /**
     * Returns the records with all necessary types
     * @param {Object} records
     * @returns {Object}
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
     * @param {number} targetValue
     * @param {number} actualValue
     * @param {number} bonus
     * @returns {{bonus, targetValue, actualValue}}
     */
    static createSpecifiedRecord(targetValue, actualValue, bonus) {
        return { targetValue, actualValue, bonus };
    }

    /**
     * Creates a new SocialPerformanceRecord from a JSON object
     * @param {Partial<SocialPerformanceRecordDTO>} json
     * @returns {SocialPerformanceRecordDTO}
     */
    static fromJSON(json) {
        const { ...specifiedRecords } = json;
        return new SocialPerformanceRecordDTO(specifiedRecords);
    }
}

module.exports = SocialPerformanceRecordDTO;