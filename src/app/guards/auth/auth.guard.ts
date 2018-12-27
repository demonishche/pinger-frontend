import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  private checkLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.getLoginStatus()
        .subscribe((isLogged: boolean) => {
          resolve(isLogged);
          if (!isLogged)
            this.router.navigateByUrl('/login');
        });
    });
  }
}
