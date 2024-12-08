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
        console.log('Fetching salesmen from API');
        return this.http.get<any[]>(this.apiURL).pipe(
            map(response => response.map(data =>
                new Salesman(data.firstname, data.lastname, data.sid))
            )
        );
    }
}
