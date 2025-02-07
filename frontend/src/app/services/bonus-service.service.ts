import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import OrangeHRMBonusSalaryDTO from "@app/dtos/OrangeHRM/OrangeHRMBonusSalaryDTO";

@Injectable({
    providedIn: 'root'
})
export class BonusServiceService {

    constructor(private http: HttpClient) {
    }

    getSPRBonus(sid: string, year: string) {
        return this.http.get(
            `${environment.apiEndpoint}/api/bonus/spr/${sid}/${year}`,
            {withCredentials: true}
        );
    }

    getOEBonus(sid: string, year: string) {
        return this.http.get(
            `${environment.apiEndpoint}/api/bonus/oe/${sid}/${year}`,
            {withCredentials: true}
        );
    }

    createBonusOrangesHRM(sid: string, year: string, bonusDto: OrangeHRMBonusSalaryDTO) {
        return this.http.put(
            `${environment.apiEndpoint}/api/salesmanohrm/:id/salary/:year`,
            bonusDto,
            {withCredentials: true}
        );
    }
}
