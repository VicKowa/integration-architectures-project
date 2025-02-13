export interface Record {
    targetValue: number;
    actualValue: number;
    bonus: number;
    comment: string;
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
     *
     * @param specifiedRecords - The specified records
     */
    constructor(specifiedRecords?: { specifiedRecords?: SpecifiedRecords }) {
        this.specifiedRecords = this.ensureAllTypes(specifiedRecords);
    }

    /**
     * Returns the records with all necessary types
     *
     * @param records - The records to validate
     * @returns the records with all necessary types
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
        const defaultRecord: Record = { targetValue: 0, actualValue: 0, bonus: 0 , comment: '' };

        return requiredTypes.reduce((validated: SpecifiedRecords, type: keyof SpecifiedRecords): SpecifiedRecords => {
            validated[type] = (records as Partial<SpecifiedRecords>)[type] || { ...defaultRecord };
            return validated;
        }, {} as SpecifiedRecords);
    }

    /**
     * Creates a new SocialPerformanceRecord with specified values
     *
     * @param targetValue - The target value
     * @param actualValue - The actual value
     * @param bonus - The bonus
     * @param comment
     * @returns a new SpecifiedRecord
     */
    static createSpecifiedRecord(targetValue: number, actualValue: number, bonus: number, comment: string): Record {
        return { targetValue, actualValue, bonus, comment };
    }

    /**
     * Creates a new SocialPerformanceRecord from a JSON object
     *
     * @param json - JSON object
     * @returns a new SocialPerformanceRecordDTO
     */
    static fromJSON(json: Partial<SocialPerformanceRecordDTO>): SocialPerformanceRecordDTO {
        const { ...specifiedRecords } = json;
        return new SocialPerformanceRecordDTO(specifiedRecords);
    }

    /**
     * Calculate the total bonus
     */
    calculateTotalBonus(): void {
        this.totalBonus = Object.values(this.specifiedRecords as Record[])
            .reduce(
                (sum: number, record: Record): number =>
                    sum + record.bonus, 0
            );
    }
}
