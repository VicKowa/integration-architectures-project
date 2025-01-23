import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../../environments/environment";

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
}
