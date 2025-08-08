import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { Register } from '@shared/dto/register.dto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly myAppUrl: string;
  private readonly myApiUrl: string;

  constructor(private readonly http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'users/register'
  }

  signIn(user: Register, avatarFile?: File): Observable<any> {
    const formData = new FormData();
    
    // Agregar todos los campos del usuario
    formData.append('user_name', user.user_name);
    formData.append('user_secondName', user.user_secondName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('phone_number', user.phone_number);
    formData.append('role', user.role);
    
    // Agregar el archivo si existe
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, formData);
  }
}