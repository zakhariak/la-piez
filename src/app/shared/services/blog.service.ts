import { Injectable } from '@angular/core';
import { IBlog } from '../interfaces/blog.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class BlogService {
  private url: string;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.url = 'http://localhost:3000/blogs';
  }

  getJSONBlogs(): Observable<Array<IBlog>> {
    return this.http.get<Array<IBlog>>(this.url)
  }

  postJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.post<IBlog>(this.url, blog)
  }

  deleteJSONBlog(id: number): Observable<IBlog> {
    return this.http.delete<IBlog>(`${this.url}/${id}`)
  }

  updateJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.put<IBlog>(`${this.url}/${blog.id}`, blog)
  }

  // ------------------------firebase---------------------------


  getFirebaseBlogs(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('blogs').snapshotChanges();
  }

  postFirebaseBlog(blog: IBlog): Promise<DocumentReference> {
    console.log('firebase 1');
    return this.firestore.collection('blogs').add(blog);
  }

  deleteFirebaseBlog(id: string): Promise<void> {
    return this.firestore.collection('blogs').doc(id).delete();
  }

  updateFirebaseBlog(blog: IBlog): Promise<void> {
    return this.firestore.collection('blogs').doc(blog.id).update(blog);
  }
}
