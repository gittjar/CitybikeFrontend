import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FavoriteStation {
  id: number;
  nimi: string;
  kaupunki: string;
  addedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'citybike_favorites';
  private favoritesSubject: BehaviorSubject<FavoriteStation[]>;
  public favorites$: Observable<FavoriteStation[]>;

  constructor() {
    const stored = this.loadFromStorage();
    this.favoritesSubject = new BehaviorSubject<FavoriteStation[]>(stored);
    this.favorites$ = this.favoritesSubject.asObservable();
  }

  private loadFromStorage(): FavoriteStation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  private saveToStorage(favorites: FavoriteStation[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  getFavorites(): FavoriteStation[] {
    return this.favoritesSubject.value;
  }

  isFavorite(stationId: number): boolean {
    return this.favoritesSubject.value.some(fav => fav.id === stationId);
  }

  addFavorite(station: { id: number; nimi: string; kaupunki: string }): void {
    const currentFavorites = this.favoritesSubject.value;
    
    // Check if already exists
    if (this.isFavorite(station.id)) {
      return;
    }

    const newFavorite: FavoriteStation = {
      id: station.id,
      nimi: station.nimi,
      kaupunki: station.kaupunki,
      addedAt: Date.now()
    };

    const updatedFavorites = [...currentFavorites, newFavorite];
    this.favoritesSubject.next(updatedFavorites);
    this.saveToStorage(updatedFavorites);
  }

  removeFavorite(stationId: number): void {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== stationId);
    this.favoritesSubject.next(updatedFavorites);
    this.saveToStorage(updatedFavorites);
  }

  toggleFavorite(station: { id: number; nimi: string; kaupunki: string }): boolean {
    if (this.isFavorite(station.id)) {
      this.removeFavorite(station.id);
      return false;
    } else {
      this.addFavorite(station);
      return true;
    }
  }

  clearAll(): void {
    this.favoritesSubject.next([]);
    this.saveToStorage([]);
  }

  getFavoriteCount(): number {
    return this.favoritesSubject.value.length;
  }
}
