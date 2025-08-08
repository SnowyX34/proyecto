import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Asegúrate de importar HttpParams
import { Observable } from 'rxjs';
import { ProductAttributes } from '@shared/dto/product.dto';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly myAppUrl: string;
  private readonly myApiUrl: string;

  constructor(private readonly http: HttpClient) {
    this.myAppUrl = environment.endpoint;
<<<<<<< HEAD
    this.myApiUrl = 'api/products';
=======
    this.myApiUrl = 'products';
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
  }

  // MODIFICADO: Ahora acepta un productType opcional para filtrar
  getAlls(productType?: string): Observable<ProductAttributes[]> {
    const url = `${this.myAppUrl}${this.myApiUrl}`;
    let params = new HttpParams();

    if (productType) {
      params = params.append('productType', productType);
    }

    console.log('ProductService: Obteniendo productos de:', url, 'con params:', params.toString());
    return this.http.get<ProductAttributes[]>(url, { params });
  }
   getAll(): Observable<ProductAttributes[]> {
    const url = `${this.myAppUrl}${this.myApiUrl}`;
    return this.http.get<ProductAttributes[]>(url);
  }

  addProductFormData(formData: FormData): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}/add`;
    return this.http.post(url, formData);
  }

  updateProduct(product: ProductAttributes): Observable<any> {
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
      return 'https://via.placeholder.com/400x300/cccccc/666666?text=Sin+Imagen';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${this.myAppUrl}${cleanPath}`;
  }

  getOptimizedImageUrl(imagePath: string, width: number = 400, height: number = 300): string {
    const baseUrl = this.getImageUrl(imagePath);
    if (baseUrl.includes('cloudinary.com')) {
      return baseUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_webp/`);
    }
    return baseUrl;
  }

  getByIdProduct(id: string | number): Observable<ProductAttributes> {
    const url = `${this.myAppUrl}${this.myApiUrl}/${id}`;
    return this.http.get<ProductAttributes>(url);
  }
}
