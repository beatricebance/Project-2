import { ElementRef, EventEmitter, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingCommunService } from 'src/app/services/drawing-commun/drawing-commun.service';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { ColorDataService } from '../color-data/color-data.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import {AirBrushConstants} from './air-brush-enum';

// https://medium.com/@amcdnl/angular2-long-press-directive-6e257e991a32
// https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly

@Injectable({
  providedIn: 'root'
})
export class AirBrushService {
  airPath: SVGCircleElement;
  radius: number;
  angle: number;
  second: number;
  circleDistance: number;
  x: number;
  y: number;
  drawing: boolean;
  renderer: Renderer2;
  pathStroke: string;
  pathFill: string;
  pressing: boolean;
  longPressing: boolean;
  timeout: NodeJS.Timer ;
  duration: number;
  pointString: string;
  constructor(protected drawingData: DrawingCommunService,
              protected colordata: ColorDataService,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.radius = AirBrushConstants.RADIUS;
    this.drawing = false;
    this.second = AirBrushConstants.SECOND;
    this.circleDistance = AirBrushConstants.CIRCLE_DISTANCE;
    this.x = AirBrushConstants.X_VALUE;
    this.y = AirBrushConstants.Y_VALUE;
    this.duration = AirBrushConstants.DURATION;
    this.airPath = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.pointString = CONSTANTS.EMPTY_STRING;
  }
  onLongPressing: EventEmitter<MouseEvent> = new EventEmitter();
  onLongPressEnd: EventEmitter<boolean> = new EventEmitter();
  get press(): boolean { return this.pressing; }
  get longPress(): boolean { return this.longPressing; }
  loop(event: MouseEvent, container: ElementRef): void {
    this.angle = Math.random() * 2 * Math.PI;
    this.circleDistance = Math.sqrt((Math.random() * this.radius * this.radius));
    this.x = event.offsetX + this.circleDistance * Math.cos(this.angle);
    this.y = event.offsetY + this.circleDistance * Math.sin(this.angle);
    const path = `M ${this.x}, ${this.y} a 1 1 0 1,0 1,0`;
    this.pointString += path;
    if (this.longPressing) {
      this.timeout = setTimeout(() => {
        this.onLongPressing.emit(event);
        this.loop(event, container);
      }, this.duration);
    }
  }
  endPress(): void {
    clearTimeout(this.timeout);
    this.longPressing = false;
    this.pressing = false;
    this.onLongPressEnd.emit(true);
  }
  onMouseDown(event: MouseEvent, container: ElementRef, strokeWidth: number): void {
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.radius = strokeWidth / 2;
    this.pressing = true;
    this.longPressing = false;
    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.loop(event, container);
    }, this.duration);
    this.drawing = true;
    this.angle = Math.random() * 2 * Math.PI;
    this.circleDistance = Math.sqrt((Math.random() * this.radius * this.radius));
    this.x = event.offsetX + this.circleDistance * Math.cos(this.angle);
    this.y = event.offsetY + this.circleDistance * Math.sin(this.angle);
    const path = `M ${this.x}, ${this.y} a 1 1 0 1,0 1,0`;
    this.pointString += path;
  }
  stopDrawing(undoRedo: UndoRedoService): void {
    this.drawing = false;
    this.pointString = CONSTANTS.EMPTY_STRING;
    undoRedo.undoPile.push({id: this.drawingData.idGenerator(), element: this.airPath.cloneNode(true) as ChildNode, type: 'tool'});
    this.airPath = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.endPress();
  }
  draw(event: MouseEvent, container: ElementRef, strokeWidth: number, second: number): void {
    if (this.drawing) {
      if (this.pressing && this.longPressing) {
        this.longPressing = false;
        this.radius = strokeWidth / 2;
        this.timeout = setTimeout(() => {
          this.longPressing = true;
          this.loop(event, container);
        }, this.duration);
      }
      for (let i = 0; i < second; i++) {
        this.angle = Math.random() * 2 * Math.PI; // angle
        const circleDistance = Math.sqrt((Math.random() * this.radius * this.radius));
        this.x = event.offsetX + circleDistance * Math.cos(this.angle);
        this.y = event.offsetY + circleDistance * Math.sin(this.angle);
        const path = `M ${this.x}, ${this.y} a 1 1 0 1,0 1,0 `;
        this.pointString += path;
      }
      this.renderer.setAttribute(this.airPath, 'stroke', this.drawingData.pathStroke);
      this.renderer.setAttribute(this.airPath, 'fill', 'transparent');
      this.renderer.setAttribute(this.airPath, 'd', this.pointString);
      this.renderer.appendChild(container.nativeElement, this.airPath);
    }
  }

}
