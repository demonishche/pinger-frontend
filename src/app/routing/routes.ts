import { Routes } from '@angular/router';
import { LoginComponent } from '../public/login/login.component';
import { PingersListComponent } from '../private/pingers-list/pingers-list.component';
import { AuthGuard } from '../guards/auth/auth.guard';
import { LoginGuard } from '../guards/login/login.guard';
import { PrivatePageComponent } from '../private/private-page/private-page.component';

export const routes: Routes = [
  {
    path: 'cabinet', canActivate: [AuthGuard], component: PrivatePageComponent, children: [
      { path: '', component: PingersListComponent }
    ]
  },
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
];