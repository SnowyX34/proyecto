import { HttpClient, HttpParams } from '@angular/common/http'; // ¡IMPORTANTE: HttpParams debe estar aquí!
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { ProductAttributes } from '@shared/dto/product.dto';
import { CotizacionItem, CreateQuotationDTO, Quotation, QuotationItemDTO } from '@shared/dto/quotation.dto';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private readonly API_URL = `${environment.endpoint}api/cotizaciones`;
  private readonly PRODUCTS_URL = `${environment.endpoint}api/products`;

  constructor(private http: HttpClient) {}

  addQuotation(data: any): Observable<any> {
    console.log('CotizacionService: Enviando cotización a:', `${this.API_URL}/add`);
    return this.http.post(`${this.API_URL}/add`, data);
  }

  private transformCartItemsToDTO(cartItems: CotizacionItem[]): QuotationItemDTO[] {
    return cartItems.map(item => ({
      productId: item.product_id,
      width: item.ancho,
      height: item.alto,
      quantity: item.cantidad,
      costo_m2: item.costo_m2
    }));
  }

  crearCotizacion(userId: number, cartItems: CotizacionItem[]): Observable<any> {
    const cotizacionDTO: CreateQuotationDTO = {
      userId: userId,
      items: this.transformCartItemsToDTO(cartItems)
    };
    console.log('CotizacionService: DTO final a enviar al backend:', JSON.stringify(cotizacionDTO, null, 2));
    return this.http.post(`${this.API_URL}`, cotizacionDTO);
  }

  getQuotationsByUser(userId: string): Observable<Quotation[]> {
    console.log('CotizacionService: Obteniendo cotizaciones para usuario:', `${this.API_URL}/user/${userId}`);
    return this.http.get<Quotation[]>(`${this.API_URL}/user/${userId}`);
  }

  getQuotationById(id: string): Observable<Quotation> {
    console.log('CotizacionService: Obteniendo cotización por ID:', `${this.API_URL}/${id}`);
    return this.http.get<Quotation>(`${this.API_URL}/${id}`);
  }

  getAllQuotationsAdmin(): Observable<Quotation[]> {
    console.log('CotizacionService: Obteniendo todas las cotizaciones (admin):', `${this.API_URL}/getAdmin`);
    return this.http.get<Quotation[]>(`${this.API_URL}/getAdmin`);
  }

  // ¡ESTA ES LA FUNCIÓN CORREGIDA!
  getProducts(productType?: string): Observable<ProductAttributes[]> { // <-- Ahora acepta un argumento opcional
    console.log('CotizacionService: getProducts llamado con productType:', productType);
    let params = new HttpParams();
    if (productType) {
      params = params.append('productType', productType);
    }
    console.log('CotizacionService: Obteniendo productos de:', this.PRODUCTS_URL, 'con params:', params.toString());
    return this.http.get<ProductAttributes[]>(this.PRODUCTS_URL, { params });
  }

  getProductById(productId: string): Observable<ProductAttributes> {
    console.log('CotizacionService: Obteniendo producto por ID:', `${this.PRODUCTS_URL}/${productId}`);
    return this.http.get<ProductAttributes>(`${this.PRODUCTS_URL}/${productId}`);
  }

  updateQuotation(id: string, cotizacion: Partial<Quotation>): Observable<any> {
    console.log('CotizacionService: Actualizando cotización:', `${this.API_URL}/${id}`);
    return this.http.put(`${this.API_URL}/${id}`, cotizacion);
  }

  deleteQuotation(id: string): Observable<any> {
    console.log('CotizacionService: Eliminando cotización:', `${this.API_URL}/${id}`);
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  searchProducts(term: string): Observable<ProductAttributes[]> {
    console.log('CotizacionService: Buscando productos con término:', term);
    return this.http.get<ProductAttributes[]>(`${this.PRODUCTS_URL}/search?term=${term}`);
  }
}
