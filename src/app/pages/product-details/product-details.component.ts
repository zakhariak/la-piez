import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  category = 'pizza';

  constructor(private prodService: ProductService,
    private orderService: OrderService,
    private actRoute: ActivatedRoute,
    private firecloud: AngularFirestore) { }

  ngOnInit(): void {
    this.getMyProduct();
  }

  // getMyProduct(): void {
  //   const id = +this.actRoute.snapshot.paramMap.get('id');
  //   this.prodService.getOneProduct(id).subscribe(data => {
  //     this.product = data;
  //     this.category = this.product?.category.nameEn;
  //   });
  // }

  addBasket(product: IProduct): void {
    this.orderService.addBasket(product);
    product.count = 1;
  }

  getMyProduct(): void {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.firecloud.collection('products').doc(id).get().subscribe(
      document => {
        const data = document.data() as IProduct;
        data.id = document.id
        this.product = data;
        this.category = document.data().category.nameEn;

      }
    );
  }

}
