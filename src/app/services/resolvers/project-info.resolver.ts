import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectsService, IProject } from '../projects/projects.service';

@Injectable()
export class ProjectInfoResolver implements Resolve<Observable<IProject>> {
  constructor(
    private projectsService: ProjectsService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<IProject> {
    return this.projectsService.getProjectInfo(route.params.project_id);
  }
}