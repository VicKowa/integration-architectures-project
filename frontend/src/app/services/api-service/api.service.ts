import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrangeHRMSalesmanDTO } from '../../dtos/OrangeHRM/OrangeHRMSalesmanDTO';
import { map } from 'rxjs/operators';
import OpenCRXSaleDTO from '../../dtos/OpenCRX/OpenCRXSaleDTO';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private URL = 'http://localhost:4200/api';

    constructor(private http: HttpClient) { }

    getSalesman(): Observable<OrangeHRMSalesmanDTO[]> {
        return this.http.get<Partial<OrangeHRMSalesmanDTO>[]>(`${this.URL}/salesmanohrm`).pipe(
            map((response: Partial<OrangeHRMSalesmanDTO>[]): OrangeHRMSalesmanDTO[] =>
                response.map((data: Partial<OrangeHRMSalesmanDTO>): OrangeHRMSalesmanDTO =>
                    OrangeHRMSalesmanDTO.fromJSON(data)
                )
            )
        );
    }

    getSalesmanById(sid: string): Observable<OrangeHRMSalesmanDTO> {
        return this.http.get<Partial<OrangeHRMSalesmanDTO>>(`${this.URL}/salesmanohrm/${sid}`).pipe(
            map((data: Partial<OrangeHRMSalesmanDTO>): OrangeHRMSalesmanDTO =>
                OrangeHRMSalesmanDTO.fromJSON(data)
            )
        );
    }

    getSalesOrders(sid: string): Observable<OpenCRXSaleDTO[]> {
        return this.http.get<Partial<OpenCRXSaleDTO>[]>(`${this.URL}/products/sales?salesman=${sid}`).pipe(
            map((response: Partial<OpenCRXSaleDTO>[]): OpenCRXSaleDTO[] =>
                response.map((data: Partial<OpenCRXSaleDTO>): OpenCRXSaleDTO =>
                    OpenCRXSaleDTO.fromJSON(data)
                )
            )
        );
    }

    getBonuses(sid: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.URL}/bonus/total/${sid}`); // TODO: Implement bonus endpoint for bonuses from all years
    }
}
