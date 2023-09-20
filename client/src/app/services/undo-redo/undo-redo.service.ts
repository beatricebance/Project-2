import { ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import {UndoRedoPile} from '../commun-interface';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {
  renderer: Renderer2;
  undoPile: UndoRedoPile[];
  redoPile: UndoRedoPile[];
  protected tempLine: UndoRedoPile;
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.undoPile = [];
    this.redoPile = [];
    this.tempLine = {id: -1, element: CONSTANTS.EMPTY_STRING as unknown as ChildNode, type: CONSTANTS.EMPTY_STRING};
  }

  undo(container: ElementRef): void {
    const lastIn = this.undoPile.pop();
    if (lastIn !== undefined) {
      this.redoPile.push(lastIn);
      const svgContent = (container.nativeElement as SVGElement).childNodes;
      if (this.undoPile.length >= 0) {
        for (let i = 0; i < svgContent.length; i++) {
          if (svgContent.item(i).isEqualNode(lastIn.element)) {
            svgContent.item(i).remove();
          }
        }
        for ( const tempElement of this.undoPile) {
          if (lastIn.id === tempElement.id) {
            this.renderer.appendChild(container.nativeElement, tempElement.element);
          }
        }
      }
    }
  }

  redo(container: ElementRef): void {
    const lastIn = this.redoPile.pop();
    if (lastIn !== undefined) {
      this.undoPile.push(lastIn);
      const svgContent = (container.nativeElement as SVGElement).childNodes;
      for (let i = 0; i < svgContent.length; i++) {
        if (((lastIn.type === 'tool') || (lastIn.type === 'shape')) &&
        (svgContent.item(i) as SVGElement).getAttribute('d') === (lastIn.element as SVGElement).getAttribute('d')) {
          svgContent.item(i).remove();
        } else if ((lastIn.type === 'line') && ((svgContent.item(i) as SVGElement).localName === 'g')) {
          const lineContent = (svgContent.item(i) as SVGElement).childNodes;
          for (let j = 0; j < lineContent.length; j++) {
            const tempChild = (lineContent.item(j) as SVGElement);
            if ((tempChild.localName === 'polyline') &&
            (tempChild.getAttribute('points') === (lastIn.element.childNodes.item(j) as SVGElement).getAttribute('points'))) {
              svgContent.item(i).remove();
            }
          }
        } else if ((lastIn.type === 'ellipse') &&
          (svgContent.item(i) as SVGElement).getAttribute('cx') === (lastIn.element as SVGElement).getAttribute('cx') &&
          (svgContent.item(i) as SVGElement).getAttribute('cy') === (lastIn.element as SVGElement).getAttribute('cy')) {
          svgContent.item(i).remove();
        }
      }
      this.renderer.appendChild(container.nativeElement, lastIn.element);
    }
  }

  newElementInSvg(container: ElementRef): boolean {
    const currentNbElement = (container.nativeElement as SVGElement).childNodes.length;
    if (currentNbElement >= this.undoPile.length) {
      this.redoPile = [];
      return false;
    }
    return true;
  }

  resetPiles(): void {
    this.undoPile = [];
    this.redoPile = [];
  }

}
