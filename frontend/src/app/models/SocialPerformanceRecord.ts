import { SocialPerformanceRecordDTO, SpecifiedRecords } from '../dtos/SocialPerformanceRecordDTO';

export class SocialPerformanceRecord {
    specifiedRecords: SpecifiedRecords;

    /**
     * Creates a new SocialPerformanceRecord with specified values
     *
     * @param socialPerformanceRecordDTO - The social performance record data transfer object
     */
    constructor(socialPerformanceRecordDTO: SocialPerformanceRecordDTO) {
        this.specifiedRecords = socialPerformanceRecordDTO.specifiedRecords || {};
    }
}
