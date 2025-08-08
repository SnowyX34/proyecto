import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from '../app/app'; 
import { Logins } from './features/auth/pages/login/login';
import { SignInComponent } from './features/auth/pages/register/register'; 
import { HomeComponent } from './features/home/pages/home/home'; 
import { RouterModule } from '@angular/router';
import { AdminProductsComponent } from './features/products/pages/products/products'; 

import { AddTokenInterceptor } from '../app/core/utilities/add-token.interceptor';
import { Navbar } from './features/navbar/pages/navbar/navbar'; 
import { ProductCardComponent } from './features/store/components/product-card/product-card';
import { CartViewComponent } from './features/store/components/cart-view/cart-view';
import { AddToCartModalComponent } from './features/store/components/add-to-cart-modal/add-to-cart-modal';
import { AdminQuotationsViewComponent } from './features/store/components/admin-quotations-view/admin-quotations-view';
import { ProductsComponent } from './features/store/pages/home-page/home-page';
@NgModule({
  declarations: [
    AppComponent,
    Logins,
    SignInComponent,
    HomeComponent,
    Navbar,
    AdminProductsComponent,
    ProductCardComponent,
    CartViewComponent,
    AddToCartModalComponent,
    AdminQuotationsViewComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        timeOut: 3000,
        preventDuplicates: true
    }),
    CommonModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    Reactive
],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }
  ],
})
export class AppModule {}
