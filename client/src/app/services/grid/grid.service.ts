import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingCommunService } from 'src/app/services/drawing-commun/drawing-commun.service';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import * as CONSTANTS from '../../constants/constants';
import {SliderParameters, SvgAttributes} from '../../constants/enum';
import { Coordinate } from '../commun-interface';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private gridElement: SVGPathElement;
  renderer: Renderer2;
  path: string;
  protected click: number;
  protected opacity: string;
  protected arrayCoordinate: Coordinate[];
  constructor(rendererFactory: RendererFactory2,
              protected drawingData: DrawingCommunService,
              public viewDrawingParameter: NewDrawingDataService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.gridElement = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.click = 0;
    this.path = CONSTANTS.EMPTY_STRING;
  }

  remove(container: ElementRef): void {
    this.path = '';
    this.renderer.removeChild(container.nativeElement, this.gridElement);
  }

  grid(container: ElementRef, opacity: number, space: number): void {
    this.path = '';
    for (let i = space; i < this.viewDrawingParameter.svgWidth; i += space) {
      this.path += ` M ${i} ${0} V ${this.viewDrawingParameter.svgHeight}`;
    }
    for (let i = space; i < this.viewDrawingParameter.svgHeight; i += space) {
      this.path += `M ${0} ${i} H ${this.viewDrawingParameter.svgWidth} `;
    }
    this.renderer.setAttribute(this.gridElement, 'd', this.path);
    this.renderer.setAttribute(this.gridElement, 'stroke', 'black');
    this.renderer.setAttribute(this.gridElement, 'stroke-width', '1');
    this.renderer.setAttribute(this.gridElement, 'stroke-opacity', `${opacity}`);
    this.renderer.appendChild(container.nativeElement, this.gridElement);
  }

  reduceSize(container: ElementRef, opacity: number, space: number): void {
    if (this.drawingData.space > SliderParameters.MIN_SLIDER_GRID) {
      this.remove(container);
      this.grid(container, opacity, space);
      this.drawingData.space -= SliderParameters.VALUE;
    }
  }

  increaseSize(container: ElementRef, opacity: number, space: number): void {
    if (this.drawingData.space < SliderParameters.MAX_SLIDER) {
      this.remove(container);
      this.grid(container, opacity, space);
      this.drawingData.space += SliderParameters.VALUE;

    }
  }
}
