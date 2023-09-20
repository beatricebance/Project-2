import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import {Coordinate} from '../commun-interface';
import { DrawingCommunService } from '../drawing-commun/drawing-commun.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class LineService {
  previewLine: SVGPolylineElement;
  circle: SVGCircleElement;
  lineGroup: SVGGElement;
  connectionPoint: string;
  arrayCoordinate: Coordinate[];
  actualCoordinate: Coordinate;
  renderer: Renderer2;
  lastPointX: number;
  lastPointY: number;
  previewLineString: string;
  shiftCoordinate: Coordinate;
  angle: number;
  shiftClick: boolean;
  constructor(rendererFactory: RendererFactory2, protected drawingData: DrawingCommunService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.actualCoordinate = {x: CONSTANTS.START_COORDINATE_X, y: CONSTANTS.START_COORDINATE_Y};
    this.arrayCoordinate = [];
    this.previewLine = this.renderer.createElement(SvgAttributes.POLYLINE, SvgAttributes.LINK);
    this.lineGroup = this.renderer.createElement(SvgAttributes.G , SvgAttributes.LINK);
    this.arrayCoordinate.length = 0;
    this.shiftCoordinate = {x: CONSTANTS.START_COORDINATE_X, y: CONSTANTS.START_COORDINATE_Y};
    this.angle = 0;
    this.shiftClick = false;
   }
   click(event: MouseEvent, id: ElementRef, strokeWidth: string, junctionWidth: string): void {
    this.actualCoordinate = { x: event.offsetX, y: event.offsetY };
    this.updateArray(this.actualCoordinate, id, strokeWidth, junctionWidth);
  }

  updateArray(coordinate: Coordinate, id: ElementRef, strokeWidth: string, junctionWidth: string): void {
    this.arrayCoordinate.push({ x: coordinate.x, y: coordinate.y });
    this.renderer.setAttribute(id.nativeElement, 'points', this.toString());
    this.renderer.setAttribute(this.previewLine, 'stroke', this.drawingData.pathStroke);
    this.renderer.setAttribute(this.previewLine, 'fill', 'transparent');
    this.renderer.setAttribute(this.previewLine, 'stroke-linejoin', 'round');
    this.renderer.setAttribute(this.previewLine, 'stroke-width', strokeWidth);

    this.circle = this.renderer.createElement(SvgAttributes.CIRCLE, SvgAttributes.LINK);
    this.renderer.setAttribute(this.circle, 'cx', `${coordinate.x}`);
    this.renderer.setAttribute(this.circle, 'cy', `${coordinate.y}`);
    this.renderer.setAttribute(this.circle, 'r', junctionWidth);
    this.renderer.setAttribute(this.circle, 'stroke', this.drawingData.pathStroke);
    this.renderer.setAttribute(this.circle, 'fill', this.drawingData.pathStroke);
    this.lineGroup.appendChild(this.previewLine);
    this.lineGroup.appendChild(this.circle);
    this.renderer.appendChild(id.nativeElement, this.lineGroup);
  }

  draw(event: MouseEvent): void {
    if (!this.shiftClick) {
      const size = this.arrayCoordinate.length;
      this.lastPointX = size ? this.arrayCoordinate[size - 1].x : 0;
      this.lastPointY = size ? this.arrayCoordinate[size - 1].y : 0;
      if (this.lastPointX !== 0 && this.lastPointY !== 0) {
        this.previewLineString = `${this.lastPointX}  ${this.lastPointY} ${event.offsetX}  ${event.offsetY}`;
        this.renderer.setAttribute(this.previewLine, 'points', this.toString() + this.previewLineString);
      }
    } else {
      this.drawWithAngle(event);
    }
  }

  toString(): string {
    let result = CONSTANTS.EMPTY_STRING;
    for (const i of this.arrayCoordinate) {
      result += `${i.x}  ${i.y} `;
    }
    return result;
  }

  remove(): string {
    this.arrayCoordinate.pop();
    return this.toString();
  }

  escape(): void {
    this.arrayCoordinate = [];
    this.lineGroup.innerHTML = ' ';
    this.renderer.setAttribute(this.previewLine, 'points', this.remove());
  }

  backspace(): void {
    if (this.arrayCoordinate.length > 2) {
      this.renderer.setAttribute(this.previewLine, 'points', this.remove());
      this.renderer.setAttribute(this.circle, 'cx', this.arrayCoordinate[this.arrayCoordinate.length - 1].x.toString());
      this.renderer.setAttribute(this.circle, 'cy', this.arrayCoordinate[this.arrayCoordinate.length - 1].y.toString());
    }
  }

  doubleClick(event: MouseEvent, undoRedo: UndoRedoService): void {
    this.previewLine = this.renderer.createElement(SvgAttributes.POLYLINE, SvgAttributes.LINK);
    undoRedo.undoPile.push({id: this.drawingData.idGenerator(), element: this.lineGroup.cloneNode(true) as ChildNode,  type: 'line'});
    this.lineGroup = this.renderer.createElement(SvgAttributes.G, SvgAttributes.LINK);
    this.junction(event);
    this.arrayCoordinate = [];
  }

  shiftUp(event: MouseEvent): void {
    this.shiftClick = false;
    this.draw(event);
  }

  shiftDown(event: MouseEvent): void {
    this.shiftClick = true;
    this.drawWithAngle(event);
  }

  calculateAngle(event: MouseEvent): number {
    let coordinate: Coordinate;
    const size = this.arrayCoordinate.length;
    if (size) {
      coordinate = this.arrayCoordinate[size - 1];
      const deltaX = Math.abs(event.offsetX - coordinate.x);
      const deltaY = Math.abs(event.offsetY - coordinate.y);
      this.angle = Math.atan(deltaY / deltaX);
    }
    return this.angle;
  }

  drawWithAngle(event: MouseEvent): void {
    let coordinate: Coordinate = { x: 0, y: 0};
    const size = this.arrayCoordinate.length;
    this.lastPointX = size ? this.arrayCoordinate[size - 1].x : 0;
    this.lastPointY = size ? this.arrayCoordinate[size - 1].y : 0;
    const angle = this.calculateAngle(event);
    const coordinateArray: Coordinate = this.arrayCoordinate[size - 1];

    if (size) {
      if ( angle < Math.PI / CONSTANTS.LINE_DIVIDE_BY_8 ) {
        coordinate.x = event.offsetX;
        coordinate.y = coordinateArray.y;
      } else if ( angle > CONSTANTS.LINE_NUMBER_3 * Math.PI / CONSTANTS.LINE_DIVIDE_BY_8 ) {
        coordinate.x = coordinateArray.x;
        coordinate.y = event.offsetY;
      } else {
        coordinate.x = event.offsetX;
        const deltaX = (event.x - coordinateArray.x);
        const deltaY = (event.y - coordinateArray.y);
        if ( ( deltaX > 0 && deltaY < 0 ) || ( deltaX < 0 && deltaY > 0 ) ) {
          coordinate.y = ( - deltaX + coordinateArray.y );
        } else {
          coordinate.y = ( deltaX + coordinateArray.y );
        }
      }
    }
    coordinate = {x: Math.round(coordinate.x), y: Math.round(coordinate.y) };

    if (this.lastPointX !== 0 && this.lastPointY !== 0) {
      this.previewLineString = `${coordinate.x}  ${coordinate.y} ${this.lastPointX}  ${this.lastPointY}`;
      this.renderer.setAttribute(this.previewLine, 'points', this.toString() + this.previewLineString);
    }
  }

  junction( event: MouseEvent): void {
    const deltaX = this.arrayCoordinate[0].x - event.offsetX;
    const deltaY = this.arrayCoordinate[0].y - event.offsetY;
    if ((( deltaX <= CONSTANTS.LINE_NUMBER_3 && deltaX >= 0) || ( deltaX >= CONSTANTS.LINE_NUMBER_NEGATIVE_3 && deltaX <= 0)) &&
    ( (deltaY <= CONSTANTS.LINE_NUMBER_3 && deltaY >= 0) || (deltaY >= CONSTANTS.LINE_NUMBER_NEGATIVE_3 && deltaY <= 0) ) ) {
      this.lastPointX = this.arrayCoordinate[0].x;
      this.lastPointY = this.arrayCoordinate[0].y;
    }
  }
}
