import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salesman } from '../../models/Salesman';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private apiURL = 'http://localhost:4200/api/salesmanohrm';

    constructor(private http: HttpClient) { }

    getSalesman(): Observable<Salesman[]> {
        return this.http.get<any[]>(this.apiURL).pipe(
            map(response => response.map(data =>
                new Salesman(data.firstname, data.lastname, data.sid))
            )
        );
    }

    getSalesmanById(sid: string): Observable<Salesman> {
        return this.http.get<any>(`${this.apiURL}/${sid}`).pipe(
            map(data => new Salesman(data.firstname, data.lastname, data.sid))
        );
    }

    getSalesOrders(sid: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiURL}/salesmen/${sid}/orders`);
    }

    getOrderDetails(orderId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiURL}/orders/${orderId}/details`);
    }

    getBonuses(sid: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiURL}/salesmen/${sid}/bonuses`);
    }
}
