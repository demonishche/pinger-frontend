import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface IUser {
  username: string,
  email: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo: IUser;

  constructor(private http: HttpClient) { }

  public async getUserInfo(): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      if (!!this.userInfo) {
        resolve(this.userInfo);
        return;
      }

      this.loadUserInfo().subscribe((data: IUser) => resolve(data));
    });
  }

  private loadUserInfo(): Observable<IUser> {
    return this.http.get(`${environment.origin}/user/getInfo`).pipe(
      map(data => {
        this.userInfo = data['data'];
        return data['data'];
      })
    );
  }
}
