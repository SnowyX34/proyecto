import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductAttributes } from '@shared/dto/product.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
  standalone: false
})
export class ProductCardComponent {
  @Input() product!: ProductAttributes;
  @Output() openAddToCart = new EventEmitter<ProductAttributes>();

  constructor(private router: Router) {}

  getImageUrl(imgUrl: string): string {
    return imgUrl || 'https://via.placeholder.com/400x300/cccccc/666666?text=Sin+Imagen';
  }

  openAddToCartModal(event: Event) {
    event.stopPropagation();
    this.openAddToCart.emit(this.product);
  }

  onProductClick(): void {
    this.router.navigate(['/products', this.product.product_id]);
  }
}
