import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PushNotificationService {

  constructor(
    private http: HttpClient
  ) { }

  public sendSubscription(subscription: PushSubscription): void {
    this.http.post(`${environment.origin}/notification/subscribe`, {subscription})
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      )
  }
}
