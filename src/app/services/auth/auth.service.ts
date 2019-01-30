import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const AUTH_TOKEN = 'Auth-token';

export enum authState {
  CREATING = 0,
  SENDING = 1,
  SUCCESS = 2,
  FAILED_BY_INTERNET = 3,
  WRONG_CRED = 4
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;
  public authState: ReplaySubject<authState> = new ReplaySubject(1);

  private loginSubject: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private http: HttpClient
  ) {
    this.authState.next(authState.CREATING);
  }

  public login(username: string, password: string) {
    this.authState.next(authState.SENDING);
    console.log(username)
    this.http.post(`${environment.origin}/user/login`, { username, password })
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            this.setToken(data['data']['token']);
            this.isLoggedIn = true;
            this.loginSubject.next(true);
            this.authState.next(authState.SUCCESS);
          } else {
            this.authState.next(authState.WRONG_CRED);
          }
        },
        error => {
          this.authState.next(authState.FAILED_BY_INTERNET);
        });
  }

  public getToken(): string {
    const token = localStorage.getItem(AUTH_TOKEN);
    return !!token ? token : undefined;
  }

  public logout(): void {
    localStorage.removeItem(AUTH_TOKEN);
    this.isLoggedIn = false;
    this.loginSubject.next(false);
  }

  public verifyAuth(): void {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return;
    }

    this.http.post(`${environment.origin}/user/verifyAuth`, { token: token })
      .subscribe(
        data => {
          this.setToken(data['token']);
          this.isLoggedIn = true;
          this.loginSubject.next(true);
        },
        error => {
          console.log(error);
          this.logout();
        }
      );
  }

  public getLoginStatus(): Observable<boolean> {
    return this.loginSubject.asObservable();
  }

  private setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN, token);
  }
}
