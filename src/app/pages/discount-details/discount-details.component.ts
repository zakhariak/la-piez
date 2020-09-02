import { Component, OnInit } from '@angular/core';
import { DiscountService } from 'src/app/shared/services/discount.service';
import { IDiscount } from 'src/app/shared/interfaces/discount.interface';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-discount-details',
  templateUrl: './discount-details.component.html',
  styleUrls: ['./discount-details.component.scss']
})
export class DiscountDetailsComponent implements OnInit {
  discount: IDiscount;
  constructor(private discountService: DiscountService,
    private router: ActivatedRoute,
    private location: Location,
    private firecloud: AngularFirestore) { }

  ngOnInit(): void {
    this.getMyDiscount();
  }

  // getMyDiscount(): void {
  //   const id = +this.router.snapshot.paramMap.get('id');
  //   this.discountService.getOneJSONDiscount(id).subscribe(
  //     data => {
  //       this.discount = data;
  //     }
  //   );
  // }

  getMyDiscount(): void {
    const id = this.router.snapshot.paramMap.get('id');
    console.log(id);
    this.firecloud.collection('discounts').doc(id).get().subscribe(
      document => {
        const data = document.data() as IDiscount;
        data.id = document.id
        this.discount = data;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
