import { Component, OnInit, TemplateRef } from '@angular/core';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { Product } from 'src/app/shared/models/product.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ScrollService } from '../../shared/services/scroll.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  modalRef: BsModalRef;
  categories: Array<ICategory> = [];
  categoryName: string;
  adminProduct: Array<IProduct> = [];
  productID = '1';
  productCategory: ICategory = { id: '1', nameEn: 'pizza', nameUa: 'піца' };
  productNameEN: string;
  productNameUA: string;
  productDescription: string;
  productWeight: string;
  productPrice: number;
  productCount: number = 1;
  productImage: string;
  imageStatus: boolean;
  uploadProgress: Observable<number>;
  deleteID: string;
  editStatus: boolean = false;
  ngId: number;

  constructor(private catService: CategoryService,
    private prodService: ProductService,
    private afStorage: AngularFireStorage,
    private modalService: BsModalService,
    private scrollService: ScrollService,
    private scroller: ViewportScroller) { }

  ngOnInit(): void {
    // this.getCategories();
    this.getFirebaseCategories();
    // this.getProducts();
    this.getFirebaseproducts();
  }

  openDeleteModal(template: TemplateRef<any>, id) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
    this.deleteID = id;
  }

  // private getCategories(): void {
  //   this.catService.getJSONCategories().subscribe(data => {
  //     this.categories = data;
  //   });
  // }

  // private getProducts(): void {
  //   this.prodService.getJSONProducts().subscribe(data => {
  //     this.adminProduct = data;
  //   });
  // }

  // addProduct(): void {
  //   const product: IProduct = new Product(
  //     this.productID,
  //     this.productCategory,
  //     this.productNameEN,
  //     this.productNameUA,
  //     this.productDescription,
  //     this.productWeight,
  //     this.productPrice,
  //     this.productImage);
  //   if (!this.editStatus) {
  //     delete product.id;
  //     this.prodService.postJSONProduct(product).subscribe(
  //       () => {
  //         this.getProducts();
  //       }
  //     )
  //   } else {
  //     this.prodService.updateJSONProduct(product).subscribe(
  //       () => {
  //         this.getProducts();
  //       });
  //     this.showElem(product.id);
  //     this.scrollService.scrollToElement(product.id);
  //     this.editStatus = false;
  //   }
  //   this.resetForm();
  // }

  setCategory(): void {
    this.productCategory = this.categories.filter(cat => cat.nameEn === this.categoryName)[0];
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const type = file.type.slice(file.type.indexOf('/') + 1);
    const name = file.name.slice(0, file.name.lastIndexOf('.')).toLowerCase();
    const filePath = `images/${name}.${type}`;
    const task = this.afStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(image => {
      this.afStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.productImage = url;
        this.imageStatus = true;
      });
    });
  }

  // deleteJSONProduct(): void {
  //   this.prodService.deleteJSONProduct(this.deleteID).subscribe(() => {
  //     this.getProducts();
  //   })
  //   this.modalRef.hide()
  // }

  editProduct(prod: IProduct): void {
    this.productID = prod.id;
    this.productCategory = prod.category;
    this.productNameEN = prod.nameEN;
    this.productNameUA = prod.nameUA;
    this.productDescription = prod.description;
    this.productWeight = prod.weight;
    this.productPrice = prod.price;
    this.imageStatus = true;
    this.productImage = prod.image;
    this.editStatus = true;
    this.scrollService.scrollUp();
  }

  deleteImage(): void {
    this.imageStatus = false;
  }

  private resetForm(): void {
    this.productID = '';
    this.productNameEN = "";
    this.productNameUA = "";
    this.productDescription = "";
    this.productWeight = "";
    this.productPrice = null;
    this.imageStatus = false;
  }

  private showElem(id: number) {
    this.ngId = id;
    setTimeout(() => {
      this.ngId = null
    }, 2000)
  }


  /* -------------------------------firebase--------------------------------------- */
  private getFirebaseCategories(): void {
    this.catService.getFirecloudCategory().subscribe(
      collection => {
        this.categories = collection.map(category => {
          const data = category.payload.doc.data() as ICategory;
          const id = category.payload.doc.id;
          return { id, ...data }
        })
      }
    )
  }

  addProduct(): void {
    const product: IProduct = new Product(
      this.productID,
      this.productCategory,
      this.productNameEN,
      this.productNameUA,
      this.productDescription,
      this.productWeight,
      this.productPrice,
      this.productImage);
    if (!this.editStatus) {
      delete product.id;
      this.prodService.postFirecloudProduct({ ...product })
        .then(mes => console.log(mes))
        .catch(err => console.log(err));
    } else {
      this.prodService.updateFirecloudProduct({ ...product })
        .then(mes => console.log(mes))
        .catch(err => console.log(err));;
      this.showElem(+product.id);
      this.scrollService.scrollToElement(product.id);
      this.editStatus = false;
    }
    this.resetForm();
  }

  private getFirebaseproducts(): void {
    this.prodService.getFirecloudProduct().subscribe(
      collection => {
        this.adminProduct = collection.map(category => {
          const data = category.payload.doc.data() as IProduct;
          const id = category.payload.doc.id;
          return { id, ...data }
        })
      }
    )
  }

  deleteProduct(): void {
    this.prodService.deleteFirecloudProduct(this.deleteID);
    this.modalRef.hide()
  }
}

