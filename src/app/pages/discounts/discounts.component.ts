import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../shared/services/discount.service';
import { IDiscount } from 'src/app/shared/interfaces/discount.interface';
import { ScrollService } from '../../shared/services/scroll.service';


@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {
  userDiscounts: Array<IDiscount> = [];
  constructor(private discountService: DiscountService,
    private scrollService: ScrollService) { }

  ngOnInit(): void {
    this.getDiscount();
    // this.userJSONDiscounts();
    this.scrollService.scrollUp();
  }

  // private getDiscount(): void {
  //   this.userDiscounts = this.discountService.getDiscounts();
  // }

  // private userJSONDiscounts(): void {
  //   this.discountService.getJSONDiscounts().subscribe(data => {
  //     this.userDiscounts = data;
  //   });
  // }

  /* ------------firebase------------------------------ */

  private getDiscount(): void {
    this.discountService.getFirecloudDiscounts().subscribe(
      collection => {
        this.userDiscounts = collection.map(blog => {
          const data = blog.payload.doc.data() as IDiscount;
          data.id = blog.payload.doc.id;
          return data
        })
      })
  }

}
