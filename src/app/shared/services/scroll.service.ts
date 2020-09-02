import { Injectable } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollUpStatus = new Subject<boolean>();
  constructor(private scroller: ViewportScroller) { }

  scrollUp() {
    window.scroll({ top: 0, behavior: 'smooth' })
  }

  scrollToElement(id: string): void {
    document.getElementById(`${id}`).scrollIntoView({ behavior: "smooth", block: "center" });
  }

  onScroll(event): void {
    (window.scrollY > 100) ? this.scrollUpStatus.next(true) : this.scrollUpStatus.next(false);
  }
}


