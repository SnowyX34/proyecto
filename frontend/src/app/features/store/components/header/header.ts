// // header.component.ts (ACTUALIZADO)
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { CartService } from '../../services/cart.service';

// @Component({
//   selector: 'app-header',
//   templateUrl: './header.html',
//   styleUrls: ['./header.css'],
//   standalone: false
// })
// export class HeaderComponent implements OnInit, OnDestroy {
//   searchTerm: string = '';
//   cartItemCount: number = 0;
  
//   private destroy$ = new Subject<void>();

//   constructor(
//     private router: Router,
//     private cartService: CartService
//   ) {}

//   ngOnInit(): void {
//     // Suscribirse al contador del carrito
//     this.cartService.getCartItemCount()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(count => {
//         this.cartItemCount = count;
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   onSearch(): void {
//     if (this.searchTerm.trim()) {
//       this.router.navigate(['/products'], { 
//         queryParams: { search: this.searchTerm.trim() } 
//       });
//     }
//   }

//   openCart(): void {
//     this.router.navigate(['/cart']);
//   }

//   login(): void {
//     this.router.navigate(['/login']);
//   }

//   navigateToHome(): void {
//     this.router.navigate(['/']);
//   }

//   navigateToCategories(): void {
//     this.router.navigate(['/categories']);
//   }

//   navigateToOffers(): void {
//     this.router.navigate(['/offers']);
//   }

//   navigateToContact(): void {
//     this.router.navigate(['/contact']);
//   }
// }