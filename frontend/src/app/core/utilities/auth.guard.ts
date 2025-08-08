import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  user_Id: number;
  role: string;
  exp: number; // Timestamp de expiración en segundos
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      
      // Verificar si el token ha expirado
      const currentTime = Date.now() / 1000; // Convertir a segundos
      
      if (decoded.exp < currentTime) {
        // Token expirado, limpiar localStorage y redirigir
        console.warn('Token expirado, redirigiendo al login');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        return false;
      }
      
      // Token válido y no expirado
      return true;
      
    } catch (error) {
      // Token inválido o malformado
      console.error('Token inválido:', error);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }
}