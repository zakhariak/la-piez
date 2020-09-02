import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private image: string;
  editStatus = new Subject<boolean>();

  constructor() { }

  putImage(img: string): void {
    this.image = img
  }

  getImage(): string {
    return this.image
  }

  editImage(bl: boolean, img?: string): void {
    this.editStatus.next(null);
    if (bl) { this.image = img } else { this.image = '' };
    this.editStatus.next(bl);
    console.log(this.image, 'worked service');

  }
}
