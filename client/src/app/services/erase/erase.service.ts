import * as core from '@angular/core';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { DrawingCommunService } from '../drawing-commun/drawing-commun.service';

@core.Injectable({
  providedIn: 'root'
})
export class EraseService {
  eraseElement: Element;
  protected erase2: Element;
  renderer: core.Renderer2;
  protected click: boolean;
  eraseMap: Map<Element, string>;
  private oldEraseMap: Map<Element, string>;
  protected undoRedo: UndoRedoService;
  constructor(rendererFactory: core.RendererFactory2, protected undoRedoService: UndoRedoService,
              protected drawingData: DrawingCommunService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.click = false;
    this.eraseElement = this.renderer.createElement(SvgAttributes.RECT, SvgAttributes.LINK);
    this.erase2 = this.renderer.createElement(SvgAttributes.G, SvgAttributes.LINK);
    this.eraseMap = new Map<Element, string>();
    this.oldEraseMap = new Map<Element, string>();
    this.renderer.setAttribute(this.eraseElement, SvgAttributes.HEIGHT, '5');
    this.renderer.setAttribute(this.eraseElement, SvgAttributes.WIDTH, '5');
    this.renderer.setAttribute(this.eraseElement, SvgAttributes.FILL, 'white');
    this.renderer.setAttribute(this.eraseElement, SvgAttributes.STROKE, 'black');
  }

  eraseInput(size: number): void {
    this.renderer.setAttribute(this.eraseElement, SvgAttributes.HEIGHT, `${size}`);
    this.renderer.setAttribute(this.eraseElement, SvgAttributes.WIDTH, `${size}`);
  }

  eraseActivate(id: core.ElementRef): void {
    this.erase2.appendChild(this.eraseElement);
    this.renderer.appendChild(id.nativeElement, this.erase2);
  }

  eraseDeactivate(id: core.ElementRef): void {
  this.renderer.removeChild(id.nativeElement, this.eraseElement);
  }

  onMouseUp(): void {
    if (this.click) {
      this.click = false;
    }
  }

  onMouseDown(id: core.ElementRef): void {
    if (!this.click) {
      this.click = true;
      if ( this.eraseMap.size !== 0 ) {
        this.eraseMap.forEach((value: string, key: Element) => (this.renderer.setAttribute(key, SvgAttributes.STROKE, value)));
        this.eraseMap.forEach((value: string, key: Element) => (this.renderer.removeChild(id.nativeElement, key)));
      }
    }
  }

  detect(center: number, id: core.ElementRef): void {
    this.eraseMap.clear();
    const eraser: SVGRect = id.nativeElement.createSVGRect();
    eraser.x = Number(this.eraseElement.getAttribute('x')) + CONSTANTS.ERASE_VALUE_57;
    eraser.y = Number(this.eraseElement.getAttribute('y'));
    for (let i = eraser.x; i < (center + eraser.x); i++) {
      for (let j = eraser.y; j < (center + eraser.y); j++) {
        const element = document.elementFromPoint(i, j) as Element;
        const setStroke: string = element.getAttribute(SvgAttributes.STROKE) as string;
        if ((element.nodeName === SvgAttributes.CIRCLE || element.nodeName === SvgAttributes.ELLIPSE ||
          element.nodeName === SvgAttributes.RECT || element.nodeName === SvgAttributes.PATH ||
          element.nodeName === SvgAttributes.POLYLINE || element.nodeName === SvgAttributes.G)) {
          this.eraseMap.set(element, setStroke);
          this.renderer.setAttribute(element, SvgAttributes.STROKE, 'red');
        }
      }
    }
    this.oldEraseMap.clear();
    this.eraseMap.forEach((value: string, key: Element) => this.oldEraseMap.set(key, value));
  }

  mouseMouve( event: MouseEvent, center: number, id: core.ElementRef ): void {
    this.renderer.setAttribute(this.eraseElement, CONSTANTS.COORDINATE_X, `${event.x - (center / 2) - CONSTANTS.ERASE_VALUE_57}`);
    this.renderer.setAttribute(this.eraseElement, CONSTANTS.COORDINATE_Y, `${event.y - (center / 2)}`);
    this.detect(center, id);
    if (this.click) {
      this.eraseMap.forEach((value: string, key: Element) => this.renderer.removeChild(id.nativeElement, key));
    }
  }
}
