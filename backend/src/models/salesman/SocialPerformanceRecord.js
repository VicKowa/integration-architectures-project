class SocialPerformanceRecord {
    constructor(year, totalBonus, department,specifiedRecords = {}) {
        this.year = year;
        this.totalBonus = totalBonus;
        this.department = department;
        this.specifiedRecords = this.#validateSpecifiedRecords(specifiedRecords);
    }

    // Sicherstellen, dass alle 6 Typen vorhanden sind
    #validateSpecifiedRecords(records) {
        const requiredTypes = ['leadershipCompetence', 'opennessToEmployee', 'socialBehaviorToEmployee', 'attitudeToClients', 'communicationSkills', 'integrityToCompany'];
        const validatedRecords = {};

        requiredTypes.forEach((type) => {
            if (!records[type]) {
                // Standardwerte setzen, falls ein Record fehlt
                validatedRecords[type] = { 'targetValue': 0, 'actualValue': 0, 'bonus': 0 };
            } else {
                validatedRecords[type] = records[type];
            }
        });

        return validatedRecords;
    }

    static createSpecifiedRecord(targetValue, actualValue, bonus) {
        return { targetValue, actualValue, bonus };
    }
}

module.exports = SocialPerformanceRecord;