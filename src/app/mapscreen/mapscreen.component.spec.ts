import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapscreenComponent } from './mapscreen.component';

describe('MapscreenComponent', () => {
  let component: MapscreenComponent;
  let fixture: ComponentFixture<MapscreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapscreenComponent]
    });
    fixture = TestBed.createComponent(MapscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
