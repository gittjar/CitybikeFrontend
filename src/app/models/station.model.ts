// models/station.model.ts
export interface Station {
    id: number;
    nimi: string;
    osoite: string;
    kaupunki: string; 
    kapasiteet: number;
    x: number;
    y: number;
    kuva: string;
  }