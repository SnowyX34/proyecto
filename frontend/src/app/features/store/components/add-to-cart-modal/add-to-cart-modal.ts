import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductAttributes } from '@shared/dto/product.dto';
import { CartService } from '../../services/cart.service';
import { CotizacionItem } from '@shared/dto/quotation.dto';

@Component({
  selector: 'app-add-to-cart-modal',
  templateUrl: './add-to-cart-modal.html',
  styleUrls: ['./add-to-cart-modal.css'],
  standalone: false
})
export class AddToCartModalComponent {
  @Input() isOpen = false;
  @Input() product?: ProductAttributes;
  @Output() close = new EventEmitter<void>();
  @Output() productAdded = new EventEmitter<void>();

  quantity = 1;
  alto = 0.01;
  ancho = 0.01;
  isLoading = false;

  constructor(
    private readonly router: Router,
    private readonly cartService: CartService
  ) { }

  closeModal() {
    this.close.emit();
    this.quantity = 1;
    this.alto = 0.01;
    this.ancho = 0.01;
  }

  addToCart() {
    if (!this.product || this.quantity < 1 || this.alto <= 0 || this.ancho <= 0) {
      console.warn('Datos inválidos para agregar al carrito');
      return;
    }

    this.isLoading = true;

    const item: CotizacionItem = {
      product_id: this.product.product_id,
      alto: this.alto,
      ancho: this.ancho,
      cantidad: this.quantity,
      costo_m2: this.product.costo_m2
    };

    this.cartService.addItem(item);
    this.isLoading = false;

    this.closeModal();
    setTimeout(() => {
      this.productAdded.emit();
      this.router.navigate(['/view']);
    }, 100);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
