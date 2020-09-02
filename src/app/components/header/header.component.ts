import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';
import { FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private basket: Array<IProduct> = [];
  totalPrice = 0;
  loginForm: FormGroup;
  modalRef: BsModalRef;

  userEmail: string;
  userPassword: string;
  firstName: string;
  lastName: string;

  switch: boolean;

  statusLogin: boolean;
  urlName: string;
  menuName: string;

  constructor(private ordService: OrderService,
    private authService: AuthService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.checkBasket();
    this.getLocalStorage();
    this.checkUser();
    this.updateCheckUser();
    // this.checkCounter();
  }

  private checkBasket(): void {
    this.ordService.basket.subscribe(
      () => {
        this.getLocalStorage();
      }
    );
  }

  private getLocalStorage(): void {
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      this.basket = JSON.parse(localStorage.getItem('myOrder'));
      this.getTotal();
    } else {
      this.totalPrice = 0;
    }
  }

  private getTotal(): void {
    this.totalPrice = this.basket.reduce((total, prod) => {
      return total + (prod.price * prod.count);
    }, 0);
  }


  loginModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  registerUser(): void {
    this.authService.signUp(this.userEmail, this.userPassword, this.firstName, this.lastName);
    this.modalRef.hide();
    this.resetForm();
  }

  switchForm(): void {
    this.switch = !this.switch;
  }

  private updateCheckUser(): void {
    this.authService.userStatusChanges.subscribe(
      () => {
        this.checkUser();
      }
    );
  }

  loginUser(): void {
    this.authService.signIn(this.userEmail, this.userPassword);
    this.modalRef.hide();
    this.resetForm();
  }

  private checkUser(): void {
    const user = JSON.parse(localStorage.getItem('mainUser'));
    if (user != null) {
      if (user.role === 'admin') {
        this.urlName = 'admin';
        this.menuName = 'адмін';
        this.statusLogin = true;
      }
      else if (user.role === 'user') {
        this.urlName = 'profile';
        this.menuName = 'кабінет';
        this.statusLogin = true;
      }
    }
    else {
      this.statusLogin = false;
      this.urlName = '';
      this.menuName = '';
    }
  }

  private resetForm(): void {
    this.userEmail = '';
    this.userPassword = '';
    this.firstName = '';
    this.lastName = '';
    this.switch = false;
  }

}