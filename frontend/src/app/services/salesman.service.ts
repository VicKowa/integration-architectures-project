import { Injectable } from '@angular/core';
import { SalesmanDTO } from '@app/dtos/SalesmanDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SalesmanService {

    constructor(private http: HttpClient) { }

    /**
     * Get all salesmen
     *
     * @returns all salesmen
     * */
    getAllSalesmen(): Observable<SalesmanDTO[]> {
        return this.http.get<SalesmanDTO[]>(environment.apiEndpoint + '/api/salesman', {withCredentials: true});
    }

    /**
     * Get a specific salesman
     *
     * @param sid - The salesman id
     * @returns The salesman
     * */
    getSalesmen(sid: string): Observable<SalesmanDTO> {
        return this.http.get<SalesmanDTO>(environment.apiEndpoint + `/api/salesman/${sid}`, {withCredentials: true});
    }
}
