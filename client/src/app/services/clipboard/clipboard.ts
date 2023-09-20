import { Renderer2, RendererFactory2  } from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import { SvgAttributes } from '../../constants/enum';
import { SelectorService} from '../selector/selector.service';

export class ClipboardService {
  private board: Set<SVGElement>;
  private boardForDuplication: Set<SVGElement>;
  private distanceXCopy: number;
  private distanceYCopy: number;
  private distanceXDuplication: number;
  private distanceYDuplication: number;

  renderer: Renderer2;
  constructor( private selection: SelectorService, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.board = new Set();
    this.boardForDuplication = new Set();
  }
  copy(): void {
    this.distanceXCopy = CONSTANTS.PIXEL_MOVEMENT;
    this.distanceYCopy = CONSTANTS.PIXEL_MOVEMENT;
    this.board.clear();
    this.selection.selected.forEach((elementsOfSelected) => {
      this.board.add(elementsOfSelected.cloneNode(true) as SVGElement);
    });
  }
  pasteForOtherShape(boardShape: Set<SVGElement>, svg: SVGElement, distanceX: number, distanceY: number): void {
    boardShape.forEach((element) => {
     let path: SVGPathElement;
     let rectPath: string;
     const x = Number(element.getAttribute('x')) + distanceX;
     const y = Number(element.getAttribute('y')) + distanceY;
     path = this.renderer.createElement(SvgAttributes.PATH, SvgAttributes.LINK);
     const shape = element.cloneNode(true) as ChildNode;
     this.renderer.appendChild(svg, shape);
     path.setAttribute(CONSTANTS.COORDINATE_X, x.toString());
     path.setAttribute(CONSTANTS.COORDINATE_Y, y.toString());
     this.renderer.setAttribute(shape, 'height', (Number(element.getAttribute('height')) - CONSTANTS.PIXEL_MOVEMENT).toString());
     this.renderer.setAttribute(shape, 'width', (Number(element.getAttribute('width')) - CONSTANTS.PIXEL_MOVEMENT).toString());
     const splits = String(element.getAttribute('d')).split(' ');
     const tmpSplits = [];
     for (let i = 0; i < (splits.length); i++) {
      if (splits[i] !== '') {
        tmpSplits.push(splits[i]);
      }
     }
     tmpSplits[1] = x.toString();
     tmpSplits[2] = y.toString();
     rectPath = tmpSplits.join(' ');
     this.renderer.setAttribute(shape, 'd', rectPath.toString());
     this.renderer.setAttribute(shape, 'cx', (Number(element.getAttribute('cx')) + distanceX).toString());
     this.renderer.setAttribute(shape, 'cy', (Number(element.getAttribute('cy')) + distanceY).toString());
    });
  }
  pasteForLine(element: SVGElement, svg: SVGElement, distanceX: number, distanceY: number): void {
    const circlesToCopy = element.getElementsByTagName('circle');
    const polylineToCopy = element.getElementsByTagName('polyline');
    const spaceSplits = String(polylineToCopy[0].getAttribute('points')).split(' ');
    const spaceSplitsTab = [];
    for (let i = 0; (i < spaceSplits.length); i++) {
      if (spaceSplits[i] !== '') {
        spaceSplitsTab.push(Number(spaceSplits[i]) + distanceX);
      }
    }
    const lineGroup = this.renderer.createElement(SvgAttributes.G, SvgAttributes.LINK);
    const polyline = this.renderer.createElement(SvgAttributes.POLYLINE, SvgAttributes.LINK);
    this.renderer.setAttribute(polyline, 'points', spaceSplitsTab.join(' ').toString());
    this.renderer.setAttribute(polyline, 'stroke', String(polylineToCopy[0].getAttribute('stroke')));
    this.renderer.setAttribute(polyline, 'fill', String(polylineToCopy[0].getAttribute('fill')));
    this.renderer.setAttribute(polyline, 'stroke-width', String(polylineToCopy[0].getAttribute('stroke-width')));
    this.renderer.setAttribute(polyline, 'stroke-linejoin', String(polylineToCopy[0].getAttribute('stroke-linejoins')));
    lineGroup.appendChild(polyline);
    for (let i = 0; (i < circlesToCopy.length); i++) {
      const circle = this.renderer.createElement(SvgAttributes.CIRCLE, SvgAttributes.LINK);
      this.renderer.setAttribute(circle, 'cx', String(Number(circlesToCopy[i].getAttribute('cx')) + distanceX));
      this.renderer.setAttribute(circle, 'cy', String(Number(circlesToCopy[i].getAttribute('cy')) + distanceY));
      this.renderer.setAttribute(circle, 'r', String(Number(circlesToCopy[i].getAttribute('r'))));
      this.renderer.setAttribute(circle, 'stroke', String(circlesToCopy[i].getAttribute('stroke')));
      this.renderer.setAttribute(circle, 'fill', String(circlesToCopy[i].getAttribute('fill')));
      lineGroup.appendChild(circle);
    }
    this.renderer.appendChild(svg, lineGroup);
  }
  pasteForPolygon( svg: SVGElement, distanceX: number): void {
    this.board.forEach((element) => {
      const tmpAttD = String(element.getAttribute('d')).replace('M', 'M ');
      const tmpSplits = [];
      const splits = tmpAttD.split(' ').toString().split(',');
      for (let i = 0; i < (splits.length); i++) {
       if (splits[i] !== '') {
         if (splits[i].indexOf('.') !== -1 || Number(splits[i])) {
            tmpSplits.push(Number(splits[i]) + distanceX);
         } else {
            tmpSplits.push(splits[i]);
         }
       }
      }
      const shape = element.cloneNode(true) as ChildNode;
      this.renderer.appendChild(svg, shape);
      this.renderer.setAttribute(shape, 'd', tmpSplits.join(' ').toString());
    });
  }
  paste(svg: SVGElement): void {
    this.board.forEach((element) => {
      if (element.getElementsByTagName('polyline').length > 0) {
        this.pasteForLine(element, svg, this.distanceXCopy, this.distanceYCopy);
      } else if (element.hasAttribute('width') === false && element.hasAttribute('height') === false &&
        element.hasAttribute('cx') === false && element.hasAttribute('cy') === false) {
        const pathStartReplacement = String(element.getAttribute('d')).replace('M', 'M ');
        const coordsDetectTab = [];
        if (pathStartReplacement.split('M').length > CONSTANTS.AIRBRUSH_DETECT) {
          const spaceSplits = pathStartReplacement.split(' ').toString().split(',');
          const spaceSplitsTab = [];
          for (let i = 0; i < (spaceSplits.length); i++) {
            if (spaceSplits[i] !== '') {
              spaceSplitsTab.push(spaceSplits[i]);
            }
          }
          let changeCoords = false;
          let pathEndingWithM = false;
          for (let i = 0; (i < spaceSplitsTab.length); i++) {
            if (pathEndingWithM) {
              if (changeCoords === false) {
                coordsDetectTab.push(Number(spaceSplitsTab[i]) + this.distanceXCopy);
                changeCoords = true;
              } else {
                coordsDetectTab.push(Number(spaceSplitsTab[i]) + this.distanceYCopy);
                pathEndingWithM = false;
                changeCoords = false;
              }
            } else {
              if (spaceSplitsTab[i] === 'M') {
                pathEndingWithM = true;
              }
              coordsDetectTab.push(spaceSplitsTab[i]);
            }
          }
        } else {
          this.pasteForPolygon(svg, this.distanceXCopy);
        }
        const shape = element.cloneNode(true) as ChildNode;
        this.renderer.appendChild(svg, shape);
        this.renderer.setAttribute(shape, 'd', coordsDetectTab.join(' ').toString());
      } else {
      this.pasteForOtherShape(this.board, svg, this.distanceXCopy, this.distanceYCopy);
      }

    });
    this.distanceXCopy += CONSTANTS.PIXEL_MOVEMENT;
    this.distanceYCopy += CONSTANTS.PIXEL_MOVEMENT;
  }
  cut( svg: SVGElement): void {
    this.distanceXCopy = CONSTANTS.PIXEL_MOVEMENT;
    this.distanceYCopy = CONSTANTS.PIXEL_MOVEMENT;
    this.board.clear();
    this.board = this.selection.selected;
    for (const elt of this.board) {
      svg.removeChild(elt);
    }
    this.selection.resetPoints();
  }
  duplicate(svg: SVGElement): void {
    this.distanceXDuplication = CONSTANTS.PIXEL_MOVEMENT;
    this.distanceYDuplication = CONSTANTS.PIXEL_MOVEMENT;
    this.boardForDuplication.clear();
    this.selection.selected.forEach((element) => {
      this.boardForDuplication.add(element.cloneNode(true) as SVGElement);

    });
    this.pasteForDuplication(svg);
  }
  pasteForDuplication(svg: SVGElement): void {
    this.boardForDuplication.forEach((element) => {
      if (element.getElementsByTagName('polyline').length > 0) {
        this.pasteForLine(element, svg, this.distanceXDuplication, this.distanceYDuplication);
      } else if (element.hasAttribute('width') === false && element.hasAttribute('height') === false &&
        element.hasAttribute('cx') === false && element.hasAttribute('cy') === false) {
          const pathStartReplacement = String(element.getAttribute('d')).replace('M', 'M ');
          const coordsDetectTab = [];
          if (pathStartReplacement.split('M').length > CONSTANTS.AIRBRUSH_DETECT) {
            const spaceSplits = pathStartReplacement.split(' ').toString().split(',');
            const spaceSplitsTab = [];
            for (let i = 0; i < (spaceSplits.length); i++) {
              if (spaceSplits[i] !== '') {
                spaceSplitsTab.push(spaceSplits[i]);
              }
            }
            let changeCoords = false;
            let pathEndingWithM = false;
            for (let i = 0; (i < spaceSplitsTab.length); i++) {
              if (pathEndingWithM) {
                if (changeCoords === false) {
                  coordsDetectTab.push(Number(spaceSplitsTab[i]) + this.distanceXDuplication);
                  changeCoords = true;
                } else {
                  coordsDetectTab.push(Number(spaceSplitsTab[i]) + this.distanceYDuplication);
                  pathEndingWithM = false;
                  changeCoords = false;
                }
              } else {
                if (spaceSplitsTab[i] === 'M') {
                  pathEndingWithM = true;
                }
                coordsDetectTab.push(spaceSplitsTab[i]);
              }
            }
          } else {
            this.pasteForPolygon(svg, this.distanceXDuplication);
          }
          const shape = element.cloneNode(true) as ChildNode;
          this.renderer.appendChild(svg, shape);
          this.renderer.setAttribute(shape, 'd', coordsDetectTab.join(' ').toString());
        } else {
        this.pasteForOtherShape(this.boardForDuplication, svg, this.distanceXDuplication, this.distanceYDuplication);
      }

    });
    this.distanceXDuplication += CONSTANTS.PIXEL_MOVEMENT;
    this.distanceYDuplication += CONSTANTS.PIXEL_MOVEMENT;
  }
  delete(svg: SVGElement): void {
    this.board = this.selection.selected;
    for (const elt of this.board) {
      svg.removeChild(elt);
      this.board.clear();
    }
  }
}
