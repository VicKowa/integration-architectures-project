import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salesman } from '../../models/Salesman';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private URL = 'http://localhost:4200/api';

    constructor(private http: HttpClient) { }

    getSalesman(): Observable<Salesman[]> {
        return this.http.get<any[]>(`${this.URL}/salesmanohrm`).pipe(
            map(response => response.map(data =>
                new Salesman(data.firstName, data.lastName, data.employeeId))
            )
        );
    }

    getSalesmanById(sid: string): Observable<Salesman> {
        return this.http.get<any>(`${this.URL}/salesmanohrm/${sid}`).pipe(
            map(data => new Salesman(data.firstName, data.lastName, data.employeeId))
        );
    }

    getSalesOrders(sid: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/products/sales/${sid}`); // TODO: Implement sales orders endpoint
    }

    getOrderDetails(orderId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.URL}/products/sales/${orderId}`);
    }

    getBonuses(sid: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.URL}/bonus/total/${sid}`); // TODO: Implement bonus endpoint for bonuses from all years
    }
}
