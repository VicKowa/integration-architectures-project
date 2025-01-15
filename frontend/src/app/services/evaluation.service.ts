import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApprovalEnum, EvaluationDTO} from '@app/dtos/EvaluationDTO';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EvaluationService {

    constructor(private http: HttpClient) { }


    createEvaluation(evaluation: EvaluationDTO): Observable<boolean> {
        return this.http.post(environment.apiEndpoint + '/api/eval', evaluation, { withCredentials: true })
            .pipe(
                map((): boolean => true),
                catchError((): Observable<boolean> => of(false))
            );
    }
    getAllEvaluations(query: Partial<any>): Observable<EvaluationDTO[]>{

        return this.http.get<EvaluationDTO[]>(environment.apiEndpoint + '/api/eval', {
            params: query,
            withCredentials: true });
    }

    getAllEvaluationsFromSalesman(sid: string): Observable<EvaluationDTO[]>{
        return this.http.get<EvaluationDTO[]>(environment.apiEndpoint + '/api/eval',
            {
                params: new HttpParams()
                    .set('sid', sid.toString()),
                withCredentials: true
            });
    }

    updateEvaluation(evaluation: EvaluationDTO): Observable<boolean> {
        return this.http.put(environment.apiEndpoint + '/api/eval', evaluation, { withCredentials: true })
            .pipe(
                map((): boolean => true),
                catchError((): Observable<boolean> => of(false))
            );
    }
}
