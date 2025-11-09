import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { FavoritesService, FavoriteStation } from '../favorites.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isSticky = false;
  isMenuOpen = false;
  showFavorites = false;
  favorites: FavoriteStation[] = [];
  favoriteCount = 0;

  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
      this.favoriteCount = favorites.length;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollTop = event.target.documentElement.scrollTop;
    this.isSticky = scrollTop > 100;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleFavoritesDropdown() {
    this.showFavorites = !this.showFavorites;
  }

  goToStation(stationId: number) {
    this.showFavorites = false;
    this.router.navigate(['/station-details', stationId]);
  }

  removeFavorite(stationId: number, event: Event) {
    event.stopPropagation();
    this.favoritesService.removeFavorite(stationId);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.favorites-dropdown-container')) {
      this.showFavorites = false;
    }
  }
}