import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export enum requestState {
  CREATING = 0,
  SENDING = 1,
  SUCCESS = 2,
  FAILED_BY_INTERNET = 3,
  FAILED = 4
}

export interface IProject {
  id: string;
  short_id?: string; //last 12 symbols of id
  name: string;
  origin: string;
  user_id: string;
  accepted_users?: any[];
  count?: number,
  active?: number,
  down?: number,
  paused?: number,
  avgTime?: number
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  public newProjectState: ReplaySubject<{ state: requestState, errors?: any }> = new ReplaySubject(1);
  public removeProjectState: ReplaySubject<{ state: requestState, errors?: any }> = new ReplaySubject(1);
  public editProjectState: ReplaySubject<{ state: requestState, errors?: any }> = new ReplaySubject(1);

  private projectsSubject: ReplaySubject<IProject[]> = new ReplaySubject(1);
  private origin: string = environment.origin;

  constructor(
    private http: HttpClient
  ) { }

  public getList(): Observable<IProject[]> {
    this.loadList();
    return this.projectsSubject.asObservable();
  }

  public createNewProject(name: string, origin: string): void {
    this.newProjectState.next({ state: requestState.SENDING });

    this.http.post(`${this.origin}/project/create`, { name, origin })
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            this.loadList();
            this.newProjectState.next({ state: requestState.SUCCESS });
            return;
          }
        },
        error => {
          if (error.status === 400)
            this.newProjectState.next({ state: requestState.FAILED, errors: error.error['errors'] })
          else
            this.newProjectState.next({ state: requestState.FAILED_BY_INTERNET });
        }
      )
  }

  public getProjectInfo(short_id: string): Observable<IProject> {
    return this.http.get(`${this.origin}/project/${short_id}`)
      .pipe(
        map((result: any) => {
          const data = result.data;
          return <IProject>{
            id: data._id,
            short_id: data._id.substr(-12),
            name: data.name,
            origin: data.origin,
            user_id: data.user_id,
            accepted_users: data.accepted_users
          }
        })
      );
  }

  public removeProject(project_id: string): void {
    this.removeProjectState.next({ state: requestState.SENDING });

    this.http.delete(`${this.origin}/project/${project_id}`)
      .subscribe(
        () => {
          this.loadList();
          this.removeProjectState.next({ state: requestState.SUCCESS });
        },
        error => {
          if (error.status === 400)
            this.removeProjectState.next({ state: requestState.FAILED, errors: error.error['errors'] });
          else
            this.removeProjectState.next({ state: requestState.FAILED_BY_INTERNET });
        }
      )
  }

  public editProject(project_id: string, name: string, origin: string): void {
    this.editProjectState.next({ state: requestState.SENDING });

    this.http.put(`${this.origin}/project/${project_id}`, { name, origin })
      .subscribe(
        () => {
          this.loadList();
          this.editProjectState.next({ state: requestState.SUCCESS });
        },
        error => {
          if (error.status === 400)
            this.editProjectState.next({ state: requestState.FAILED, errors: error.error['errors'] });
          else
            this.editProjectState.next({ state: requestState.FAILED_BY_INTERNET });
        }
      )
  }

  private loadList(): void {
    this.http.get(`${this.origin}/project/list`)
      .pipe(
        map(projects => {
          return projects['data'].map(item => {
            return <IProject>{
              id: item.id,
              short_id: item.id.substr(-12),
              name: item.name,
              origin: item.origin,
              user_id: item.user_id,
              count: item.count,
              active: item.active,
              down: item.down,
              paused: item.paused,
              avgTime: item.avgTime
            }
          })
        })
      )
      .subscribe(
        data => this.projectsSubject.next(data),
        error => console.error(error)
      )
  }
}
