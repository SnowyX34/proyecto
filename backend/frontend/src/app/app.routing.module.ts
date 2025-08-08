import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Logins } from './features/auth/pages/login/login'; 
import { SignInComponent } from './features/auth/pages/register/register'; 
import { HomeComponent } from './features/home/pages/home/home'; 
import { AdminProductsComponent } from './features/products/pages/products/products'; 
import { AuthGuard } from './core/utilities/auth.guard';
import { ProductsComponent } from './features/store/pages/home-page/home-page';
import { AdminQuotationsViewComponent } from './features/store/components/admin-quotations-view/admin-quotations-view';
import { CartViewComponent } from './features/store/components/cart-view/cart-view';


const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'login', component: Logins },
  { path: 'signIn', component: SignInComponent },
  { path: 'Dashboard', component: AdminProductsComponent},
  { path: 'Products', component: ProductsComponent},
  { path: 'Quotations', component: AdminQuotationsViewComponent},
  { path: 'view', component: CartViewComponent},
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: '**', redirectTo: 'Home', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
