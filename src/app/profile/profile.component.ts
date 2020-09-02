import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IOrder } from '../shared/interfaces/order.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IProduct } from '../shared/interfaces/product.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  modalRef: BsModalRef;
  userOrders: Array<IOrder>;
  oneOrder: IOrder;
  prodArray: Array<IProduct>;
  user: any;
  userEmail: string;
  userID: string;
  userFirstName: string;
  userLastName: string;
  userPhone: string;
  userbDay: string;
  userbMonth: string;
  userbYear: string;



  constructor(private authService: AuthService,
    private fireStore: AngularFirestore,
    private modalService: BsModalService,) { }

  ngOnInit(): void {
    this.getFireUser();
  }

  openModal(template: TemplateRef<any>, id: string): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg modal-dialog-centered' });
    this.getOneOrder(id);
  }

  // private getUserData(): void {
  //   const user = JSON.parse(localStorage.getItem('mainUser'));
  //   this.userEmail = user.email;
  // }

  private getFireUser(): void {
    const user = JSON.parse(localStorage.getItem('mainUser'));
    this.fireStore.collection('users').ref.where('email', '==', user.email).onSnapshot(collection => {
      collection.forEach(doc => {
        const d = doc.data();
        this.user = d;
        this.userFirstName = d.firstName;
        this.userLastName = d.lastName;
        this.userEmail = d.email;
        if (d.phone) { this.userPhone = d.phone };
        if (d.bDay) { this.userbDay = d.bDay };
        if (d.bMonth) { this.userbMonth = d.bMonth };
        if (d.bYear) { this.userbYear = d.bYear };
        this.userID = doc.id;
        this.getFireUserOrders(d);
      })
    });
  }

  private getFireUserOrders(d: object): void {
    this.userOrders = [];
    if (this.user.phone) {
      this.fireStore.collection('orders').ref.where('userPhone', '==', this.user.phone).onSnapshot(collection => {
        collection.forEach(doc => {
          const o = doc.data() as IOrder;
          o.id = doc.id;
          this.userOrders.push({ ...o });
        })
      });
    }
  }

  updateUser(): void {
    this.user.email = this.userEmail;
    this.user.firstName = this.userFirstName;
    this.user.lastName = this.userLastName;
    this.user.phone = this.userPhone;
    this.user.bDay = this.userbDay;
    this.user.bMonth = this.userbMonth;
    this.user.bYear = this.userbYear;
    this.fireStore.collection('users').doc(this.userID).update(this.user);
    this.getFireUserOrders(this.user);
  }

  getOneOrder(id: string): void {
    this.oneOrder = null;
    this.fireStore.collection('orders').doc(id).get().subscribe(
      document => {
        const data = document.data() as IOrder;
        data.id = document.id
        this.oneOrder = data;
        this.prodArray = data.ordersDetails;
      }
    );
  }

  signOut(): void {
    this.authService.signOut();
  }

}
