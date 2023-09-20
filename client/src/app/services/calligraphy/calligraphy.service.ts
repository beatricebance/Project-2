import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SvgAttributes } from 'src/app/constants/enum';
import { ViewParameters } from '../../components/drawing-view/drawing-view-data';
import * as CONSTANTS from '../../constants/constants';
import { Coordinate } from '../commun-interface';
import { DrawingCommunService } from '../drawing-commun/drawing-commun.service';
import { PolygoneConstants } from '../polygon/polygon-enum';

@Injectable({
  providedIn: 'root'
})
export class CalligraphyService {
  private calligraphy: Element;
  private preview: Element;
  renderer: Renderer2;
  private click: boolean;
  private lastPoints: Coordinate[];
  private linePath: string;
  params: ViewParameters = new ViewParameters();
  constructor(rendererFactory: RendererFactory2, protected drawingData: DrawingCommunService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.preview = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.renderer.setAttribute(this.preview, SvgAttributes.FILL, SvgAttributes.TRANSPARENT);
    this.lastPoints = [{x: 0, y: 0}, {x: 0, y: 0}];
    this.linePath = CONSTANTS.EMPTY_STRING;
  }

  onMouseDown(event: MouseEvent, container: ElementRef, angle: number, lineSize: number): void {
    this.click = true;
    this.calligraphy = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    const currentPoint: Coordinate[] = this.rotate(event, angle, lineSize);
    this.lastPoints[0] = currentPoint[0];
    this.lastPoints[1] = currentPoint[1];
    this.linePath += `M ${this.lastPoints[0].x} ${this.lastPoints[0].y} L ${this.lastPoints[1].x} ${this.lastPoints[1].y}`;
    this.renderer.setAttribute(this.calligraphy, SvgAttributes.STROKE, this.drawingData.pathStroke);
    this.renderer.setAttribute(this.calligraphy, SvgAttributes.FILL, SvgAttributes.TRANSPARENT);
    this.renderer.setAttribute(this.calligraphy, SvgAttributes.STROKE_WIDTH, '2');
    this.renderer.setAttribute(this.calligraphy, CONSTANTS.AIR_PATH_D, this.linePath);
    this.renderer.appendChild(container.nativeElement, this.calligraphy);
  }

  onMouseUp(): void {
    this.click = false;
    this.linePath = CONSTANTS.EMPTY_STRING;
  }

  onMouseMove(event: MouseEvent, container: ElementRef, angle: number, lineSize: number): void {
    if (this.click) {
      this.setPath(event, container, angle, lineSize);
      const currentPoint: Coordinate[] = this.rotate(event, angle, lineSize);
      this.lastPoints[0] = currentPoint[0];
      this.lastPoints[1] = currentPoint[1];
      this.linePath += `M ${currentPoint[0].x} ${currentPoint[0].y} L ${currentPoint[1].x }  ${currentPoint[1].y}`;
      this.renderer.setAttribute(this.calligraphy, SvgAttributes.STROKE, this.drawingData.pathStroke);
      this.renderer.setAttribute(this.calligraphy, CONSTANTS.AIR_PATH_D, this.linePath);
      this.renderer.appendChild(container.nativeElement, this.calligraphy);
    }
  }

  setPath(event: MouseEvent, container: ElementRef, angle: number, lineSize: number): void {
    const currentPoint: Coordinate[] = this.rotate(event, angle, lineSize);
    const path = `M ${currentPoint[0].x} ${currentPoint[0].y} L ${currentPoint[1].x} ${currentPoint[1].y} Z`;
    this.renderer.setAttribute(this.preview, CONSTANTS.AIR_PATH_D, path);
    this.renderer.appendChild(container.nativeElement, this.preview);
  }

  rotate(event: MouseEvent, angle: number, lineSize: number ): Coordinate[] {
    const angleToRad = (angle * Math.PI) / PolygoneConstants.ANGLE_PI;
    const deltaX = angleToRad !== Math.PI / 2 &&
    angleToRad !== (CONSTANTS.CALLIGRAPHY_MULTIPLE_3 * Math.PI) / CONSTANTS.CALLIGRAPHY_MULTIPLE_4 ?
    (CONSTANTS.CALLIGRAPHY_ANGLE_15 / 2) * Math.cos (angleToRad) : 0;
    const deltaY = angleToRad !== Math.PI  && angleToRad !== 0 ? (CONSTANTS.CALLIGRAPHY_ANGLE_15 / 2)  * Math.sin (angleToRad) : 0;
    const firstPoint: Coordinate = {x: event.offsetX + deltaX + lineSize, y: event.offsetY - deltaY};
    const secondPoint: Coordinate = {x: event.offsetX - deltaX , y: event.offsetY + deltaY + lineSize};
    return [firstPoint, secondPoint];
  }
}
