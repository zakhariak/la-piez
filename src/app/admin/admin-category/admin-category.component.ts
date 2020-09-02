import { Component, OnInit, TemplateRef } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { ICategory } from '../../shared/interfaces/category.interface';
import { Category } from '../../shared/models/category.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  modalRef: BsModalRef;
  arrayCategories: Array<ICategory> = [];
  id: string;
  nameEN: string;
  nameUA: string;
  modalConfig: boolean;
  deleteID: string;
  searchPlace: number | string;
  sortNumber: boolean;
  sortNameEN: boolean;
  sortNameUA: boolean;


  constructor(private categotyService: CategoryService,
    private firestore: AngularFirestore,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    // this.adminJSONCategories();
    this.adminFirebaseCategories();
  }

  openModal(template: TemplateRef<any>, boolean: boolean) {
    this.modalRef = this.modalService.show(template, boolean ? { class: 'modal modal-dialog-centered' } : { class: 'modal-sm modal-dialog-centered' });
    this.modalConfig = boolean;
  }

  openDeleteModal(template, id) {
    this.openModal(template, false);
    this.deleteID = id;
  }

  // private adminJSONCategories(): void {
  //   this.categotyService.getJSONCategories().subscribe(data => {
  //     this.arrayCategories = data
  //   })
  // }

  // addCategory() {
  //   if (!this.btnDis()) {
  //     const newC = new Category(this.id, this.nameUA, this.nameEN);
  //     delete newC.id;
  //     this.categotyService.postJSONCategory(newC).subscribe(
  //       () => {
  //         this.adminJSONCategories();
  //       }
  //     );
  //     this.modalRef.hide()
  //     this.nameEN = "";
  //     this.nameUA = "";
  //   }
  // }

  // deleteJSONCategory(): void {
  //   this.categotyService.deleteJSONCategory(this.deleteID).subscribe(() => {
  //     this.adminJSONCategories();
  //   })
  //   this.modalRef.hide()
  // }

  clickSort(change: number) {
    let sS: boolean;
    // if (change == 1) {
    //   this.sortNameEN = undefined;
    //   this.sortNameUA = undefined;
    //   this.sortNumber = !this.sortNumber
    //   sS = this.sortNumber;
    // } else
    if (change == 2) {
      this.sortNameUA = undefined;
      this.sortNumber = undefined;
      this.sortNameEN = !this.sortNameEN
      sS = this.sortNameEN;
    } else if (change == 3) {
      this.sortNameEN = undefined;
      this.sortNumber = undefined;
      this.sortNameUA = !this.sortNameUA
      sS = this.sortNameUA;
    }
    // if (sS == undefined) {
    //   return this.arrayCategories
    // } else if (sS) {
    //   return this.arrayCategories.sort((a, b) => (change == 2) ? ((a.nameEn.toLowerCase() > b.nameEn.toLowerCase()) ? 1 : -1) : (change == 3) ? ((a.nameUa.toLowerCase() > b.nameUa.toLowerCase()) ? 1 : -1) : a.id - b.id);
    // } else {
    //   return this.arrayCategories.sort((a, b) => (change == 2) ? ((a.nameEn.toLowerCase() < b.nameEn.toLowerCase()) ? 1 : -1) : (change == 3) ? ((a.nameUa.toLowerCase() < b.nameUa.toLowerCase()) ? 1 : -1) : b.id - a.id);
    // }
    if (sS == undefined) {
      return this.arrayCategories
    } else if (sS) {
      return this.arrayCategories.sort((a, b) => (change == 2) ? ((a.nameEn.toLowerCase() > b.nameEn.toLowerCase()) ? 1 : -1) : ((a.nameUa.toLowerCase() > b.nameUa.toLowerCase()) ? 1 : -1));
    } else {
      return this.arrayCategories.sort((a, b) => (change == 2) ? ((a.nameEn.toLowerCase() < b.nameEn.toLowerCase()) ? 1 : -1) : ((a.nameUa.toLowerCase() < b.nameUa.toLowerCase()) ? 1 : -1));
    }
  }

  btnDis() {
    if (this.nameEN && this.nameUA) {
      return false
    } else {
      return true
    }
  }

  private resetForm(): void {
    // this.categoryID = 1;
    this.nameEN = '';
    this.nameUA = '';
  }

  /* ---------------------------firebase---------------------------------------- */
  private adminFirebaseCategories(): void {
    this.categotyService.getFirecloudCategory().subscribe(
      collection => {
        this.arrayCategories = collection.map(category => {
          const data = category.payload.doc.data() as ICategory;
          const id = category.payload.doc.id;
          return { id, ...data }
        })
      }
    )
  }

  addCategory() {
    if (!this.btnDis()) {
      const newC = new Category(this.id, this.nameUA, this.nameEN);
      delete newC.id;
      this.categotyService.postFirecloudCategory(Object.assign({}, newC)).then(() => {
        console.log('add category');
      });
      this.modalRef.hide();
      this.resetForm();
    }
  }

  deleteCategory(): void {
    this.categotyService.deleteCategory(this.deleteID);
    this.modalRef.hide()
  }


}
