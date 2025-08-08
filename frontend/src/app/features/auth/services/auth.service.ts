import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs'; // Importa BehaviorSubject
import { CartService } from '../../store/services/cart.service'; // Importa CartService

// Define la interfaz del payload del token con el nombre correcto para el ID
interface TokenPayload {
  user_id: number;
  role?: string;
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject para el estado de autenticación
  // Inicializa con el estado actual de autenticación
  private _isLoggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  isLoggedIn$ = this._isLoggedIn.asObservable(); // Observable público para que los componentes se suscriban

  constructor(private cartService: CartService) { // Inyecta CartService
    // El constructor ya inicializa _isLoggedIn, no es necesario llamar a next() aquí de nuevo.
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('AuthService: isAuthenticated: No hay token.');
      return false;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp > currentTime;
      console.log('AuthService: isAuthenticated: Token decodificado:', decoded, 'Expirado:', !isValid);
      return isValid;
    } catch (error) {
      console.error('AuthService: isAuthenticated: Error al decodificar el token:', error);
      return false;
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('AuthService: getToken: Token de localStorage:', token ? 'Existe' : 'No existe');
    return token;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      console.log('AuthService: getUserId: No hay token para decodificar.');
      return null;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      console.log('AuthService: getUserId: Payload decodificado:', decoded);

      if (decoded.user_id !== undefined && decoded.user_id !== null) {
        console.log('AuthService: getUserId: ID encontrado como user_id:', decoded.user_id);
        return decoded.user_id;
      }

      console.warn('AuthService: getUserId: No se pudo encontrar el ID de usuario en el token decodificado. Se esperaba "user_id".');
      return null;
    } catch (error) {
      console.error('AuthService: getUserId: Error al decodificar el token o extraer ID:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.role || null;
    } catch (error) {
      console.error('AuthService: getUserRole: Error al decodificar el token:', error);
      return null;
    }
  }

  logout(): void {
    console.log('AuthService: Logout: Limpiando token de localStorage.');
    localStorage.removeItem('token');
    this.cartService.clearCartStorage(); // Limpiar el carrito persistente
    this._isLoggedIn.next(false); // Notificar a los suscriptores que el usuario ya no está logueado
    // Opcional: Redirigir al login aquí si no lo hace el interceptor o el guard
    // this.router.navigate(['/login']);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('AuthService: isTokenExpired: No hay token, se considera expirado.');
      return true;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      const expired = decoded.exp < currentTime;
      console.log('AuthService: isTokenExpired: Token expiración:', decoded.exp, 'Tiempo actual:', currentTime, 'Expirado:', expired);
      return expired;
    } catch (error) {
      console.error('AuthService: isTokenExpired: Error al decodificar el token:', error);
      return true;
    }
  }

  // Método para actualizar el estado de login (ej. después de un login exitoso)
  // Este método debe ser llamado por tu componente de login después de un login exitoso.
  setLoggedInStatus(status: boolean): void {
    this._isLoggedIn.next(status);
  }
}
