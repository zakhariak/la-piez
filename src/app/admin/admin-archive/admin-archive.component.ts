import { Component, OnInit, TemplateRef } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-archive',
  templateUrl: './admin-archive.component.html',
  styleUrls: ['./admin-archive.component.scss']
})
export class AdminArchiveComponent implements OnInit {
  orders: Array<IOrder> = [];
  oneOrder: IOrder;
  orderID: string;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;


  constructor(private orderService: OrderService,
    private modalService: BsModalService,
    private firecloud: AngularFirestore) { }

  ngOnInit(): void {
    this.getOrders();
    // this.showText();
  }

  // showText(): void {
  //   alert('Тут можна усе що хочеш запхати, ну тобто усе що ніби видалялось або зробити кнопочку "В архів" так як я зробив в admin-orders. Наразі тут тільки чеки');
  // }

  openModal(template: TemplateRef<any>, id: string, bl: boolean): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg modal-dialog-centered' });
    this.getOneOrder(id);
    this.orderID = id;
  }

  openDeleteModal(template: TemplateRef<any>): void {
    this.modalRef2 = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
  }

  private getOrders(): void {
    this.orders = [];
    this.orderService.getFirebaseOrders().subscribe(
      collection => {
        collection.map(order => {
          const data = order.payload.doc.data() as IOrder;
          data.id = order.payload.doc.id;
          if (data.status == 'архів') {
            this.orders.push({ ...data });
          }
        })
      }
    )
  }
  deleteOrder() {
    this.orderService.deleteFirebaseOrder(this.orderID)
      .then(() => this.getOrders())
      .catch((err) => console.log(err));
    this.modalRef2.hide();
    this.modalRef.hide();
  }

  getOneOrder(id: string): void {
    this.oneOrder = null;
    this.firecloud.collection('orders').doc(id).get().subscribe(
      document => {
        const data = document.data() as IOrder;
        data.id = document.id
        this.oneOrder = data;
      }
    );
  }

}
