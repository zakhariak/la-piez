import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../shared/services/blog.service';
import { IBlog } from '../../shared/interfaces/blog.interface';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  arrayBlogs: Array<IBlog> = [];

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.getBlogs()
  }

  // private getBlogs(): void {
  //   this.blogService.getJSONBlogs().subscribe(data => {
  //     this.arrayBlogs = data
  //   })
  // }

  /* ----------------firebase--------------------- */

  private getBlogs(): void {
    this.blogService.getFirebaseBlogs().subscribe(
      collection => {
        this.arrayBlogs = collection.map(blog => {
          const data = blog.payload.doc.data() as IBlog;
          data.id = blog.payload.doc.id;
          return data
        })
      })
  }
}

