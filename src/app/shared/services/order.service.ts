import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { IOrder } from '../interfaces/order.interface';
import { AngularFirestore, DocumentReference, DocumentChangeAction } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  basket: Subject<any> = new Subject<any>();
  private url: string;
  count: Subject<number> = new Subject<any>();


  constructor(private http: HttpClient,
    private fireStore: AngularFirestore) {
    this.url = 'http://localhost:3000/orders';
  }

  addBasket(product: IProduct): void {
    let localProducts: Array<IProduct> = [];
    if (localStorage.length > 0 && localStorage.getItem('myOrder')) {
      localProducts = JSON.parse(localStorage.getItem('myOrder'));
      if (localProducts.some(prod => prod.id === product.id)) {
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += +product.count;
      }
      else {
        localProducts.push(product);
      }
    }
    else {
      localProducts.push(product);
    }
    localStorage.setItem('myOrder', JSON.stringify(localProducts));
    this.basket.next(localProducts);
  }

  addOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.url, order);
  }

  getOrder(): Observable<Array<IOrder>> {
    return this.http.get<Array<IOrder>>(this.url);
  }

  updateOrder(order: IOrder): Observable<IOrder> {
    return this.http.put<IOrder>(`${this.url}/${order.id}`, order);
  }

  /* ----------------------------firebase------------------------- */

  getFirebaseOrders(): Observable<DocumentChangeAction<unknown>[]> {
    return this.fireStore.collection('orders').snapshotChanges();
  }

  addFirebaseOrder(order: IOrder): Promise<DocumentReference> {
    return this.fireStore.collection('orders').add(order);
  }

  deleteFirebaseOrder(id: string): Promise<void> {
    return this.fireStore.collection('orders').doc(id).delete();
  }

  updateFirebaseOrder(order: IOrder) {
    return this.fireStore.collection('orders').doc(order.id).update(order);
  }
}
