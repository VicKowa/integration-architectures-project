import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OrangeHRMSalesmanDTO} from '@app/dtos/OrangeHRM/OrangeHRMSalesmanDTO';
import {map} from 'rxjs/operators';
import {User} from '@app/models/User';
import OdooBonusDTO from '@app/dtos/Odoo/OdooBonusDTO';
import OdooSalesmanDTO from '@app/dtos/Odoo/OdooSalesmanDTO';
import OpenCRXSaleDTO from '@app/dtos/OpenCRX/OpenCRXSaleDTO';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private URL = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    /**
     * returns all salesmen
     *
     * @returns all salesmen
     * */
    getSalesman(): Observable<OrangeHRMSalesmanDTO[]> {
        return this.http.get<Partial<OrangeHRMSalesmanDTO>[]>(`${this.URL}/salesmanohrm`, {withCredentials: true}).pipe(
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
        return this.http.get<Partial<OrangeHRMSalesmanDTO>>(`${this.URL}/salesmanohrm/${sid}`, {withCredentials: true}).pipe(
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
        return this.http.get<Partial<OpenCRXSaleDTO>[]>(`${this.URL}/products/sales?salesman=${sid}`, {
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
     * returns all roles
     *
     * @returns all roles in an array of strings
     * */
    getRoles(): Observable<string[]> {
        return this.http.get<string[]>(`${this.URL}/roles`);
    }

    /**
     * returns the current role
     *
     * @returns current role
     * */
    getCurrentRole(): Observable<string> {
        return this.http.get<User>(`${this.URL}/user`, {withCredentials: true}).pipe(
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
        return this.http.get<Partial<OdooBonusDTO[]>>(`${this.URL}/odoo/bonus/${id}`, { withCredentials: true }).pipe(
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
        return this.http.get<Partial<OdooSalesmanDTO>>(`${this.URL}/odoo/salesman/${id}`, { withCredentials: true }).pipe(
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
        return this.http.get<Partial<OdooSalesmanDTO>[]>(`${this.URL}/odoo/salesman`, {withCredentials: true}).pipe(
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
