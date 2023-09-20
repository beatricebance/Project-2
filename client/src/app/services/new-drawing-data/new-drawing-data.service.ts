import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import * as CONSTANTS from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class NewDrawingDataService {
  svgHeight: number;
  svgWidth: number;
  svgColorHexa: string ;
  isOpen: boolean;
  isSpaceCreated: boolean;
  wantToCreateSpace: number;
  imgLink: SafeUrl;
  isAutoSave: boolean;

  constructor() {
    this.svgHeight = 0;
    this.svgWidth = 0;
    this.svgColorHexa = '#ffffff';
    this.isOpen = false;
    this.isSpaceCreated = false;
    this.wantToCreateSpace = 0;
    this.imgLink = CONSTANTS.EMPTY_STRING;
    this.isAutoSave = true;
   }
}
