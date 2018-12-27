import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export enum newPingerState {
  CREATING = 0,
  SENDING = 1,
  SUCCESS = 2,
  FAILED_BY_INTERNET = 3,
  FAILED = 4
}

export enum PingerStatus {
  UNDEFINED = 0,
  UP = 1,
  DOWN = 2,
  PAUSED = 3
}

export interface IDownItem {
  error: string;
  time_from: Date;
  time_to: Date;
  message: string;
}

export interface IPinger {
  name: string;
  url: string;
  id: string;
  status: number;
  requests_count: number;
  up_count: number;
  down_count: number;
  up_from: Date;
  avg_time: number;
  down_list: IDownItem[];
  up_percent: number;
  down_percent: number;
  up_period: String;
}

@Injectable({
  providedIn: 'root'
})
export class PingersService {

  public newPingerState: ReplaySubject<{ state: newPingerState, errors?: any }> = new ReplaySubject(1);
  public removePingerState: ReplaySubject<{ state: newPingerState, errors?: any }> = new ReplaySubject(1);

  private pingersSubject: ReplaySubject<IPinger[]> = new ReplaySubject(1);

  constructor(
    private http: HttpClient
  ) {
    this.newPingerState.next({ state: newPingerState.CREATING });
  }

  public createNewWebsitePinger(websiteName, websiteUrl): void {
    this.newPingerState.next({ state: newPingerState.SENDING });

    this.http.post('http://localhost:8080/pinger/create', { name: websiteName, url: websiteUrl })
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            this.loadPigersList();
            this.newPingerState.next({ state: newPingerState.SUCCESS });
            return;
          }

          this.newPingerState.next({ state: newPingerState.FAILED, errors: data['errors'] })
        },
        error => {
          console.error(error);
          this.newPingerState.next({ state: newPingerState.FAILED_BY_INTERNET });
        }
      )
  }

  public getPingersList(): Observable<IPinger[]> {
    this.loadPigersList();
    return this.pingersSubject.asObservable();
  }

  public setNewPingerState(state: newPingerState): void {
    this.newPingerState.next({ state });
  }

  public setPingerStatus(id: string, state: PingerStatus): void {
    let url = 'http://localhost:8080/pinger/start';

    if (state === PingerStatus.PAUSED)
      url = 'http://localhost:8080/pinger/pause';
    this.http.post(url, { pinger_id: id })
      .subscribe(
        data => {
          if (data['result'] === 'success')
            this.loadPigersList();
        },
        error => {
          console.error(error);
        }
      );
  }

  public removePinger(id: string): void {
    this.removePingerState.next({ state: newPingerState.SENDING});
    this.http.delete(`http://localhost:8080/pinger/${id}`)
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            this.loadPigersList();
            this.removePingerState.next({ state: newPingerState.SUCCESS });
            return;
          }

          this.removePingerState.next({ state: newPingerState.FAILED_BY_INTERNET});
        },
        error => {
          console.error(error);
          this.removePingerState.next({ state: newPingerState.FAILED_BY_INTERNET});
        }
      );
  }

  public reloadData(): void {
    this.loadPigersList();
  }

  private loadPigersList(): void {
    this.http.get('http://localhost:8080/pinger/list').pipe(
      map(data => {
        const pingers: IPinger[] = this.modifyData(data['data']);
        return pingers;
      })
    ).subscribe(
      data => this.pingersSubject.next(data),
      error => console.error(error)
    );
  }

  private modifyData(data): IPinger[] {
    return data.map(item => {
      this.parseUpPeriod(item.up_from);

      return {
        ...item,
        avg_time: !!item.avg_time ? item.avg_time.toFixed(2) : '---',
        up_percent: (item.requests_count !== 0) ? (item.up_count / item.requests_count * 100).toFixed(2) : '0.00',
        down_percent: (item.requests_count !== 0) ? (item.down_count / item.requests_count * 100).toFixed(2) : '0.00',
        up_period: this.parseUpPeriod(item.up_from)
      }
    });
  }

  private parseUpPeriod(from: Date): string {
    let result = '';
    const diff: Date = new Date(Date.now() - new Date(from).getTime());
    if (diff.getUTCFullYear() - 1970 !== 0) {
      result = diff.getUTCFullYear() - 1970 + 'Y ';
    }
    if (diff.getUTCMonth() !== 0) {
      result += diff.getUTCMonth() + 'M ';
    }
    if (diff.getUTCDate() - 1 !== 0) {
      result += diff.getUTCDate() - 1 + 'D ';
    }
    if (diff.getUTCHours() !== 0) {
      result += diff.getUTCHours() + 'h ';
    }
    if (diff.getUTCMinutes() !== 0) {
      result += diff.getUTCMinutes() + 'm ';
    }
    if (diff.getUTCSeconds() !== 0) {
      result += diff.getUTCSeconds() + 's';
    }

    return result;
  }
}
