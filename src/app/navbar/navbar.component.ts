import { Component } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

// add a property to check if the navbar is sticky or not
isSticky = false;

// listen for scroll events on window
@HostListener('window:scroll', ['$event'])
onScroll(event: any) {
  // get the current scroll position
  const scrollTop = event.target.documentElement.scrollTop;
  // check if the scroll position is greater than a certain value
  if (scrollTop > 100) {
    this.isSticky = true;
  } else {
    this.isSticky = false;
  }
}

}
