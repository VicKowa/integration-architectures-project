class Evaluation {
    /**
     * Create a new Evaluation
     * @param {EvaluationDTO} evaluationDTO - The evaluation data transfer object
     */
    constructor(evaluationDTO) {
        this.sid = evaluationDTO.sid || null;
        this.year = evaluationDTO.year || null;
        this.department = evaluationDTO.department || null;
        this.orderEvaluation = evaluationDTO.orderEvaluation || null;
        this.socialPerformanceEvaluation = evaluationDTO.socialPerformanceEvaluation || null;
        this.approvalStatus = evaluationDTO.approvalStatus || 0;
        this.totalBonus = evaluationDTO.totalBonus || 0;
    }
}

module.exports = Evaluation;