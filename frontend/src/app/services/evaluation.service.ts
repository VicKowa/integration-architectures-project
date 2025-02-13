import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {EvaluationDTO} from '@app/dtos/EvaluationDTO';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EvaluationService {

    constructor(private http: HttpClient) { }

    /**
     * Create a new evaluation
     *
     * @returns True if the evaluation was created, false otherwise
     * @param sid - The salesman id
     * @param year - The year of performance
     * */
    createEvaluation(sid: string, year: string): Observable<boolean> {
        console.log(sid, year);
        return this.http.post(
            `${environment.apiEndpoint}/api/eval/${sid}/${year}`,
            null, // no request body
            { observe: 'response', withCredentials: true }
        ).pipe(
            map((): boolean => true),
            catchError((): Observable<boolean> => of(false))
        );
    }

    /**
     * Get all evaluations
     *
     * @param query - The query to filter the evaluations
     * @returns All evaluations
     * */
    getAllEvaluations(query: Partial<any>): Observable<EvaluationDTO[]>{
        return this.http.get<EvaluationDTO[]>(environment.apiEndpoint + '/api/eval', {
            params: query,
            withCredentials: true
        });
    }

    /**
     * Get the evaluation of a salesman for a specific year
     *
     * @param sid - The salesman id
     * @param year - The year
     * @returns The evaluation of the salesman for the specific year
     * */
    getEvaluation(sid: string, year: string): Observable<EvaluationDTO> {
        return this.http.get<EvaluationDTO>(
            `${environment.apiEndpoint}/api/eval/${sid}/${year}`,
            { withCredentials: true }
        );
    }

    /**
     * Update an evaluation
     *
     * @param evaluation
     * @returns True if the evaluation was updated, false otherwise
     */
    updateEvaluation(evaluation: EvaluationDTO): Observable<boolean> {
        return this.http.put(environment.apiEndpoint + '/api/eval', evaluation, { withCredentials: true })
            .pipe(
                map((): boolean => true),
                catchError((): Observable<boolean> => of(false))
            );
    }
}
