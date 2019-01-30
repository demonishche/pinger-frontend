import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IProject } from '../projects/projects.service';

export enum requestState {
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
  short_id?: string;
  status: number;
  requests_count: number;
  up_count: number;
  down_count: number;
  up_from: Date;
  avg_time: number;
  down_list?: IDownItem[];
  up_percent: number;
  down_percent: number;
  up_period: String;
}

@Injectable({
  providedIn: 'root'
})
export class PingersService {

  public newPingerState: ReplaySubject<{ state: requestState, errors?: any }> = new ReplaySubject(1);
  public removePingerState: ReplaySubject<{ state: requestState, errors?: any }> = new ReplaySubject(1);
  public editPingerState: ReplaySubject<{ state: requestState, errors?: any }> = new ReplaySubject(1);

  private pingersSubject: ReplaySubject<IPinger[]> = new ReplaySubject(1);
  private origin: string = environment.origin;

  constructor(
    private http: HttpClient
  ) {
    this.newPingerState.next({ state: requestState.CREATING });
  }

  public createNewWebsitePinger(project_id, websiteName, websiteUrl): void {
    this.newPingerState.next({ state: requestState.SENDING });

    this.http.post(`${this.origin}/pinger/create`, { project_id, name: websiteName, url: websiteUrl })
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            this.loadPingersList(project_id);
            this.newPingerState.next({ state: requestState.SUCCESS });
            return;
          }
        },
        error => {
          if (error.status === 400)
            this.newPingerState.next({ state: requestState.FAILED, errors: error.error['errors'] })
          else
            this.newPingerState.next({ state: requestState.FAILED_BY_INTERNET });
        }
      )
  }

  public getPingersList(project_id: string): Observable<IPinger[]> {
    this.loadPingersList(project_id);
    return this.pingersSubject.asObservable();
  }

  public setNewPingerState(state: requestState): void {
    this.newPingerState.next({ state });
  }

  public setPingerStatus(project_id: string, id: string, state: PingerStatus): void {
    let url = '/pinger/start';

    if (state === PingerStatus.PAUSED)
      url = '/pinger/pause';
    this.http.post(this.origin + url, { pinger_id: id })
      .subscribe(
        data => {
          if (data['result'] === 'success')
            this.loadPingersList(project_id);
        },
        error => {
          console.error(error);
        }
      );
  }

  public removePinger(project_id: string, pinger_id: string): void {
    this.removePingerState.next({ state: requestState.SENDING });
    this.http.delete(`${this.origin}/pinger/${project_id}/${pinger_id}`)
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            this.loadPingersList(project_id);
            this.removePingerState.next({ state: requestState.SUCCESS });
            return;
          }
        },
        error => {
          if (error.status === 400)
            this.removePingerState.next({ state: requestState.FAILED, errors: error.error['errors'] })
          else
            this.removePingerState.next({ state: requestState.FAILED_BY_INTERNET });
        }
      );
  }

  public editPinger(project_id: string, id: string, name: string, url: string): void {
    this.editPingerState.next({ state: requestState.SENDING });
    this.http.put(`${this.origin}/pinger/${id}`, { name, url })
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            this.loadPingersList(project_id);
            this.editPingerState.next({ state: requestState.SUCCESS });
            return;
          }
        },
        error => {
          if (error.status === 400)
            this.editPingerState.next({ state: requestState.FAILED, errors: error.error['errors'] })
          else
            this.editPingerState.next({ state: requestState.FAILED_BY_INTERNET });
        }
      );
  }

  public reloadData(project_id): void {
    this.loadPingersList(project_id);
  }

  public getPingerInfo(project_short_id: string, pinger_short_id: string): Observable<{project: IProject, pinger: IPinger}> {
    return this.http.get(`${this.origin}/pinger/${project_short_id}/${pinger_short_id}`)
      .pipe(
        map((result: any) => {
          const data = result.data;
          return <{project: IProject, pinger: IPinger}>{ ...data };
        })
      );
  }

  private loadPingersList(project_id: string): void {
    this.http.get(`${this.origin}/pinger/list/${project_id}`).pipe(
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
        id: item._id,
        short_id: item._id.substr(-12),
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
