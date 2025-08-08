import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CotizacionService } from '../../../store/services/cotizacion.service'; // Ajusta la ruta si es necesario
import { ProductAttributes } from '@shared/dto/product.dto'; // Asegúrate de que la ruta sea correcta
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';

  constructor(
    private readonly router: Router,
    private readonly cotizacionService: CotizacionService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Puedes añadir lógica de inicialización aquí si es necesario
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.toastr.warning('Por favor, ingresa un término de búsqueda.', 'Advertencia');
      return;
    }

    this.cotizacionService.searchProducts(this.searchTerm).subscribe({
      next: (products) => {
        if (products && products.length > 0) {
          // Si se encuentra al menos un producto, redirigir al primero
          const firstProduct = products[0];
          this.toastr.success(`Producto "${firstProduct.modelo}" encontrado. Redirigiendo...`, 'Éxito');
          // Asumo que la ruta para el detalle del producto es /products/:id
          this.router.navigate(['/products', firstProduct.product_id]);
        } else {
          this.toastr.info('No se encontraron productos con ese término.', 'Sin resultados');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al buscar productos:', error);
        if (error.status === 404) {
          this.toastr.info('No se encontraron productos con ese término.', 'Sin resultados');
        } else {
          this.toastr.error('Error al realizar la búsqueda de productos.', 'Error');
        }
      }
    });
  }
}
