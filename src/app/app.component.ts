import { Component } from '@angular/core';
import { ScrollService } from '../../src/app/shared/services/scroll.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'homework7angular';



  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (window.scrollY > 30) {
      document.querySelector('header').style.height = '78px';
    } else {
      document.querySelector('header').style.height = '98px';
    }
  }
}


