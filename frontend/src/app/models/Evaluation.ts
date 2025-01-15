import { EvaluationDTO } from '../dtos/EvaluationDTO';
import {OrderEvaluation} from '@app/dtos/OrderEvaluationDTO';
import {SocialPerformanceRecord} from '@app/dtos/SocialPerformanceRecordDTO';

export class Evaluation {
    orderEvaluation: OrderEvaluation[];
    socialPerformanceEvaluation: SocialPerformanceRecord[];
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
