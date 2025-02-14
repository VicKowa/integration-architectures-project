import { Injectable } from '@angular/core';
import { Credentials } from '../models/Credentials';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import UserDTO from '@app/dtos/UserDTO';

/**
 * Services specify logic, which is instantiated singularly -> it is shared between components
 * This service handles authorization with the backend
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Use null to indicate "unknown" state
    private loggedInSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
    isLoggedIn$: Observable<boolean | null> = this.loggedInSubject.asObservable();

    constructor(private http: HttpClient) {
        // Check login status on startup
        this.checkLogin().subscribe();
    }

    private setLoginState(newState: boolean): void {
        this.loggedInSubject.next(newState);
    }

    checkLogin(): Observable<HttpResponse<{ loggedIn: boolean }>> {
        return this.http.get<{ loggedIn: boolean }>(environment.apiEndpoint + '/api/login', {
            withCredentials: true,
            observe: 'response'
        }).pipe(
            tap((response: HttpResponse<{ loggedIn: boolean }>): void => {
                this.setLoginState(response.body.loggedIn);
            })
        );
    }

    login(credentials: Credentials): Observable<HttpResponse<any>> {
        return this.http.post(environment.apiEndpoint + '/api/login', credentials, {
            withCredentials: true,
            observe: 'response',
            responseType: 'text'
        }).pipe(
            tap((response: HttpResponse<any>): void => {
                if (response.status === 200) {
                    this.setLoginState(true);
                }
            })
        );
    }

    /**
     *
     */
    logout(): Observable<HttpResponse<any>> {
        return this.http.delete(environment.apiEndpoint + '/api/login', {
            withCredentials: true,
            observe: 'response',
            responseType: 'text'
        }).pipe(
            tap((response: HttpResponse<any>): void => {
                if (response.status === 200) {

                    this.setLoginState(false);
                }
            })
        );
    }

    /**
     * Registers a new user
     *
     * @param userData - consisting of username, password, email, firstname, lastname
     */
    register(userData: UserDTO): Observable<HttpResponse<any>> {
        return this.http.post(environment.apiEndpoint + '/api/register', userData, {
            withCredentials: true,
            observe: 'response',
            responseType: 'text'
        })
            .pipe(
                tap((response: HttpResponse<any>): void => {
                    if (response.status === 200) {
                        this.setLoginState(true);
                    }
                })
            );
    }

    isValidUsername(username: string): Observable<HttpResponse<{
        valid: boolean;
        ohrm: boolean;
    }>> {
        return this.http.get<{
            valid: boolean;
            ohrm: boolean;
        }>(environment.apiEndpoint + `/api/checkUsername?username=${username}`, {
            withCredentials: true,
            observe: 'response'
        });
    }
}
