import { Component, OnInit, OnDestroy } from '@angular/core';
import { CotizacionService } from '../../services/cotizacion.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductAttributes } from '@shared/dto/product.dto'; // <--- Importa ProductAttributes
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CotizacionItem, CreateQuotationDTO } from '@shared/dto/quotation.dto';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.html',
  styleUrls: ['./cart-view.css'],
  standalone: false
})
export class CartViewComponent implements OnInit, OnDestroy {
  productos: ProductAttributes[] = [];
  cartItems: CotizacionItem[] = [];
  newCotizacion: CreateQuotationDTO = { userId: 0, items: [] };
  existingQuotations: any[] = [];
  medidaForm: FormGroup;
  selectedProduct: ProductAttributes | null = null; // <--- Usa ProductAttributes directamente
  isLoggedIn: boolean = false;
  private cartSubscription?: Subscription;
  private authStatusSubscription?: Subscription;

  constructor(
    private readonly cotizacionService: CotizacionService,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly cartService: CartService,
    private readonly router: Router
  ) {
    this.medidaForm = this.fb.group({
      alto: [null, [Validators.required, Validators.min(0.01)]],
      ancho: [null, [Validators.required, Validators.min(0.01)]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      console.log('CartViewComponent: Estado de autenticación cambiado a:', loggedIn);
      if (loggedIn) {
        this.loadExistingQuotations();
      } else {
        this.existingQuotations = [];
        console.log('CartViewComponent: Cotizaciones existentes limpiadas debido a cierre de sesión.');
      }
    });

    this.cartSubscription = this.cartService.getItems().subscribe(items => {
      this.cartItems = items;
    });
    
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.cotizacionService.getProducts().subscribe({
      next: (products) => {
        console.log('CartViewComponent: Productos cargados:', products);
        this.productos = products;
      },
      error: (error: HttpErrorResponse) => {
        console.error('CartViewComponent: Error al cargar productos:', error);
        this.toastr.error('Error al cargar productos', 'Error');
      }
    });
  }

  loadExistingQuotations(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastr.error('No se encontró el usuario para cargar cotizaciones', 'Error');
      this.existingQuotations = [];
      return;
    }
    
    this.cotizacionService.getQuotationsByUser(userId.toString()).subscribe({
      next: (quotations) => {
        console.log('CartViewComponent: Cotizaciones recibidas:', quotations);
        this.existingQuotations = quotations;
      },
      error: (error: HttpErrorResponse) => {
        console.error('CartViewComponent: Error al cargar cotizaciones:', error);
        if (error.status === 401 || error.status === 403) {
          this.handleAuthError('Sesión expirada al cargar cotizaciones. Por favor, inicia sesión nuevamente.');
        } else {
          this.toastr.error('Error al cargar cotizaciones', 'Error');
        }
      }
    });
  }

  agregarAlCarrito() {
    if (!this.selectedProduct) {
      this.toastr.warning('Selecciona un producto', 'Advertencia');
      return;
    }

    if (this.medidaForm.invalid) {
      this.toastr.warning('Completa las medidas y cantidad correctamente', 'Advertencia');
      this.medidaForm.markAllAsTouched();
      return;
    }

    const item: CotizacionItem = {
      product_id: this.selectedProduct.product_id, // <--- ¡CAMBIO CLAVE AQUÍ! Usar product_id
      alto: this.medidaForm.value.alto,
      ancho: this.medidaForm.value.ancho,
      cantidad: this.medidaForm.value.cantidad,
      costo_m2: this.selectedProduct.costo_m2
    };

    this.cartService.addItem(item);
    
    this.medidaForm.reset({ cantidad: 1 });
    this.selectedProduct = null;
    this.toastr.success('Producto agregado al carrito', 'Éxito');
  }

  calcularSubtotal(item: CotizacionItem): number {
    return item.alto * item.ancho * item.costo_m2 * item.cantidad;
  }

  calcularTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + this.calcularSubtotal(item), 0);
  }

  eliminarItem(index: number) {
    this.cartService.removeItem(index);
    this.toastr.info('Producto eliminado del carrito', 'Información');
  }

  getProductName(productId: number): string {
    const product = this.productos.find(p => p.product_id === productId);
    return product?.modelo || 'Producto no encontrado';
  }

  guardarCotizacion() {
    if (!this.authService.isAuthenticated()) {
      this.handleAuthError('Debes iniciar sesión para guardar la cotización.');
      return;
    }

    if (this.authService.isTokenExpired()) {
      this.handleAuthError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (this.cartItems.length === 0) {
      this.toastr.warning('No hay productos en el carrito', 'Advertencia');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.handleAuthError('Error al obtener el ID de usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    this.cotizacionService.crearCotizacion(userId, this.cartItems).subscribe({
      next: (response) => {
        this.toastr.success('Cotización guardada correctamente', 'Éxito');
        this.cartService.clearCart();
        this.loadExistingQuotations();
      },
      error: (error: HttpErrorResponse) => {
        console.error('CartViewComponent: Error al guardar cotización:', error);
        if (error.status === 401 || error.status === 403) {
          this.handleAuthError('Sesión expirada al guardar cotización. Por favor, inicia sesión nuevamente.');
        } else {
          this.toastr.error('Error al guardar la cotización', 'Error');
        }
      }
    });
  }

  limpiarCarrito() {
    this.cartService.clearCart();
    this.toastr.info('Carrito limpiado', 'Información');
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  private handleAuthError(message: string): void {
    this.toastr.error(message, 'Error de Autenticación');
    this.authService.logout();
  }

  getCurrentUserId(): number | null {
    return this.authService.getUserId();
  }

  getCurrentUserRole(): string | null {
    return this.authService.getUserRole();
  }

  refreshAuthStatus(): void {
    this.authService.setLoggedInStatus(this.authService.isAuthenticated());
  }
}
