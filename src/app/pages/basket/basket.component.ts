import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';

import { NgForm } from '@angular/forms';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  month: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  orders: Array<IProduct> = [];
  totalPrice = 0;
  orderID = 1;
  delivery: string = "доставка";
  payment: string = "готівка";
  userName: string;
  userPhone: string;
  userCity: string;
  userStreet: string;
  userHouse: string;
  userComments: string;
  addressForm: boolean = true;




  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getBasket();
    this.getTotal();
    this.checkBasket();
  }

  private getBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      this.orders = JSON.parse(localStorage.getItem('myOrder'));
    }
  }

  private checkBasket(): void {
    this.orderService.count.subscribe(
      () => {
        this.getTotal();
      }
    );
  }

  productCount(product: IProduct, status: boolean): void {
    this.getTotal();
    this.updateBasket();
    this.orderService.basket.next('check');
  }

  private getTotal(): void {
    this.totalPrice = this.orders.reduce((total, prod) => {
      return total + (prod.price * prod.count);
    }, 0);
  }

  private updateBasket(): void {
    localStorage.setItem('myOrder', JSON.stringify(this.orders));
  }

  deleteProduct(product: IProduct): void {
    if (confirm('Are you sure')) {
      const index = this.orders.findIndex(prod => prod.id === product.id);
      this.orders.splice(index, 1);
      this.updateBasket();
      this.getTotal();
      this.orderService.basket.next('check');
    }
  }

  addOrder(form: NgForm): void {
    const d = new Date(Date.now());
    const date = `${d.getDate()} ${this.month[d.getMonth()]}.${d.getFullYear()}`;
    if (!this.addressForm) {
      this.userCity = 'none';
      this.userStreet = 'none';
      this.userHouse = 'none';
    }
    const order = new Order(
      this.orderID,
      form.controls.userName.value,
      form.controls.userPhone.value,
      form.controls.userCity.value,
      form.controls.userStreet.value,
      form.controls.userHouse.value,
      this.orders,
      this.totalPrice,
      date,
      form.controls.userComments.value,
      this.payment,
      this.delivery);
    delete order.id;
    // this.orderService.addOrder(order).subscribe(() => {
    //   this.resetBasket();
    // });
    this.orderService.addFirebaseOrder({ ...order });
    console.log(order);
    this.resetBasket();
  }

  private resetBasket(): void {
    localStorage.removeItem('myOrder');
    this.orders = [];
    this.totalPrice = 0;
    this.orderService.basket.next('check');
  }

  onChange(value): void {
    this.delivery = value;
    if (value == 'самовивіз') {
      this.addressForm = false;
      this.userCity = 'none';
      this.userStreet = 'none';
      this.userHouse = 'none';
    } else {
      this.addressForm = true;
      this.userCity = '';
      this.userStreet = '';
      this.userHouse = '';
    }
  }

  // private checkBasket(): void {
  //   this.orderService.basket.subscribe(
  //     () => {
  //       this.getLocalStorage();
  //     }
  //   );
  // }

  // private getLocalStorage(): void {
  //   if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
  //     this.orders = JSON.parse(localStorage.getItem('myOrder'));
  //     this.totalPrice = this.orders.reduce((total, prod) => {
  //       return total + (prod.price * prod.count);
  //     }, 0);
  //   } else {
  //     this.totalPrice = 0;
  //   }
  // }

}