import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-count',
  templateUrl: './product-count.component.html',
  styleUrls: ['./product-count.component.scss']
})
export class ProductCountComponent implements OnInit {
  @Input() product: IProduct;
  counter = 1;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.checkCount();
  }

  @Input()
  productCount(status: boolean): void {
    if (status) {
      this.product.count++;
    } else {
      if (this.product.count > 1) {
        this.product.count--;
      }
    }
    this.counter = this.product.count;
    this.orderService.count.next(this.counter);
  }

  private checkCount(): void {
    this.counter = this.product.count;
  }
}
