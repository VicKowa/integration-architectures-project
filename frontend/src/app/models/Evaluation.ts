import { EvaluationDTO } from '../dtos/EvaluationDTO';
import {OrderEvaluationDTO} from '@app/dtos/OrderEvaluationDTO';
import {SocialPerformanceRecordDTO} from '@app/dtos/SocialPerformanceRecordDTO';

export class Evaluation {
    orderEvaluation: OrderEvaluationDTO[];
    socialPerformanceEvaluation: SocialPerformanceRecordDTO[];
    totalBonus: number;
    year: string;
    department: string | null;

    /**
     * Create a new Evaluation
     *
     * @param evaluationDTO - The evaluation data transfer object
     */
    constructor(evaluationDTO: EvaluationDTO) {
        this.orderEvaluation = evaluationDTO.orderEvaluation || [];
        this.socialPerformanceEvaluation = evaluationDTO.socialPerformanceEvaluation || [];
        this.totalBonus = evaluationDTO.totalBonus || 0;
        this.year = evaluationDTO.year || null;
        this.department = evaluationDTO.department || null;
    }
}
