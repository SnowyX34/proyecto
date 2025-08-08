import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from '@shared/dto/login.dto';
import { ErrorService } from '../../services/error.service';
import { LoginService } from '../../services/login.service';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    user_id: number;
    email: string;
    role: string;
    username: string;
    user_secondName: string;
    avatarUrl: string;
    exp: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
  styleUrls: ['./login.css'],
})

export class Logins implements OnInit {
    email: string = '';
    password: string = '';
    loading: boolean = false;
    userInfo: any = null; 
    
    constructor(
        private readonly toastr: ToastrService,
        private readonly _userService: LoginService,
        private readonly router: Router,
        private readonly _errorService: ErrorService
    ) {}
    
    ngOnInit(): void {
        this.checkExistingToken();
    }
    
    private checkExistingToken(): void {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                const currentTime = Date.now() / 1000;
                
                if (decoded.exp > currentTime) {
                    this.userInfo = decoded; // ✅ Almacenar info del usuario
                    console.log('Token válido encontrado, redirigiendo...');
                    this.redirectBasedOnRole(decoded.role);
                    return;
                } else {
                    console.warn('Token expirado encontrado, limpiando...');
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Token inválido encontrado, limpiando...');
                localStorage.removeItem('token');
            }
        }
    }
    
    private redirectBasedOnRole(role: string): void {
        if (role === 'admin') {
            this.router.navigate(['/Dashboard']);
        } else {
            this.router.navigate(['/Home']);
        }
    }
    
    login() {
        if (this.email === '' || this.password === '') {
            this.toastr.error('Todos los campos son obligatorios', 'Error');
            return;
        }
        
        const user: Login = {
            email: this.email,
            password: this.password,
        };
        
        this.loading = true;
        this._userService.login(user).subscribe({
            next: (response: any) => {
                this.loading = false;
                
                if (response && response.token) {
                    try {
                        const decoded = jwtDecode<TokenPayload>(response.token);
                        const currentTime = Date.now() / 1000;
                        
                        if (decoded.exp > currentTime) {
                            localStorage.removeItem('token');
                            localStorage.setItem('token', response.token);
                            
                            this.userInfo = decoded; // ✅ Almacenar info del usuario
                            console.log('Usuario logueado:', this.userInfo); // ✅ Para debug
                            console.log('Avatar URL:', this.userInfo.avatarUrl); // ✅ Para debug
                            
                            this.redirectBasedOnRole(decoded.role);
                        } else {
                            this.toastr.error('Token expirado recibido del servidor', 'Error');
                        }
                    } catch (error) {
                        console.error('Error al decodificar token:', error);
                        this.toastr.error('Token inválido recibido del servidor', 'Error');
                    }
                } else {
                    this.toastr.error('Token no recibido del servidor', 'Error');
                }
            },
            error: (e: HttpErrorResponse) => {
                this._errorService.msjError(e);
                this.loading = false;
            }
        });
    }
}