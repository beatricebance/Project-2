import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingCommunService } from 'src/app/services/drawing-commun/drawing-commun.service';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { ColorDataService } from '../color-data/color-data.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import {PolygoneConstants} from './polygon-enum';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {
  rect: SVGPathElement;
  polygon: SVGPathElement;
  group: SVGGElement;
  max: number;
  min: number;
  side: number;
  angle: number;
  rectPath: string;
  polyPath: string;
  startDrawing: boolean;
  anglePlacement: number;
  renderer: Renderer2;
  constructor(protected drawingData: DrawingCommunService,
              protected colorData: ColorDataService,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.group = this.renderer.createElement(SvgAttributes.G, SvgAttributes.LINK);
    this.rect = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.polygon = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.max = PolygoneConstants.MAX_VALUE;
    this.min = PolygoneConstants.MIN_VALUE;
    this.side = PolygoneConstants.SIDE;
    this.angle = Math.floor((1 - (2 / this.side)) * PolygoneConstants.ANGLE_PI);
    this.startDrawing = false;
    this.rectPath = CONSTANTS.EMPTY_STRING;
    this.polyPath = CONSTANTS.EMPTY_STRING;
    this.anglePlacement = PolygoneConstants.PLACEMENT;
  }
  onMouseDown(event: MouseEvent): void {
    this.drawingData.startCoordinate.x = event.offsetX;
    this.drawingData.startCoordinate.y = event.offsetY;
    this.startDrawing = true;
  }
  drawRectangle(event: MouseEvent): void {
    this.drawingData.endCoordinate.x = event.offsetX;
    this.drawingData.endCoordinate.y = event.offsetY;
    this.rect = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    const width = Math.abs(event.offsetX - this.drawingData.startCoordinate.x);
    const height = Math.abs(event.offsetY - this.drawingData.startCoordinate.y);
    this.rectPath = '';
    this.polyPath = 'M ';
    if ((this.drawingData.startCoordinate.x < event.offsetX) && (this.drawingData.startCoordinate.y < event.offsetY)) {
      this.rectPath = `M ${this.drawingData.startCoordinate.x} ${this.drawingData.startCoordinate.y} h ${width} `;
      this.rectPath += `v ${height} h -${width} Z`;
    } else if ((this.drawingData.startCoordinate.x > event.offsetX) && (this.drawingData.startCoordinate.y > event.offsetY)) {
      this.rectPath = `M ${this.drawingData.startCoordinate.x} ${this.drawingData.startCoordinate.y} h -${width} `;
      this.rectPath += `v -${height} h ${width} Z`;
    } else if ((this.drawingData.startCoordinate.x > event.offsetX) && (this.drawingData.startCoordinate.y < event.offsetY)) {
      this.rectPath = `M ${this.drawingData.startCoordinate.x} ${this.drawingData.startCoordinate.y} h -${width} `;
      this.rectPath += `v ${height} h ${width} Z`;
    } else {
      this.rectPath = `M ${this.drawingData.startCoordinate.x} ${this.drawingData.startCoordinate.y} h ${width} `;
      this.rectPath += `v -${height} h -${width} Z`;
    }
  }
  drawShape(strokeWidth: string): void {
    const middlePointX = Math.floor((this.drawingData.endCoordinate.x + this.drawingData.startCoordinate.x) / 2);
    const middlePointY = Math.floor((this.drawingData.endCoordinate.y + this.drawingData.startCoordinate.y) / 2);
    const radiusX = Math.abs(this.drawingData.endCoordinate.x - this.drawingData.startCoordinate.x) / 2;
    const radiusY = Math.abs(this.drawingData.endCoordinate.y - this.drawingData.startCoordinate.y) / 2;
    const minPerimeter = Math.min(radiusX, radiusY);
    if (this.side % PolygoneConstants.SIDE_MULTIPLE_3 === 0) {
      this.anglePlacement = PolygoneConstants.DEGREE_MULTIPLE_3;
    } else if (this.side % PolygoneConstants.SIDE_MULTIPLE_4 === 0) {
      this.anglePlacement = PolygoneConstants.DEGREE_MULTIPLE_4;
    } else if (this.side % PolygoneConstants.SIDE_MULTIPLE_5 === 0) {
      this.anglePlacement = PolygoneConstants.DEGREE_MULTIPLE_5;
    } else {
      this.anglePlacement = PolygoneConstants.DEGREE_MULTIPLE_7;
    }
    for (let i = 0; i < this.side; i++) {
      const firstForm = minPerimeter * Math.cos(2 * Math.PI * i / this.side + this.anglePlacement) + middlePointX;
      const secondForm = minPerimeter * Math.sin(2 * Math.PI * i / this.side + this.anglePlacement) + middlePointY;
      this.polyPath += `${firstForm},${secondForm} `;
    }
    this.polyPath += ' Z ';
    this.renderer.setAttribute(this.polygon, 'stroke', this.drawingData.pathStroke);
    this.renderer.setAttribute(this.polygon, 'fill', this.drawingData.pathFill);
    this.renderer.setAttribute(this.polygon, 'stroke-width', strokeWidth);
    this.renderer.setAttribute(this.polygon, 'd', this.polyPath);
  }

  draw(event: MouseEvent, container: ElementRef, strokeWidth: string): void {
    if (this.startDrawing) {
      this.renderer.removeChild(container.nativeElement, this.rect);
      this.renderer.removeAttribute(this.rect, 'd', this.rectPath);
      this.drawRectangle(event);
      this.drawShape(strokeWidth);
      this.renderer.appendChild(this.group, this.polygon);
      this.renderer.setAttribute(this.rect, 'stroke', 'black');
      this.renderer.setAttribute(this.rect, 'fill', 'black');
      this.renderer.setAttribute(this.rect, 'fill-opacity', '0');
      this.renderer.setAttribute(this.rect, 'd', this.rectPath);
      this.renderer.appendChild(this.group, this.rect);
      this.renderer.appendChild(container.nativeElement, this.group);
    }
  }
  onMouseUp(event: MouseEvent, container: ElementRef, strokeWidth: string, undoRedo: UndoRedoService): void {
    this.renderer.removeChild(container.nativeElement, this.group);
    this.renderer.removeChild(container.nativeElement, this.rect);
    this.startDrawing = false;
    this.drawRectangle(event);
    this.drawShape(strokeWidth);
    this.drawingData.endCoordinate.x = event.offsetX;
    this.drawingData.endCoordinate.y = event.offsetY;
    this.renderer.appendChild(container.nativeElement, this.polygon);
    undoRedo.undoPile.push({id: this.drawingData.idGenerator(), element: this.polygon.cloneNode(true) as ChildNode, type: 'shape'});
    this.polygon = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
  }
  updateAngle(side: number): void {
    this.side = side;
    this.angle = Math.floor((1 - (2 / side)) * PolygoneConstants.ANGLE_PI);
  }

}
