import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BlogService } from '../../shared/services/blog.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IBlog } from '../../shared/interfaces/blog.interface';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blog: IBlog;

  constructor(private router: ActivatedRoute,
    private location: Location,
    private firecloud: AngularFirestore) { }

  ngOnInit(): void {
    this.getMyBlog();
  }

  getMyBlog(): void {
    const id = this.router.snapshot.paramMap.get('id');
    console.log(id);
    this.firecloud.collection('blogs').doc(id).get().subscribe(
      document => {
        const data = document.data() as IBlog;
        data.id = document.id
        this.blog = data;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

}
