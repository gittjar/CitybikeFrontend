import { Component } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSticky = false;
  isMenuOpen = false;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollTop = event.target.documentElement.scrollTop;
    this.isSticky = scrollTop > 100;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}