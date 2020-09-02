import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { BasketComponent } from './pages/basket/basket.component';
import { DiscountsComponent } from './pages/discounts/discounts.component';
import { DiscountDetailsComponent } from './pages/discount-details/discount-details.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminBlogsComponent } from './admin/admin-blogs/admin-blogs.component';
import { AdminDiscountComponent } from './admin/admin-discount/admin-discount.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminArchiveComponent } from './admin/admin-archive/admin-archive.component';

import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuard } from './shared/guards/profile.guard';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailsComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'discounts', component: DiscountsComponent },
  { path: 'discounts/:id', component: DiscountDetailsComponent },
  { path: 'menu/:category', component: ProductComponent },
  { path: 'menu/:category/:id', component: ProductDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'category', pathMatch: 'full' },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'blogs', component: AdminBlogsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'discounts', component: AdminDiscountComponent },
      { path: 'archive', component: AdminArchiveComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
