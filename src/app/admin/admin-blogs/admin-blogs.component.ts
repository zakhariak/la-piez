import { Component, OnInit, TemplateRef } from '@angular/core';
import { BlogService } from '../../shared/services/blog.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { IBlog } from '../../shared/interfaces/blog.interface';
import { Blog } from '../../shared/models/blog.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UploadService } from '../../shared/services/upload.service';


@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.scss']
})
export class AdminBlogsComponent implements OnInit {
  modalRef: BsModalRef;
  arrayBlogs: Array<IBlog> = [];
  id: string;
  title: string;
  text: string;
  author: string;
  editStatus: boolean = false;
  month: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  alert: boolean = false;
  ngId: string;
  deleteID: string;


  constructor(private blogService: BlogService,
    private scrollService: ScrollService,
    private fireStorage: AngularFireStorage,
    private modalService: BsModalService,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    this.getBlogs()
  }

  openDeleteModal(template: TemplateRef<any>, id) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
    this.deleteID = id;
  }

  // private getJSONBlogs(): void {
  //   this.blogService.getJSONBlogs().subscribe(data => {
  //     this.arrayBlogs = data
  //   })
  // }

  // addJSONBlog(): void {
  //   this.alert = false;
  //   if (this.title && this.text && this.author) {
  //     const d = new Date();
  //     let date = `${this.month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  //     const newB = new Blog(this.id, this.title, this.text, date, this.author, this.image)
  //     if (!this.editStatus) {
  //       delete newB.id;
  //       this.blogService.postJSONBlog(newB).subscribe(
  //         () => {
  //           this.getJSONBlogs()
  //         }
  //       )
  //     } else {
  //       this.blogService.updateJSONBlog(newB).subscribe(
  //         () => {
  //           this.getJSONBlogs();
  //         }
  //       )
  //       this.scrollService.scrollToElement(this.id);
  //       this.showElem(this.id);
  //       this.editStatus = false;
  //     }
  //     this.resetForm()
  //   } else {
  //     this.alert = true;
  //   }
  // }



  // deleteJSONBlog(blog: IBlog): void {
  //   this.blogService.deleteJSONBlog(blog.id).subscribe(() => {
  //     this.getJSONBlogs();
  //   })
  // }

  editBlog(blog: IBlog): void {
    this.id = blog.id;
    this.title = blog.title;
    this.text = blog.text;
    this.author = blog.author;
    this.editStatus = true;
    this.scrollService.scrollUp()
    this.uploadService.editImage(true, blog.image);
  }

  private resetForm() {
    this.title = '';
    this.text = '';
    this.author = '';
    this.uploadService.editImage(false);
  }

  private showElem(id: string) {
    this.ngId = id;
    setTimeout(() => {
      this.ngId = null
    }, 2000)
  }

  /* -------------------firebase-------------------------------- */

  getBlogs(): void {
    this.blogService.getFirebaseBlogs().subscribe(
      collection => {
        this.arrayBlogs = collection.map(blog => {
          const data = blog.payload.doc.data() as IBlog;
          data.id = blog.payload.doc.id;
          return data
        })
      }
    )
  }

  addBlog(): void {
    this.alert = false;
    if (this.title && this.text && this.author) {
      const d = new Date();
      const date = `${this.month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      const img = this.uploadService.getImage();
      const newB = new Blog(this.id, this.title, this.text, date, this.author, img);
      if (!this.editStatus) {
        delete newB.id;
        this.blogService.postFirebaseBlog({ ...newB });
      } else {
        this.blogService.updateFirebaseBlog({ ...newB });;
        this.scrollService.scrollToElement(this.id);
        this.showElem(this.id);
        this.editStatus = false;
      }
      this.resetForm()
    } else {
      this.alert = true;
    }
  }

  deleteBlog(blog: IBlog): void {
    this.blogService.deleteFirebaseBlog(blog.id);
  }
}
