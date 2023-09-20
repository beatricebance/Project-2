import { ElementRef, Injectable, RendererFactory2} from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import { DrawingCommunService } from '../drawing-commun/drawing-commun.service';
import { PenAbstractService } from '../pen-abstract.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends PenAbstractService {
  filter: string;
  constructor(rendererFactory: RendererFactory2,
              protected drawingData: DrawingCommunService ) {
     super(rendererFactory, drawingData);
     this.filter = CONSTANTS.DEFAULT_FILTER;

    }
  draw(event: MouseEvent, container: ElementRef, strokeWidth: string): void {
    if (this.drawingData.beginPath) {
      this.pointString += `${event.offsetX} ${event.offsetY} `;
      this.renderer.setAttribute(this.path, 'd', 'M' + this.pointString + ' h0');
      this.renderer.setAttribute(this.path, 'stroke', this.drawingData.pathStroke);
      this.renderer.setAttribute(this.path, 'fill', 'transparent');
      this.renderer.setAttribute(this.path, 'stroke-width', strokeWidth);
      this.renderer.setAttribute(this.path, 'stroke-linecap', 'round');
      this.renderer.setAttribute(this.path, 'stroke-linejoin', 'round');
      this.renderer.appendChild(container.nativeElement, this.path);
      this.renderer.setAttribute(this.path, 'filter', `url(#${this.filter})`);
    }
  }

  updateFilter(filter: string): void {
    this.filter = filter;
  }

}
