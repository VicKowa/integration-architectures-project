/**
 * Represents a social performance record of a salesman
 */
declare class SocialPerformanceRecordDTO {
    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {number} targetValue
     * @param {number} actualValue
     * @param {number} bonus
     * @returns {{bonus, targetValue, actualValue}}
     */
    static createSpecifiedRecord(targetValue: number, actualValue: number, bonus: number): {
        bonus: number;
        targetValue: number;
        actualValue: number;
    };
    /**
     * Creates a new SocialPerformanceRecord from a JSON object
     * @param {Partial<SocialPerformanceRecordDTO>} json
     * @returns {SocialPerformanceRecordDTO}
     */
    static fromJSON(json: Partial<SocialPerformanceRecordDTO>): SocialPerformanceRecordDTO;
    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {Object} specifiedRecords
     */
    constructor(specifiedRecords?: any);
    specifiedRecords: any;
    #private;
}


export default SocialPerformanceRecordDTO;
