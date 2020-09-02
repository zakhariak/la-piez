import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../interfaces/product.interface';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.url = 'http://localhost:3000/products';
  }

  getJSONProducts(): Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(this.url)
  }

  postJSONProduct(prod: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.url, prod)
  }

  deleteJSONProduct(id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.url}/${id}`)
  }

  getCategoryProduct(name: string): Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(`${this.url}?category.nameEn=${name}`);
  }

  getOneProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.url}/${id}`);
  }

  updateJSONProduct(prod: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.url}/${prod.id}`, prod)
  }
  
  /* --------------------------Firebase------------------------------- */

  getFirecloudProduct(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('products').snapshotChanges();
  }

  postFirecloudProduct(product: IProduct): Promise<DocumentReference> {
    return this.firestore.collection('products').add(product);
  }

  deleteFirecloudProduct(id: string): Promise<void> {
    return this.firestore.collection('products').doc(id).delete();
  }

  updateFirecloudProduct(product: IProduct): Promise<void> {
    return this.firestore.collection('products').doc(product.id.toString()).update(product);
  }

}
