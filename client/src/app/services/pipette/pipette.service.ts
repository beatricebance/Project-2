import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import * as CONSTANTS from '../../constants/constants';
import { ColorDataService } from '../color-data/color-data.service';
import { Coordinate } from '../commun-interface';
import { NewDrawingDataService } from '../new-drawing-data/new-drawing-data.service';

@Injectable({
  providedIn: 'root'
})
export class PipetteService {
  renderer: Renderer2;
  coordinate: Coordinate;
  context: CanvasRenderingContext2D | null;
  hex: string;
  color: string;
  newHex: string;

  constructor(public colorDataService: ColorDataService,
              protected viewdrawingparameter: NewDrawingDataService,
              public rendererFactory: RendererFactory2,
              public eventManager: EventManager) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.coordinate = { x: 0, y: 0 };
    this.color = CONSTANTS.EMPTY_STRING;
    this.newHex = '#000000';
  }

  initializePipette(svg: SVGElement): void {
    this.eventManager.addEventListener(svg as unknown as HTMLElement, 'contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      this.onRightClick(this.color);
    }
    );
  }

  svgToACanvas(container: ElementRef): void {
    const xml = new XMLSerializer().serializeToString(container.nativeElement);
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(xml);
    const img = this.renderer.createElement('img');
    img.setAttribute('height', this.viewdrawingparameter.svgHeight);
    img.setAttribute('width', this.viewdrawingparameter.svgWidth);
    const canvas = this.renderer.createElement('canvas');
    canvas.height = img.height;
    canvas.width = img.width;
    this.context = canvas.getContext('2d');
    img.setAttribute('src', dataUrl);
    img.onload = () => {
      if (this.context !== null) {
        this.context.canvas.width = img.width;
        this.context.canvas.height = img.height;
        this.context.drawImage(img, 0, 0);
      }
    };
  }

  rgbToHex(color: number): string {
    this.hex = (color).toString(CONSTANTS.STRING_CONVERSION);
    if (this.hex.length < 2) {
      this.hex = '0' + this.hex;
    }
    return this.hex;
  }

  getColorAtPosition(coordinate: Coordinate, container: ElementRef): string {
    this.svgToACanvas(container);
    if (this.context !== null) {
      const imageInfo = this.context.getImageData(coordinate.x, coordinate.y, 1, 1).data;
      this.newHex = '#' + this.rgbToHex(imageInfo[0]) + this.rgbToHex(imageInfo[1]) + this.rgbToHex(imageInfo[2]);
      return this.newHex;
    }
    return CONSTANTS.EMPTY_STRING;
  }

  onClick(event: MouseEvent, container: ElementRef): void {
    this.coordinate = { x: event.offsetX, y: event.offsetY };
    const pipetteColor = this.getColorAtPosition(this.coordinate, container);
    if (pipetteColor != null) {
      if (event.button === CONSTANTS.CLICK_LEFT) {
        this.colorDataService.primaryColor = pipetteColor;
      } else if (event.button === CONSTANTS.CLICK_RIGHT) {
        this.onRightClick(pipetteColor);
      }
    }
  }

  onRightClick(pipetteColor: string): void {
    this.colorDataService.secondaryColor = pipetteColor;
  }

}
