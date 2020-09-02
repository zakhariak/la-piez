import { Component, OnInit, TemplateRef } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { IOrder } from '../../shared/interfaces/order.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../../shared/models/order.model';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  adminOrders: Array<IOrder> = [];
  processingOrders: Array<IOrder> = [];
  preparingOrders: Array<IOrder> = [];
  oneOrder: IOrder;

  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  showDetails: boolean;

  deleteProd: boolean = false;
  prodArray: Array<IProduct>
  orderID: string;
  edName: string;
  edPhone: string;
  edCity: string;
  edStreet: string;
  edHouse: string;
  totalPrice: number;

  constructor(private orderService: OrderService,
    private modalService: BsModalService,
    private firecloud: AngularFirestore) { }

  ngOnInit(): void {
    this.getOrders();
    this.checkBasket();
  }

  openModal(template: TemplateRef<any>, id: string, bl: boolean): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg modal-dialog-centered' });
    this.getOneOrder(id);
    this.orderID = id;
    this.showDetails = bl;
  }

  openDeleteModal(template: TemplateRef<any>, bl: boolean, del?: IProduct): void {
    this.modalRef2 = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
    if (bl) {
      this.prodArray.splice(this.prodArray.findIndex(el => el == del), 1);
      this.deleteProd = true;
    }
  }

  openEditModal(template: TemplateRef<any>): void {
    this.modalRef3 = this.modalService.show(template, { class: 'modal-dialog-centered' });
    this.editInfo();
  }

  // private getOrders(): void {
  //   //   // this.ordersService.getOrder().subscribe(
  //   //   //   data => {
  //   //   //     this.adminOrders = data;
  //   //   //   }
  //   //   // );
  //   this.ordersService.getFirebaseOrders().subscribe(
  //     collection => {
  //       this.adminOrders = collection.map(order => {
  //         const data = order.payload.doc.data() as IOrder;
  //         data.id = order.payload.doc.id;
  //         console.log(data.status);
  //         return data
  //       })
  //     }
  //   )
  // }

  private getOrders(): void {
    this.adminOrders = [];
    this.processingOrders = [];
    this.preparingOrders = [];
    this.orderService.getFirebaseOrders().subscribe(
      collection => {
        collection.map(order => {
          const data = order.payload.doc.data() as IOrder;
          data.id = order.payload.doc.id;
          this.adminOrders.push({ ...data });
          if (data.status == 'в обробці') {
            this.processingOrders.push({ ...data });
          } else if (data.status == 'готується') {
            this.preparingOrders.push({ ...data });
          }
        })
      }
    )
  }

  getOneOrder(id: string): void {
    this.oneOrder = null;
    this.firecloud.collection('orders').doc(id).get().subscribe(
      document => {
        const data = document.data() as IOrder;
        data.id = document.id
        this.oneOrder = data;
        this.prodArray = data.ordersDetails;
        this.totalPrice = data.totalPayment;
      }
    );
  }

  deleteOrder() {
    this.orderService.deleteFirebaseOrder(this.orderID)
      .then(() => this.getOrders())
      .catch((err) => console.log(err));
    this.modalRef2.hide();
    this.modalRef.hide();
  }

  editInfo(): void {
    this.edName = this.oneOrder.userName;
    this.edPhone = this.oneOrder.userPhone;
    this.edCity = this.oneOrder.userCity;
    this.edStreet = this.oneOrder.userStreet;
    this.edHouse = this.oneOrder.userHouse;
  }

  saveInfo(): void {
    this.oneOrder.userName = this.edName;
    this.oneOrder.userPhone = this.edPhone;
    this.oneOrder.userCity = this.edCity;
    this.oneOrder.userStreet = this.edStreet;
    this.oneOrder.userHouse = this.edHouse;
    this.modalRef3.hide();
  }

  saveUserOrder(el: any): void {
    if (typeof el === 'string') {
      this.oneOrder.status = el;
      console.log(el, 'string');
    } else if (typeof el === 'object') {
      let sum = 0;
      this.oneOrder.ordersDetails = el;
      this.oneOrder.ordersDetails.forEach(
        el => sum += el.count * el.price)
      this.oneOrder.totalPayment = sum;
    }
    const order = this.oneOrder;
    this.orderService.updateFirebaseOrder({ ...order });
    this.modalRef2.hide();
    this.adminOrders = [];
    this.preparingOrders = [];
    this.processingOrders = [];

  }




  private checkBasket(): void {
    this.orderService.count.subscribe(
      () => {
        this.getTotal();
      }
    );
  }

  private getTotal(): void {
    this.totalPrice = this.oneOrder.ordersDetails.reduce((total, prod) => {
      return total + (prod.price * prod.count);
    }, 0);
  }
}