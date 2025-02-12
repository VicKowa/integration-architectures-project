import { EvaluationDTO } from '../dtos/EvaluationDTO';
import {OrderEvaluation} from '@app/models/OrderEvaluation';
import {SocialPerformanceRecord} from '@app/models/SocialPerformanceRecord';

export class Evaluation {
    orderEvaluation: OrderEvaluation | any[];
    socialPerformanceEvaluation: SocialPerformanceRecord | any[];
    totalBonus: number;
    year: string;
    department: string | null;

    /**
     * Create a new Evaluation
     *
     * @param evaluationDTO - The evaluation data transfer object
     */
    constructor(evaluationDTO: EvaluationDTO) {
        this.orderEvaluation = evaluationDTO.orderEvaluation as OrderEvaluation || [];
        this.socialPerformanceEvaluation = evaluationDTO.socialPerformanceEvaluation as SocialPerformanceRecord || [];
        this.totalBonus = evaluationDTO.totalBonus || 0;
        this.year = evaluationDTO.year || null;
        this.department = evaluationDTO.department || null;
    }
}
