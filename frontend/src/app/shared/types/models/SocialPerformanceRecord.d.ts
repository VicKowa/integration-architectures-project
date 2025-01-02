import SocialPerformanceRecordDTO from "@shared/types/dtos/SocialPerformanceRecordDTO";

declare class SocialPerformanceRecord {
    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {SocialPerformanceRecordDTO} socialPerformanceRecordDTO
     */
    constructor(socialPerformanceRecordDTO: SocialPerformanceRecordDTO);
    specifiedRecords: any;
}

export default SocialPerformanceRecord;
