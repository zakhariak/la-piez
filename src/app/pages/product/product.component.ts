import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { OrderService } from 'src/app/shared/services/order.service';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Array<IProduct> = [];
  category: string;

  constructor(private prodService: ProductService,
    private orderService: OrderService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private firecloud: AngularFirestore) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const categoryName = this.actRoute.snapshot.paramMap.get('category');
        this.getProducts(categoryName);
      }
    });
  }

  ngOnInit(): void {
  }

  // private getProducts(categoryName: string = 'pizza'): void {
  //   this.prodService.getCategoryProduct(categoryName).subscribe(data => {
  //     this.products = data;
  //     this.category = this.products[0]?.category.nameUa;
  //   });
  //   this.scrollService.scrollUp();
  // }

  productCount(product: IProduct, status: boolean): void {
    if (status) {
      product.count++;
    }
    else {
      if (product.count > 1) {
        product.count--;
      }
    }
  }

  addBasket(product: IProduct): void {
    let localProducts: Array<IProduct> = [];
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      localProducts = JSON.parse(localStorage.getItem('myOrder'));
      if (localProducts.some(prod => prod.id === product.id)) {
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += product.count;
      }
      else {
        localProducts.push(product);
      }
    }
    else {
      localProducts.push(product);
    }
    localStorage.setItem('myOrder', JSON.stringify(localProducts));
    this.orderService.basket.next('qqqq');
    product.count = 1;
  }

  /* --------------------------firebase--------------------------------- */

  private getProducts(categoryName: string = 'pizza'): void {
    this.products = [];
    this.firecloud.collection('products').ref.where('category.nameEn', '==', categoryName).onSnapshot(
      collection => {
        collection.forEach(document => {
          const data = document.data() as IProduct;
          const id = document.id;
          this.products.push({ id, ...data });
        });
        this.category = this.products[0]?.category.nameUa;
      }
    );
  }
}
