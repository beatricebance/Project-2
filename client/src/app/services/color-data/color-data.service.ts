import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorDataService {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  top10RecentColors: string[];
  hexColor: string;

  constructor() {
      this.primaryColor = '#FFFF00';
      this.secondaryColor = '#000000';
      this.backgroundColor = '#FFFFFF';
      this.hexColor = '#ffffff';
      this.top10RecentColors = [
          '#0000FF', // blue
          '#DCDCDC', // grey
          '#008000', // green
          '#FF0000', // red
          '#FF00FF', // pink
          '#8B4513', // brown
          '#FFFF00', // yellow
          '#800080', // purple
          '#FFFFFF', // white
          '#000000', // black
          'none',
          ];
  }

  swapingColors(): void {
      const currentPrimaryColor = this.primaryColor;
      this.primaryColor = this.secondaryColor;
      this.secondaryColor = currentPrimaryColor;
  }
}
