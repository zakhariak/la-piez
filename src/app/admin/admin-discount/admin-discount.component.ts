import { Component, OnInit, TemplateRef } from '@angular/core';
import { DiscountService } from '../../shared/services/discount.service';
import { IDiscount } from 'src/app/shared/interfaces/discount.interface';
import { Discount } from 'src/app/shared/models/discount.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UploadService } from '../../shared/services/upload.service';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent implements OnInit {
  adminDiscount: Array<IDiscount> = [];
  dID: string = '1';
  dTitle: string;
  dText: string;
  dImage: string;
  modalRef: BsModalRef;
  btnAddMessage = 'Add Discount';
  editStatus = false;
  deleteID: string;
  modalDeleteStatus: boolean;

  constructor(private discountService: DiscountService,
    private modalService: BsModalService,
    private afStorage: AngularFireStorage,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    this.getDiscounts();
  }

  openModal(template: TemplateRef<any>): void {
    this.modalDeleteStatus = false;
    this.modalRef = this.modalService.show(template);
  }

  openDeleteModal(template: TemplateRef<any>, id) {
    this.modalDeleteStatus = true;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
    this.deleteID = id;
  }

  // private getDiscounts(): void {
  //   this.discountService.getJSONDiscounts().subscribe(data => {
  //     this.adminDiscount = data;
  //   });
  // }

  // addDiscount(): void {
  //   const newD = new Discount(this.dID, this.dTitle, this.dText, this.dImage);
  //   if (!this.editStatus) {
  //     // if (this.adminDiscount.length > 0) {
  //     //   newD.id = this.adminDiscount.slice(-1)[0].id + 1;
  //     // }
  //     // this.discountService.addDiscount(newD);
  //     delete newD.id;
  //     this.discountService.postJSONDiscount(newD).subscribe(
  //       () => {
  //         this.getDiscounts();
  //       }
  //     );
  //   }
  //   else {
  //     this.discountService.updateJSONDiscount(newD).subscribe(
  //       () => {
  //         this.getDiscounts();
  //       }
  //     );
  //     this.editStatus = false;
  //   }
  //   this.resetForm();
  //   this.modalRef.hide();
  // }

  // deleteDiscount(discount: IDiscount): void {
  //   if (confirm('Are you sure?')) {
  //     this.discountService.deleteJSONDiscount(discount.id).subscribe(
  //       () => {
  //         this.getDiscounts();
  //       }
  //     );
  //   }
  // }

  editDiscount(template: TemplateRef<any>, discount: IDiscount): void {
    this.openModal(template);
    this.dID = discount.id;
    this.dTitle = discount.title;
    this.dText = discount.text;
    this.editStatus = true;
    console.log(discount.image);
    
    this.uploadService.editImage(true, discount.image);
  }

  private resetForm(): void {
    this.dID = '1';
    this.dTitle = '';
    this.dText = '';
    this.uploadService.editImage(false);
  }


  /* ------------------------------------firebase---------------------------------------------- */

  private getDiscounts(): void {
    this.discountService.getFirecloudDiscounts().subscribe(
      collection => {
        this.adminDiscount = collection.map(discount => {
          const data = discount.payload.doc.data() as IDiscount;
          const id = discount.payload.doc.id;
          return { id, ...data }
        })
      }
    )
  }

  addDiscount(): void {
    const img = this.uploadService.getImage();
    const newD = new Discount(this.dID, this.dTitle, this.dText, img);
    if (!this.editStatus) {
      delete newD.id;
      this.discountService.postFirecloudDiscount({ ...newD });
    }
    else {
      this.discountService.updateFirecloudDiscount({ ...newD });
      this.editStatus = false;
    }
    this.resetForm();
    this.modalRef.hide();
  }

  deleteDiscount(): void {
    this.discountService.deleteFirecloudDiscount(this.deleteID);
    this.modalRef.hide()
  }

}
