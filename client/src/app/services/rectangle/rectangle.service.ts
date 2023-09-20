import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { Coordinate } from '../commun-interface';
import { DrawingCommunService } from '../drawing-commun/drawing-commun.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleService {
  rect: SVGPathElement;
  rectPath: string;
  renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2,
              protected drawingData: DrawingCommunService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.rectPath = CONSTANTS.EMPTY_STRING;
    this.rect = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    }
    onMouseDown(event: MouseEvent): void {
      this.drawingData.beginPath = true;
      this.drawingData.startCoordinate.x = event.offsetX;
      this.drawingData.startCoordinate.y = event.offsetY;
      this.rect.setAttribute(CONSTANTS.COORDINATE_X, this.drawingData.startCoordinate.x.toString());
      this.rect.setAttribute(CONSTANTS.COORDINATE_Y, this.drawingData.startCoordinate.y.toString());
    }
    onMouseUp(event: MouseEvent, undoRedo: UndoRedoService): void {
      this.drawingData.endCoordinate.x = event.offsetX;
      this.drawingData.endCoordinate.y = event.offsetY;
      this.drawingData.beginPath = false;
      undoRedo.undoPile.push({id: this.drawingData.idGenerator(), element: this.rect.cloneNode(true) as ChildNode, type: 'shape'});
      this.rect = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);

    }

    calculateHeight(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
      return Math.abs(endCoordinate.y - startCoordinate.y);
    }

    calculateWidth(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
      return Math.abs(endCoordinate.x - startCoordinate.x);
    }

    draw(event: MouseEvent, container: ElementRef, strokeWidth: string): void {

      if (this.drawingData.beginPath ) {
        this.drawingData.endCoordinate.x = event.offsetX;
        this.drawingData.endCoordinate.y = event.offsetY;
        const minPerimeter = Math.min(Number(this.rect.getAttribute('height')),
         Number(this.rect.getAttribute('width')));
        this.renderer.setAttribute(this.rect, 'height',
        this.calculateHeight(this.drawingData.startCoordinate, this.drawingData.endCoordinate).toString());
        this.renderer.setAttribute(this.rect, 'width',
         this.calculateWidth(this.drawingData.startCoordinate, this.drawingData.endCoordinate).toString());
        this.renderer.setAttribute(this.rect, 'stroke', this.drawingData.pathStroke);
        this.renderer.setAttribute(this.rect, 'fill', this.drawingData.pathFill);
        this.renderer.setAttribute(this.rect, 'stroke-width', strokeWidth);
        this.renderer.appendChild(container.nativeElement, this.rect);

        this.drawingData.height = (event.shiftKey) ? minPerimeter.toString() : this.rect.getAttribute('height');
        this.drawingData.width = (event.shiftKey) ? minPerimeter.toString() : this.rect.getAttribute('width');

        if ((this.drawingData.startCoordinate.x < this.drawingData.endCoordinate.x) &&
        (this.drawingData.startCoordinate.y < this.drawingData.endCoordinate.y)) {
          this.rectPath = `M ${this.rect.getAttribute(CONSTANTS.COORDINATE_X)}
           ${this.rect.getAttribute(CONSTANTS.COORDINATE_Y)} h ${this.drawingData.width} `;
          this.rectPath += `v ${this.drawingData.height} h -${this.drawingData.width} Z`;

        } else if ((this.drawingData.startCoordinate.x > this.drawingData.endCoordinate.x) &&
        (this.drawingData.startCoordinate.y > this.drawingData.endCoordinate.y)) {
          this.rectPath = `M ${this.rect.getAttribute(CONSTANTS.COORDINATE_X)}
           ${this.rect.getAttribute(CONSTANTS.COORDINATE_Y)} h -${this.drawingData.width} `;
          this.rectPath += `v -${this.drawingData.height} h ${this.drawingData.width} Z`;

        } else if ((this.drawingData.startCoordinate.x > this.drawingData.endCoordinate.x) &&
        (this.drawingData.startCoordinate.y < this.drawingData.endCoordinate.y)) {
          this.rectPath = `M ${this.rect.getAttribute(CONSTANTS.COORDINATE_X)}
           ${this.rect.getAttribute(CONSTANTS.COORDINATE_Y)} h -${this.drawingData.width} `;
          this.rectPath += `v ${this.drawingData.height} h ${this.drawingData.width} Z`;

        } else {
          this.rectPath = `M ${this.rect.getAttribute(CONSTANTS.COORDINATE_X)}
           ${this.rect.getAttribute(CONSTANTS.COORDINATE_Y)} h ${this.drawingData.width} `;
          this.rectPath += `v -${this.drawingData.height} h -${this.drawingData.width} Z`;
        }
        this.renderer.setAttribute(this.rect, 'd', this.rectPath);
      }
    }
}
