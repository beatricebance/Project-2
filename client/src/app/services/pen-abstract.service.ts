import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import * as CONSTANTS from '../constants/constants';
import {SvgAttributes} from '../constants/enum';
import { DrawingCommunService } from './drawing-commun/drawing-commun.service';
import { UndoRedoService } from './undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export abstract class PenAbstractService {
  protected path: SVGPathElement;
  protected pointString: string;
  renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2,
              protected drawingData: DrawingCommunService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.path = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.pointString = CONSTANTS.EMPTY_STRING;
  }
  beginDrawing(event: MouseEvent, container: ElementRef, strokeWidth: string): void {
    this.drawingData.beginPath = true;
    this.draw(event, container, strokeWidth);
  }
  stopDrawing(undoRedo: UndoRedoService): void {
    undoRedo.undoPile.push({id: this.drawingData.idGenerator(), element: this.path.cloneNode(true) as ChildNode,  type: 'tool'});
    this.drawingData.beginPath = false;
    this.path = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
    this.pointString = CONSTANTS.EMPTY_STRING;
  }

  abstract draw(event: MouseEvent, container: ElementRef, strokeWidth: string): void;
}
