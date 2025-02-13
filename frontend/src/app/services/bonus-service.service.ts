import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {SocialPerformanceRecordDTO} from '@app/dtos/SocialPerformanceRecordDTO';
import {OrderEvaluationDTO} from '@app/dtos/OrderEvaluationDTO';
import {EvaluationDTO} from '@app/dtos/EvaluationDTO';

@Injectable({
    providedIn: 'root'
})
export class BonusServiceService {

    constructor(private http: HttpClient) { }

    /**
     * Get the bonus of a specific salesman
     *
     * @param sid - The salesman id
     * @param year - The year of the bonus
     * @returns The bonus of the salesman
     * */
    getSPRBonus(sid: string, year: string): Observable<SocialPerformanceRecordDTO> {
        return this.http.get<SocialPerformanceRecordDTO>(
            `${environment.apiEndpoint}/api/bonus/spr/${sid}/${year}`,
            {withCredentials: true}
        );
    }

    /**
     * Recalculate the bonus of a specific salesman
     *
     * @param evaluation - The evaluation of the salesman
     * @returns The bonus of the salesman
     * */
    recalculateSPRBonus(evaluation: EvaluationDTO): Observable<SocialPerformanceRecordDTO> {
        return this.http.post<SocialPerformanceRecordDTO>(
            `${environment.apiEndpoint}/api/bonus/spr`,
            evaluation,
            {withCredentials: true}
        );
    }

    /**
     * Get the bonus of a specific salesman
     *
     * @param sid - The salesman id
     * @param year - The year of the bonus
     * @returns The bonus of the salesman
     * */
    getOEBonus(sid: string, year: string): Observable<OrderEvaluationDTO> {
        return this.http.get<OrderEvaluationDTO>(
            `${environment.apiEndpoint}/api/bonus/oe/${sid}/${year}`,
            {withCredentials: true}
        );
    }
}
