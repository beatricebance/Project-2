import { ElementRef, Injectable, RendererFactory2} from '@angular/core';
import {SvgAttributes} from '../../constants/enum';
import { DrawingCommunService } from '../drawing-commun/drawing-commun.service';
import { PenAbstractService } from '../pen-abstract.service';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends PenAbstractService {

  constructor(rendererFactory: RendererFactory2,
              protected drawingData: DrawingCommunService ) {
               super(rendererFactory, drawingData);

              }
  draw(event: MouseEvent, container: ElementRef, strokeWidth: string): void {
    if (this.drawingData.beginPath) {
      this.pointString += `${event.offsetX} ${event.offsetY} `;
      this.renderer.setAttribute(this.path, 'd', 'M' + this.pointString + ' h0');
      this.renderer.setAttribute(this.path, SvgAttributes.STROKE, this.drawingData.pathStroke);
      this.renderer.setAttribute(this.path, SvgAttributes.FILL, SvgAttributes.TRANSPARENT);
      this.renderer.setAttribute(this.path, 'stroke-width', strokeWidth);
      this.renderer.setAttribute(this.path, 'stroke-linecap', 'round');
      this.renderer.setAttribute(this.path, 'stroke-linejoin', 'round');
      this.renderer.appendChild(container.nativeElement, this.path);
    }
  }
}
