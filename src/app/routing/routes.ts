import { Routes } from '@angular/router';
import { LoginComponent } from '../public/login/login.component';
import { PingersListComponent } from '../pingers/pingers-list/pingers-list.component';
import { AuthGuard } from '../guards/auth/auth.guard';
import { LoginGuard } from '../guards/login/login.guard';
import { PrivatePageComponent } from '../private/private-page/private-page.component';
import { ProjectsListComponent } from '../projects/projects-list/projects-list.component';
import { ProjectInfoResolver } from '../services/resolvers/project-info.resolver';
import { ErrorsListComponent } from '../pingers/errors-list/errors-list.component';
import { PingerInfoResolver } from '../services/resolvers/pinger-info.resolver';

export const routes: Routes = [
  {path: '', redirectTo: '/projects', pathMatch: 'full'},
  {
    path: 'projects', canActivate: [AuthGuard], component: PrivatePageComponent, children: [
      { path: '', component: ProjectsListComponent },
      { path: ':project_id', component: PingersListComponent, resolve: {projectInfo: ProjectInfoResolver} },
      {path: ':project_id/:pinger_id', component: ErrorsListComponent, resolve: {info: PingerInfoResolver} }
    ]
  },
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
];