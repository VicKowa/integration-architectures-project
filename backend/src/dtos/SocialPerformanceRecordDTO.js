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
        this.totalBonus = this.calculateTotalBonus() || 0;
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
     * @param comment
     * @returns {{bonus, targetValue, actualValue}}
     */
    static createSpecifiedRecord(targetValue, actualValue, bonus, comment = '') {
        return { targetValue, actualValue, bonus, comment };
    }

    /**
     * Creates a new SocialPerformanceRecord from a JSON object
     * @param {Partial<SocialPerformanceRecordDTO>} json
     * @returns {SocialPerformanceRecordDTO}
     */
    static fromJSON(json) {
        return new SocialPerformanceRecordDTO(json.specifiedRecords);
    }

    /**
     * Calculates the total bonus of all specified records
     * @returns {any}
     */
    calculateTotalBonus() {
        return Object.values(this.specifiedRecords).reduce((acc, record) => acc + record.bonus, 0);
    }


    static createRecordWithRandomActualValues(sid, year) {
        const randomValue = () => Math.floor(Math.random() * 5);
        const targetValue = 4;
        const createRecord = () => SocialPerformanceRecordDTO.createSpecifiedRecord(targetValue, randomValue(), 0, '');

        return new SocialPerformanceRecordDTO({
            leadershipCompetence: createRecord(),
            opennessToEmployee: createRecord(),
            socialBehaviorToEmployee: createRecord(),
            attitudeToClients: createRecord(),
            communicationSkills: createRecord(),
            integrityToCompany: createRecord()
        });
    }
}

module.exports = SocialPerformanceRecordDTO;