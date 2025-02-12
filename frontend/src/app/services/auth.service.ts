import {Injectable} from '@angular/core';
import {Credentials} from '../models/Credentials';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import UserDTO from "@app/dtos/UserDTO";

/**
 * Services specify logic, which is instantiated singularly -> it is shared between components
 * This service handles authorization with the backend
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

    constructor(private http: HttpClient) {
        // Check login status on startup
        this.checkLogin().subscribe();
    }

    /**
     * returns the current login state
     */
    isLoggedIn(): Observable<boolean> {
        return this.isLoggedIn$;
    }

    private setLoginState(newState: boolean): void {
        this.loggedInSubject.next(newState);
    }

    /**
     * retrieves the login state from backend
     */
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

    /**
     * authenticates a user with credentials against backend
     *
     * @param credentials consisting of username and password
     */
    login(credentials: Credentials): Observable<HttpResponse<any>> {
        return this.http.post(environment.apiEndpoint + '/api/login', credentials, {
            withCredentials: true,
            observe: 'response',
            responseType: 'text'
        }).pipe(
            tap((response: HttpResponse<any>): void => {
                if (response.status === 200) { // if request was successful
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

    isValidUsername(username: string): Observable<HttpResponse<any>> {
        return this.http.get(environment.apiEndpoint + `/api/checkUsername?username=${username}`, {
            withCredentials: true,
            observe: 'response'
        });
    }
}
