import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrangeHRMSalesmanDTO } from '@app/dtos/OrangeHRM/OrangeHRMSalesmanDTO';
import { map } from 'rxjs/operators';
import { User } from '@app/models/User';
import OdooBonusDTO from '@app/dtos/Odoo/OdooBonusDTO';
import OdooSalesmanDTO from '@app/dtos/Odoo/OdooSalesmanDTO';
import OpenCRXSaleDTO from '@app/dtos/OpenCRX/OpenCRXSaleDTO';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    /**
     * returns all salesmen
     *
     * @returns all salesmen
     * */
    getSalesman(): Observable<OrangeHRMSalesmanDTO[]> {
        return this.http.get<Partial<OrangeHRMSalesmanDTO>[]>(`${environment.apiEndpoint}/salesmanohrm`, {withCredentials: true}).pipe(
            map((response: Partial<OrangeHRMSalesmanDTO>[]): OrangeHRMSalesmanDTO[] =>
                response
                    .map((data: Partial<OrangeHRMSalesmanDTO>): OrangeHRMSalesmanDTO =>
                        OrangeHRMSalesmanDTO.fromJSON(data)
                    )
            )
        );
    }

    /**
     * returns a specific salesman
     *
     * @param sid - The salesman id
     * @returns The salesman
     * */
    getSalesmanById(sid: string): Observable<OrangeHRMSalesmanDTO> {
        return this.http.get<Partial<OrangeHRMSalesmanDTO>>(`${environment.apiEndpoint}/salesmanohrm/${sid}`, {withCredentials: true}).pipe(
            map((data: Partial<OrangeHRMSalesmanDTO>): OrangeHRMSalesmanDTO =>
                OrangeHRMSalesmanDTO.fromJSON(data)
            )
        );
    }

    /**
     * returns all sales orders from a salesman
     *
     * @param sid - The salesman id
     * @returns all sales orders from a salesman
     * */
    getSalesOrders(sid: string): Observable<OpenCRXSaleDTO[]> {
        return this.http.get<Partial<OpenCRXSaleDTO>[]>(`${environment.apiEndpoint}/products/sales?salesman=${sid}`, {
            withCredentials: true
        }).pipe(
            map((response: Partial<OpenCRXSaleDTO>[]): OpenCRXSaleDTO[] =>
                response.map((data: Partial<OpenCRXSaleDTO>): OpenCRXSaleDTO =>
                    OpenCRXSaleDTO.fromJSON(data)
                )
            )
        );
    }


    /**
     * returns the current role
     *
     * @returns current role
     * */
    getCurrentRole(): Observable<string> {
        return this.http.get<User>(`${environment.apiEndpoint}/user`, {withCredentials: true}).pipe(
            map((user: User): string => user.role)
        );
    }

    /**
     * returns the bonuses of an Odoo salesman
     *
     * @param id - The salesman id (Odoo)
     * @returns The bonuses of the salesman (Odoo)
     * */
    getOdooBonuses(id: string): Observable<OdooBonusDTO[]> {
        return this.http.get<Partial<OdooBonusDTO[]>>(`${environment.apiEndpoint}/odoo/bonus/${id}`, { withCredentials: true }).pipe(
            map((response: Partial<OdooBonusDTO[]>): OdooBonusDTO[] =>
                response.map((data: Partial<OdooBonusDTO>): OdooBonusDTO =>
                    OdooBonusDTO.fromJSON(data)
                )
            )
        );
    }

    /**
     * returns a specific Odoo salesman
     *
     * @param id - The salesman id
     * @returns The salesman
     * */
    getOdooSalesman(id: string): Observable<OdooSalesmanDTO> {
        return this.http.get<Partial<OdooSalesmanDTO>>(`${environment.apiEndpoint}/odoo/salesman/${id}`, { withCredentials: true }).pipe(
            map((data: Partial<OdooSalesmanDTO>): OdooSalesmanDTO =>
                OdooSalesmanDTO.fromJSON(data)
            )
        );
    }

    /**
     * returns all Odoo salesmen
     *
     * @returns all Odoo salesmen
     * */
    getOdooAllSalesman(): Observable<OdooSalesmanDTO[]> {
        return this.http.get<Partial<OdooSalesmanDTO>[]>(`${environment.apiEndpoint}/odoo/salesman`, {withCredentials: true}).pipe(
            map((response: Partial<OdooSalesmanDTO>[]): OdooSalesmanDTO[] =>
                response
                    .map((data: Partial<OdooSalesmanDTO>): OdooSalesmanDTO =>
                        OdooSalesmanDTO.fromJSON(data)
                    )
                    .filter((salesman: OdooSalesmanDTO): boolean =>
                        salesman.jobTitle === 'Senior Salesperson'
                    )
            )
        );
    }
}
