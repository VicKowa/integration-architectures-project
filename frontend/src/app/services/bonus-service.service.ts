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

    recalculateSPRBonus(evaluation: EvaluationDTO): Observable<SocialPerformanceRecordDTO> {
        return this.http.post<SocialPerformanceRecordDTO>(
            `${environment.apiEndpoint}/api/bonus/spr`,
            evaluation,
            {withCredentials: true}
        );
    }
}
