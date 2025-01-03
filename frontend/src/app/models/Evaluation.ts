import { EvaluationDTO } from '../dtos/EvaluationDTO';

export class Evaluation {
    orderEvaluation: any[];
    socialPerformanceEvaluation: any[];
    totalBonus: number;
    year: string;
    department: string | null;

    /**
     * Create a new Evaluation
     * @param {EvaluationDTO} evaluationDTO - The evaluation data transfer object
     */
    constructor(evaluationDTO: EvaluationDTO) {
        this.orderEvaluation = evaluationDTO.orderEvaluation || [];
        this.socialPerformanceEvaluation = evaluationDTO.socialPerformanceEvaluation || [];
        this.totalBonus = evaluationDTO.totalBonus || 0;
        this.year = evaluationDTO.year || null;
        this.department = evaluationDTO.department || null;
    }
}
