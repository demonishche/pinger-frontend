import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PingersService, IPinger } from '../pingers/pingers.service';
import { IProject } from '../projects/projects.service';

@Injectable()
export class PingerInfoResolver implements Resolve<Observable<{project: IProject, pinger: IPinger}>> {
  constructor(
    private pingerService: PingersService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<{project: IProject, pinger: IPinger}> {
    return this.pingerService.getPingerInfo(route.params.project_id, route.params.pinger_id);
  }
}