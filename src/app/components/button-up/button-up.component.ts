import { Component, OnInit, HostListener } from '@angular/core';
import { ScrollService } from '../../shared/services/scroll.service';

@Component({
  selector: 'app-button-up',
  templateUrl: './button-up.component.html',
  styleUrls: ['./button-up.component.scss']
})
export class ButtonUpComponent implements OnInit {
  scroll: boolean;
  constructor(private scrollService: ScrollService) { }

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', ['$event'])
  private checkUp(event): void {
    this.scrollService.onScroll(event);
  }

  getScroll(): void {
    this.scrollService.scrollUp();
  }

  private checkScroll(): void {
    this.scrollService.scrollUpStatus.subscribe(
      (bl) => {
        this.scroll = bl;
      }
    );
  }

  //потрібно для роботи в інших компонентах
  // @HostListener('window:scroll', ['$event'])
  // private checkUp(event): void {
  //   this.scrollService.onScroll(event);
  // }

}
