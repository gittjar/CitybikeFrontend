import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiketripsComponent } from './biketrips.component';

describe('BiketripsComponent', () => {
  let component: BiketripsComponent;
  let fixture: ComponentFixture<BiketripsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiketripsComponent]
    });
    fixture = TestBed.createComponent(BiketripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
