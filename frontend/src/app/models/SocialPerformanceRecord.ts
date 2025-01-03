import { SocialPerformanceRecordDTO, SpecifiedRecords } from '../dtos/SocialPerformanceRecordDTO';

export class SocialPerformanceRecord {
    specifiedRecords: SpecifiedRecords;

    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {SocialPerformanceRecordDTO} socialPerformanceRecordDTO
     */
    constructor(socialPerformanceRecordDTO: SocialPerformanceRecordDTO) {
        this.specifiedRecords = socialPerformanceRecordDTO.specifiedRecords || {};
    }
}
