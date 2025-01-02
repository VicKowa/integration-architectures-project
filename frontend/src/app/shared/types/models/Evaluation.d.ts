import EvaluationDTO from "@shared/types/dtos/EvaluationDTO";

export class Evaluation {
    /**
     * Create a new Evaluation
     * @param {EvaluationDTO} evaluationDTO - The evaluation data transfer object
     */
    constructor(evaluationDTO: EvaluationDTO);
    orderEvaluation: any;
    socialPerformanceEvaluation: any;
    totalBonus: any;
    year: any;
    department: any;
}
