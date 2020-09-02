import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { BlogService } from '../../shared/services/blog.service';
import { UploadService } from '../../shared/services/upload.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  uploadProgress: Observable<number>;
  image: string;
  imageStatus: boolean;

  constructor(private fireStorage: AngularFireStorage,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    this.checkEdit();
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const type = file.type.slice(file.type.indexOf('/') + 1);
    const name = file.name.slice(0, file.name.lastIndexOf('.')).toLowerCase();
    const filePath = `images/${name}.${type}`;
    const task = this.fireStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(image => {
      this.fireStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.image = url;
        this.uploadService.putImage(url);
        this.imageStatus = true;
      });
    });
  }

  deleteImage(): void {
    this.imageStatus = false;
  }

  private checkEdit(): void {
    console.log('work');
    this.uploadService.editStatus.subscribe(
      (bl: boolean) => {
        console.log('work 2', bl);
        this.image = this.uploadService.getImage();
        this.imageStatus = bl;
        console.log(this.uploadService.getImage(), bl);
      }
    )
  }


}
