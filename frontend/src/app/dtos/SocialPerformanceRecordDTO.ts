interface Record {
    targetValue: number;
    actualValue: number;
    bonus: number;
}

export interface SpecifiedRecords {
    leadershipCompetence?: Record;
    opennessToEmployee?: Record;
    socialBehaviorToEmployee?: Record;
    attitudeToClients?: Record;
    communicationSkills?: Record;
    integrityToCompany?: Record;
}

export class SocialPerformanceRecordDTO {
    specifiedRecords: SpecifiedRecords;
    totalBonus: number;

    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {SpecifiedRecords} specifiedRecords
     */
    constructor(specifiedRecords?: { specifiedRecords?: SpecifiedRecords }) {
        this.specifiedRecords = this.ensureAllTypes(specifiedRecords);
    }

    /**
     * Returns the records with all necessary types
     * @param {SpecifiedRecords} records
     * @returns {SpecifiedRecords}
     */
    private ensureAllTypes(records: { specifiedRecords?: SpecifiedRecords }): SpecifiedRecords {
        const requiredTypes: (keyof SpecifiedRecords)[] = [
            'leadershipCompetence',
            'opennessToEmployee',
            'socialBehaviorToEmployee',
            'attitudeToClients',
            'communicationSkills',
            'integrityToCompany'
        ];
        const defaultRecord: Record = { targetValue: 0, actualValue: 0, bonus: 0 };

        return requiredTypes.reduce((validated, type) => {
            validated[type] = records[type] || { ...defaultRecord };
            return validated;
        }, {} as SpecifiedRecords);
    }

    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {number} targetValue
     * @param {number} actualValue
     * @param {number} bonus
     * @returns {Record}
     */
    static createSpecifiedRecord(targetValue: number, actualValue: number, bonus: number): Record {
        return { targetValue, actualValue, bonus };
    }

    /**
     * Creates a new SocialPerformanceRecord from a JSON object
     * @param {Partial<SocialPerformanceRecordDTO>} json
     * @returns {SocialPerformanceRecordDTO}
     */
    static fromJSON(json: Partial<SocialPerformanceRecordDTO>): SocialPerformanceRecordDTO {
        const { ...specifiedRecords } = json;
        return new SocialPerformanceRecordDTO(specifiedRecords);
    }

    /**
     * Calculate the total bonus
     */
    calculateTotalBonus(): void {
        this.totalBonus = Object.values(this.specifiedRecords).reduce((sum, record) => sum + record.bonus, 0);
    }
}
