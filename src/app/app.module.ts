import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCountComponent } from './components/product-count/product-count.component';
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
import { SearchPipe } from './shared/pipes/search.pipe';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment.prod';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { loaderConfig } from './preloader-config';
import { ButtonUpComponent } from './components/button-up/button-up.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { AdminArchiveComponent } from './admin/admin-archive/admin-archive.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProductCountComponent,
    HomeComponent,
    BlogComponent,
    AdminComponent,
    AdminCategoryComponent,
    AdminProductsComponent,
    AdminBlogsComponent,
    AdminDiscountComponent,
    AdminOrdersComponent,
    SearchPipe,
    DiscountDetailsComponent,
    PaymentComponent,
    BasketComponent,
    DiscountsComponent,
    ProductComponent,
    ProductDetailsComponent,
    LoginComponent,
    ProfileComponent,
    ButtonUpComponent,
    UploadFileComponent,
    BlogDetailsComponent,
    AdminArchiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgxUiLoaderModule.forRoot(loaderConfig),
    NgxUiLoaderRouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
