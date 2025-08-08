import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { ProductAttributes } from '@shared/dto/product.dto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class ProductsComponent implements OnInit {
  products: ProductAttributes[] = [];
  selectedProductType: string | null = null;
  productTypes: string[] = [
    'Piso Laminado',
    'Pasto Sintético',
    'Persianas',
    'Cortinas',
    'Sheer Elegance',
    'Enrollable',
    'Papel Tapiz',
    'Patio Sintético'
  ];

  selectedProductForModal?: ProductAttributes;
  showAddToCartModal = false;

  constructor(
    private readonly productService: ProductService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAlls(this.selectedProductType || undefined).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Error al cargar productos', 'Error');
      }
    });
  }

  onProductTypeChange(type: string): void {
    if (this.selectedProductType === type) {
      this.selectedProductType = null;
      this.toastr.info('Filtro de categoría eliminado', 'Información');
    } else {
      this.selectedProductType = type;
      this.toastr.success(`Filtrando por: ${type}`, 'Filtro Aplicado');
    }
    this.loadProducts();
  }

  openAddToCart(product: ProductAttributes): void {
    this.selectedProductForModal = product;
    this.showAddToCartModal = true;
  }

  closeAddToCart(): void {
    this.showAddToCartModal = false;
    this.selectedProductForModal = undefined;
  }

  onProductAdded(): void {
    this.toastr.success('Producto agregado al carrito', 'Éxito');
    this.closeAddToCart();
  }
}
