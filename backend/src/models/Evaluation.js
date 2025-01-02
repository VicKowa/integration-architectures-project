export class Evaluation {
    /**
     * Create a new Evaluation
     * @param {EvaluationDTO} evaluationDTO - The evaluation data transfer object
     */
    constructor(evaluationDTO) {
        this.orderEvaluation = evaluationDTO.orderEvaluation || [];
        this.socialPerformanceEvaluation = evaluationDTO.socialPerformanceEvaluation || [];
        this.totalBonus = evaluationDTO.totalBonus || 0;
        this.year = evaluationDTO.year || null;
        this.department = evaluationDTO.department || null;
    }
}

module.exports = Evaluation;