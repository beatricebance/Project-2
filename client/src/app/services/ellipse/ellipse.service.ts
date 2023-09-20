import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingCommunService } from 'src/app/services/drawing-commun/drawing-commun.service';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import {Coordinate} from '../commun-interface';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
@Injectable({
  providedIn: 'root'
})
export class EllipseService {
  ellipse: SVGEllipseElement;
  ellipsePath: string;
  renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2, protected drawingData: DrawingCommunService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.ellipsePath = CONSTANTS.EMPTY_STRING;
    this.ellipse = this.renderer.createElement(SvgAttributes.ELLIPSE, SvgAttributes.LINK);
  }

  onMouseDown(event: MouseEvent): void {
    this.drawingData.beginPath = true;
    this.drawingData.startCoordinate.x = event.offsetX;
    this.drawingData.startCoordinate.y = event.offsetY;
    this.ellipse.setAttribute(CONSTANTS.COORDINATE_X, this.drawingData.startCoordinate.x.toString());
    this.ellipse.setAttribute(CONSTANTS.COORDINATE_Y, this.drawingData.startCoordinate.y.toString());
  }

  onMouseUp(event: MouseEvent, undoRedo: UndoRedoService): void {
    this.drawingData.endCoordinate.x = event.offsetX;
    this.drawingData.endCoordinate.y = event.offsetY;
    this.drawingData.beginPath = false;
    undoRedo.undoPile.push({id: this.drawingData.idGenerator(), element: this.ellipse.cloneNode(true) as ChildNode,  type: 'ellipse'});
    this.ellipse = this.renderer.createElement(SvgAttributes.ELLIPSE, SvgAttributes.LINK);
  }

 calculateRadiusX(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
  return Math.abs((endCoordinate.x - startCoordinate.x) / 2);
 }

 calculateRadiusY(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
  return Math.abs((endCoordinate.y - startCoordinate.y) / 2);
 }
  draw(event: MouseEvent, container: ElementRef, strokeWidth: string): void {

    if (this.drawingData.beginPath ) {
      this.drawingData.endCoordinate.x = event.offsetX;
      this.drawingData.endCoordinate.y = event.offsetY;

      this.renderer.setAttribute(this.ellipse, SvgAttributes.STROKE, this.drawingData.pathStroke);
      this.renderer.setAttribute(this.ellipse, SvgAttributes.FILL, this.drawingData.pathFill);
      this.renderer.setAttribute(this.ellipse, 'stroke-width', strokeWidth);
      this.renderer.appendChild(container.nativeElement, this.ellipse);

      this.drawingData.radiusX = this.calculateRadiusX(this.drawingData.startCoordinate, this.drawingData.endCoordinate);
      this.drawingData.radiusY = this.calculateRadiusY(this.drawingData.startCoordinate, this.drawingData.endCoordinate);

      if (event.shiftKey) {
        const maxSameRadius = Math.max(Number(this.drawingData.radiusX), Number(this.drawingData.radiusY));
        this.drawingData.radiusX = maxSameRadius;
        this.drawingData.radiusY = maxSameRadius;
      }
      let cx = 0;
      let cy = 0;
      if ((this.drawingData.startCoordinate.x < this.drawingData.endCoordinate.x) &&
        (this.drawingData.startCoordinate.y < this.drawingData.endCoordinate.y)) {
        cx = this.drawingData.startCoordinate.x + this.drawingData.radiusX;
        cy = this.drawingData.startCoordinate.y + this.drawingData.radiusY;
      } else if ((this.drawingData.startCoordinate.x > this.drawingData.endCoordinate.x) &&
        (this.drawingData.startCoordinate.y > this.drawingData.endCoordinate.y)) {
        cx = this.drawingData.startCoordinate.x - this.drawingData.radiusX;
        cy = this.drawingData.startCoordinate.y - this.drawingData.radiusY;
      } else if ((this.drawingData.startCoordinate.x > this.drawingData.endCoordinate.x) &&
        (this.drawingData.startCoordinate.y < this.drawingData.endCoordinate.y)) {
        cx = this.drawingData.startCoordinate.x - this.drawingData.radiusX;
        cy = this.drawingData.startCoordinate.y + this.drawingData.radiusY;
      } else {
        cx = this.drawingData.startCoordinate.x + this.drawingData.radiusX;
        cy = this.drawingData.startCoordinate.y - this.drawingData.radiusY;
      }
      this.renderer.setAttribute(this.ellipse, 'cx', cx.toString());
      this.renderer.setAttribute(this.ellipse, 'cy', cy.toString());
      this.renderer.setAttribute(this.ellipse, 'rx', this.drawingData.radiusX.toString());
      this.renderer.setAttribute(this.ellipse, 'ry', this.drawingData.radiusY.toString());
    }
  }
}
