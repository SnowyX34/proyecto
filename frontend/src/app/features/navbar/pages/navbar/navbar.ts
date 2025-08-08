import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.prod';
import { jwtDecode } from 'jwt-decode';

// ✅ Interfaz para el payload del token
interface TokenPayload {
  user_id: number;
  email: string;
  role: string;
  username: string; // Corresponde a user_name del modelo de backend
  user_secondName: string;
  avatarUrl: string;
  phone_number?: string; // NUEVO: Añadido el número de teléfono
  exp: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  showProfileMenu = false;
  userName = 'Usuario';
  avatarUrl = '';
  userInfo: TokenPayload | null = null;
  userRole: string | null = null; // NUEVO: Para almacenar el rol del usuario

  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();

    // ✅ Opcional: Escuchar cambios en el localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'token') {
        this.checkAuthStatus();
      }
    });
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;

        // ✅ Verificar si el token no ha expirado
        if (decoded.exp > currentTime) {
          this.isLoggedIn = true;
          this.userInfo = decoded;
          this.userName = decoded.username || 'Usuario';
          this.userRole = decoded.role || null; // NUEVO: Asignar el rol

          // ✅ CORRECCIÓN: Construir URL completa para el avatar
          if (decoded.avatarUrl) {
            if (decoded.avatarUrl.startsWith('http')) {
              this.avatarUrl = decoded.avatarUrl;
            } else {
              const cleanEndpoint = environment.endpoint.replace(/\/$/, '');
              const cleanAvatarUrl = decoded.avatarUrl.startsWith('/')
                ? decoded.avatarUrl
                : `/${decoded.avatarUrl}`;
              this.avatarUrl = `${cleanEndpoint}${cleanAvatarUrl}`;
            }
          } else {
            this.avatarUrl = `${environment.endpoint.replace(/\/$/, '')}/uploads/default-user.png`;
          }

          console.log('Usuario logueado:', {
            username: this.userName,
            avatarUrl: this.avatarUrl,
            decodedAvatarUrl: decoded.avatarUrl,
            endpoint: environment.endpoint,
            userInfo: this.userInfo,
            userRole: this.userRole // NUEVO: Log del rol
          });
        } else {
          // ✅ Token expirado, limpiar
          console.warn('Token expirado, cerrando sesión automáticamente');
          this.logout();
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        this.logout();
      }
    } else {
      this.isLoggedIn = false;
      this.userName = 'Usuario';
      this.avatarUrl = '';
      this.userInfo = null;
      this.userRole = null; // NUEVO: Resetear el rol
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.showProfileMenu = false;
    this.userName = 'Usuario';
    this.avatarUrl = '';
    this.userInfo = null;
    this.userRole = null; // NUEVO: Resetear el rol
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  // ✅ Método mejorado para manejar errores de carga de imagen
  onImageError(event: any) {
    console.error('Error cargando imagen del avatar:', {
      originalSrc: event.target.src,
      avatarUrl: this.avatarUrl,
      userInfo: this.userInfo
    });

    const defaultImageUrl = `${environment.endpoint.replace(/\/$/, '')}/uploads/default-user.png`;

    if (event.target.src !== defaultImageUrl) {
      event.target.src = defaultImageUrl;
    } else {
      event.target.style.display = 'none';
      console.error('Imagen por defecto también falló, ocultando avatar');
    }
  }

  // ✅ Método para cerrar el menú al hacer clic fuera
  closeProfileMenu() {
    this.showProfileMenu = false;
  }
}
