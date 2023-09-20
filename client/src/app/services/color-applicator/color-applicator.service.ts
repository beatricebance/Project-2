import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import {UndoRedoPile} from '../../services/commun-interface';
import { ColorDataService } from '../color-data/color-data.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class ColorApplicatorService {

  renderer: Renderer2;
  tempId: number;
  tempType: string;
  constructor(rendererFactory: RendererFactory2, private colorData: ColorDataService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.tempId = -1;
    this.tempType = CONSTANTS.EMPTY_STRING;
  }

  getChildType(child: ChildNode, pile: UndoRedoPile[]): string {
    for ( const tempElement of pile) {
      if (tempElement.element.isEqualNode(child)) { return tempElement.type; }
    }
    return CONSTANTS.EMPTY_STRING;
  }

  updateUndoPile(svgElement: SVGElement | ChildNode, undoRedo: UndoRedoService): void {
    if (!(svgElement.isEqualNode(undoRedo.undoPile[undoRedo.undoPile.length - 1].element))) {
      undoRedo.undoPile.push({ id: this.tempId, element: svgElement.cloneNode(true) as ChildNode, type: this.tempType });
    }
  }

  lineLeftClick(child: ChildNode, undoRedo: UndoRedoService): void {
    for (let i = 0; i < child.childNodes.length; i++) {
      const tempChild = (child.childNodes.item(i) as SVGElement);
      tempChild.setAttribute(SvgAttributes.STROKE, this.colorData.primaryColor);
      if (tempChild.localName === SvgAttributes.CIRCLE) {
        tempChild.setAttribute(SvgAttributes.FILL, this.colorData.primaryColor);
      }
    }
    this.updateUndoPile(child, undoRedo);
  }

  toolsLeftClick(svgElement: SVGElement, undoRedo: UndoRedoService): void {
    svgElement.setAttribute(SvgAttributes.STROKE, this.colorData.primaryColor);
    this.updateUndoPile(svgElement, undoRedo);
  }

  shapesLeftClick(svgElement: SVGElement, undoRedo: UndoRedoService): void {
    if (svgElement.getAttribute(SvgAttributes.FILL) !== SvgAttributes.TRANSPARENT) {
      svgElement.setAttribute(SvgAttributes.FILL, this.colorData.primaryColor);
      this.updateUndoPile(svgElement, undoRedo);
    }
  }

  onLeftClick(child: ChildNode, undoRedo: UndoRedoService): void {
    child.addEventListener('click', (element) => {
      const svgElement = element.target as SVGElement;
      for ( const tempElement of undoRedo.undoPile) {
        if (child.isEqualNode(tempElement.element)) {
          this.tempId = tempElement.id;
          this.tempType = tempElement.type;
        }
      }
      if ((element as MouseEvent).button === 0) {
        if (this.getChildType(child, undoRedo.undoPile) === 'tool') {
          this.toolsLeftClick(svgElement, undoRedo);
        } else if (this.getChildType(child, undoRedo.undoPile) === ('shape') ||
          this.getChildType(child, undoRedo.undoPile) === ('ellipse')) {
          this.shapesLeftClick(svgElement, undoRedo);
        } else if (this.getChildType(child, undoRedo.undoPile) === 'line') {
          this.lineLeftClick(child, undoRedo);
        }
      }
    });
  }

  onRightClick(child: ChildNode, undoRedo: UndoRedoService): void {
    child.addEventListener('contextmenu', (element) => {
      (element as Event).preventDefault();
      const svgElement = element.target as SVGElement;
      for ( const tempElement of undoRedo.undoPile) {
        if (svgElement.isEqualNode(tempElement.element)) {
          this.tempId = tempElement.id;
          this.tempType = tempElement.type;
        }
      }
      if ((element as MouseEvent).button === 2) {
        if (this.getChildType(child, undoRedo.undoPile) === ('shape') || this.getChildType(child, undoRedo.undoPile) === ('ellipse')) {
          if (svgElement.getAttribute(SvgAttributes.FILL) !== SvgAttributes.TRANSPARENT && svgElement.getAttribute(SvgAttributes.STROKE) !== '') {
            svgElement.setAttribute(SvgAttributes.STROKE, this.colorData.secondaryColor);
            this.updateUndoPile(svgElement, undoRedo);
          }
        }
      }
    });
  }

  onClick(container: ElementRef, undoRedo: UndoRedoService): void {
    const svgContent = (container.nativeElement as SVGElement).childNodes;
    for (let i = 0; i < svgContent.length; i++) {
      const temp = svgContent.item(i);
      this.onLeftClick(temp, undoRedo);
      this.onRightClick(temp, undoRedo);
    }
  }
}
