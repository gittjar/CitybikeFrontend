import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  cards = [
    {
      image: '../../assets/images/IMG_3190.WEBP',
      title: 'Asemat kartalla',
      description: 'Näe kaikki asemat kartalla.',
      link: '/mapscreen',
      linkText: 'Asemat kartalla'
    },
    {
      image: '../../assets/images/IMG_3191.WEBP',
      title: 'Asemat listalla',
      description: 'Katso asemat listana.',
      link: '/stations-list',
      linkText: 'Asemat listalla'
    },
    {
      image: '../../assets/images/IMG_3192.WEBP',
      title: 'Pyörämatkat',
      description: 'Tutustu pyörämatkoihin.',
      link: '/biketrips',
      linkText: 'Pyörämatkat'
    }
  ];

  activeCardIndex = 0;

  ngOnInit() {
    this.startCardRotation();
  }

  startCardRotation() {
    setInterval(() => {
      this.activeCardIndex = (this.activeCardIndex + 1) % this.cards.length;
    }, 4000); // Change card every 4 seconds
  }
}