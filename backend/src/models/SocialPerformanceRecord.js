class SocialPerformanceRecord {
    /**
     * Creates a new SocialPerformanceRecord with specified values
     * @param {SocialPerformanceRecordDTO} socialPerformanceRecordDTO
     */
    constructor(socialPerformanceRecordDTO) {
        this.specifiedRecords = socialPerformanceRecordDTO.specifiedRecords || [];
    }
}