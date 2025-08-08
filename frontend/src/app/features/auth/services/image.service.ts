import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.prod';

export interface ImageUploadResponse {
  url: string;
  filename: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly apiUrl = environment.endpoint; // Ajusta según tu API

  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen al servidor
   * @param file - Archivo de imagen a subir
   * @returns Observable con la respuesta y progreso
   */
  uploadAvatar(file: File): Observable<{progress: number, response?: ImageUploadResponse}> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<ImageUploadResponse>(`${this.apiUrl}upload/`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<ImageUploadResponse>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / (event.total || 1));
            return { progress };
          
          case HttpEventType.Response:
            return { 
              progress: 100, 
              response: event.body as ImageUploadResponse 
            };
          
          default:
            return { progress: 0 };
        }
      })
    );
  }

  /**
   * Valida si el archivo es una imagen válida
   * @param file - Archivo a validar
   * @returns boolean
   */
  validateImageFile(file: File): { isValid: boolean, error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WebP.' 
      };
    }

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'El archivo es demasiado grande. El tamaño máximo es 5MB.' 
      };
    }

    return { isValid: true };
  }

  /**
   * Elimina una imagen del servidor
   * @param filename - Nombre del archivo a eliminar
   * @returns Observable<boolean>
   */
  deleteAvatar(filename: string): Observable<boolean> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/upload/avatar/${filename}`)
      .pipe(
        map(response => response.success)
      );
  }

  /**
   * Redimensiona una imagen en el cliente antes de subirla
   * @param file - Archivo de imagen
   * @param maxWidth - Ancho máximo
   * @param maxHeight - Alto máximo
   * @param quality - Calidad de compresión (0-1)
   * @returns Promise<File>
   */
  resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar la imagen redimensionada
        ctx!.drawImage(img, 0, 0, width, height);

        // Convertir canvas a blob
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Error al redimensionar la imagen'));
          }
        }, file.type, quality);
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }
}