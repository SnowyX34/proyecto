import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorService } from '../../features/auth/services/error.service';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router, private readonly _errorService: ErrorService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('AuthInterceptor: Error Response Headers:', error.headers);
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          this._errorService.msjError(error);
        }

        return throwError(() => error);
      })
    );
  }
}
