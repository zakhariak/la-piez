import { Injectable } from '@angular/core';
import { IDiscount } from '../interfaces/discount.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private arrDiscount: Array<IDiscount> = [];

  private url: string;
  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.url = 'http://localhost:3000/discounts';
  }

  getDiscounts(): Array<IDiscount> {
    return this.arrDiscount;
  }

  addDiscount(discount: IDiscount): void {
    this.arrDiscount.push(discount);
  }

  deleteDiscount(discount: IDiscount): void {
    const index = this.arrDiscount.findIndex(d => d.id === discount.id);
    this.arrDiscount.splice(index, 1);
  }

  updateDiscount(discount: IDiscount): void {
    const index = this.arrDiscount.findIndex(d => d.id === discount.id);
    this.arrDiscount.splice(index, 1, discount);
  }

  getJSONDiscounts(): Observable<Array<IDiscount>> {
    return this.http.get<Array<IDiscount>>(this.url);
  }

  postJSONDiscount(discount: IDiscount): Observable<IDiscount> {
    return this.http.post<IDiscount>(this.url, discount);
  }

  deleteJSONDiscount(id: number | string): Observable<IDiscount> {
    return this.http.delete<IDiscount>(`${this.url}/${id}`);
  }

  updateJSONDiscount(discount: IDiscount): Observable<IDiscount> {
    return this.http.put<IDiscount>(`${this.url}/${discount.id}`, discount);
  }

  getOneJSONDiscount(id: number): Observable<IDiscount> {
    return this.http.get<IDiscount>(`${this.url}/${id}`);
  }

  // -----firebase

  getFirecloudDiscounts(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('discounts').snapshotChanges();
  }

  postFirecloudDiscount(discount: IDiscount): Promise<DocumentReference> {
    return this.firestore.collection('discounts').add(discount);
  }

  deleteFirecloudDiscount(id: string): Promise<void> {
    return this.firestore.collection('discounts').doc(id).delete();
  }

  updateFirecloudDiscount(discount: IDiscount): Promise<void> {
    return this.firestore.collection('discounts').doc(discount.id).update(discount);
  }










}
