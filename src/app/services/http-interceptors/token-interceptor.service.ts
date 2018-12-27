import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    const HEADERS = new HttpHeaders({
      'Auth-token': !!token ? token : ''
    });

    const _request = req.clone({
      headers: HEADERS
    });

    return next.handle(_request)
    .pipe(
      tap(
        event => {
          
        },
        error => {
          if (error instanceof HttpErrorResponse && error.status == 401) {
            this.authService.logout();
          }
        })
    )
  }
}
