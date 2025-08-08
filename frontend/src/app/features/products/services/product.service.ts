// src/app/auth/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '@shared/dto/product.dto';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly myAppUrl: string;
  private readonly myApiUrl: string;

  constructor(private readonly http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'products';
  }

  getAll(): Observable<Products[]> {
    const url = `${this.myAppUrl}${this.myApiUrl}`;
    return this.http.get<Products[]>(url);
  }

  addProductFormData(formData: FormData): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/add`;
    return this.http.post(url, formData);
  }

  updateProduct(product: Products): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/${product.product_id}`;
    return this.http.put(url, product);
  }

  updateProductFormData(id: number, formData: FormData): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/${id}`;
    return this.http.put(url, formData);
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/${id}`;
    return this.http.delete(url);
  }

  getImageUrl(imagePath: string): string {
    
    if (!imagePath) {
      const defaultUrl = `${this.myAppUrl}uploads/default-product.png`;
      return defaultUrl;
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    const finalUrl = `${this.myAppUrl}${cleanPath}`;    
    return finalUrl;
  }
  getByIdProduct(id: string | number): Observable<Products> {
    const url = `${this.myAppUrl}${this.myApiUrl}/${id}`;
    return this.http.get<Products>(url);
  }
}