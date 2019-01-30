import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

export interface IBreadcrumb {
  label: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  public breadcrumbSubject: ReplaySubject<IBreadcrumb[]> = new ReplaySubject(1);
  private breadcrumb: IBreadcrumb[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listenRoutes();
  }

  private listenRoutes(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.breadcrumb = [];
        this.buildBreadcrumb(this.route);
      })
  }

  private buildBreadcrumb(root: ActivatedRoute): void {
    if (!!root.routeConfig) {
      switch (root.routeConfig.path) {
        case 'projects':
          this.breadcrumb.push({ label: `Projects list`, path: `/projects` });
          break;
        case ':project_id':
          const projectInfo = root.snapshot.data.projectInfo;
          this.breadcrumb.push({ label: projectInfo.name, path: `/projects/${projectInfo.short_id}` });
          break;
        case ':project_id/:pinger_id':
          const {pinger, project} = root.snapshot.data.info;
          
          this.breadcrumb.push({ label: project.name, path: `/projects/${root.snapshot.url[0]}` });
          this.breadcrumb.push({ label: pinger.name, path: `/projects/${root.snapshot.url[0]}/${root.snapshot.url[1]}` });
          break;
      }
    }

    if (!!root.firstChild)
      return this.buildBreadcrumb(root.firstChild);

    this.breadcrumbSubject.next(this.breadcrumb);
  }
}
