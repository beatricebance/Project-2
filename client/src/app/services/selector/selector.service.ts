import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { Box } from '../box';
import { ClipboardService } from '../clipboard/clipboard';
import { Coordinate } from '../commun-interface';
import { RotateSelection } from '../rotate-selection/rotate-selection';
interface MouseFollow {
  down: Coordinate;
  up: Coordinate;
  isDown: boolean;
}
interface Mouse {
  left: MouseFollow;
  right: MouseFollow;
  position: Coordinate;
}

@Injectable({
  providedIn: 'root'
})
export class SelectorService {
  private svg: SVGSVGElement;
  selected: Set<SVGElement>;
  private selectedFreezed: Set<SVGElement>;
  private mouse: Mouse;
  private selectionRectangle: SVGElement;
  private inversionRectangle: SVGElement;
  private selectedElementsRectangle: SVGElement;
  private controlPoints: SVGElement[];
  private rotateSelection: RotateSelection;
  private clipboard: ClipboardService;
  renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, public eventManager: EventManager) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.rotateSelection = new RotateSelection(this);
    this.clipboard = new ClipboardService(this, rendererFactory);
  }

  setSVG(svg: SVGSVGElement): void {
    this.svg = svg;
  }

  initializeSelector(): void {
    this.eventManager.addEventListener(
      this.svg as unknown as HTMLElement,
      'contextmenu',
      (event: MouseEvent) => {
        event.preventDefault();
        this.onRightClick(event); });
    this.eventManager.addEventListener(
      this.svg as unknown as HTMLElement,
      'wheel',
      (event: MouseEvent) => {
        event.preventDefault();
        this.rotateSelection.onWheel(event as WheelEvent); });
    this.selected = new Set();
    this.initialiseAttributes();
  }

  private initialiseAttributes(): void {
    this.selectionRectangle = this.renderer.createElement(SvgAttributes.RECT, SvgAttributes.LINK);
    this.inversionRectangle = this.renderer.createElement(SvgAttributes.RECT, SvgAttributes.LINK);
    this.selectedElementsRectangle = this.renderer.createElement(SvgAttributes.RECT, SvgAttributes.LINK);
    this.selectionRectangle.style.animation = 'dash 2s linear infinite';
    this.svg.appendChild(this.selectionRectangle);
    this.svg.appendChild(this.inversionRectangle);
    this.svg.appendChild(this.selectedElementsRectangle);
    this.controlPoints = [];
    for (let i = 0; i < CONSTANTS.NUMBER_OF_POINTS; i++) {
      const circle: SVGElement = this.renderer.createElement(SvgAttributes.CIRCLE, SvgAttributes.LINK);
      this.controlPoints.push(circle);
      this.svg.appendChild(circle);
    }
    this.mouse = {
      left: { down: { x: 0, y: 0 }, up: { x: 0, y: 0 }, isDown: false },
      right: { down: { x: 0, y: 0 }, up: { x: 0, y: 0 }, isDown: false },
      position: { x: 0, y: 0 }
    };
  }

  resetPoints(): void {
    if (!!this.inversionRectangle) {
      this.inversionRectangle.remove();
    }
    if (!!this.selectedElementsRectangle) {
      this.selectedElementsRectangle.remove();
    }
    if (!!this.selectionRectangle) {
      this.selectionRectangle.remove();
    }
    if (!!this.controlPoints) {
      this.controlPoints.forEach((point) => {point.remove(); });
    }
  }

  private onLeftMouseDown(event: MouseEvent): void {
    this.mouse.left.down = {x: event.offsetX, y: event.offsetY };
    this.mouse.left.isDown = true;
  }

  private onRightMouseDown(event: MouseEvent): void {
    this.mouse.right.down = {x: event.offsetX, y: event.offsetY };
    this.mouse.right.isDown = true;
    this.selectedFreezed = new Set(this.selected);
  }

  private onLeftMouseMove(): void {
    const box = new Box({x: Math.min(this.mouse.left.down.x, this.mouse.position.x),
        y: Math.min(this.mouse.left.down.y, this.mouse.position.y)},
      Math.abs(this.mouse.left.down.x - this.mouse.position.x),
      Math.abs(this.mouse.left.down.y - this.mouse.position.y)
    );
    this.drawRectangle(this.selectionRectangle, box, 'gray', false);
    const selection = this.getSelectedElementsInArea(box);
    if (selection[0].size === 0) {
      this.deleteSelectedElementsRectangle();
      this.selected.clear();
    } else {
      this.drawSelectedElementsRectangle(selection[1] as Box);
      this.selected = selection[0];
    }
  }

  private onRightMouseMove(): void {
    const box = new Box({
        x: Math.min(this.mouse.right.down.x, this.mouse.position.x), y: Math.min(this.mouse.right.down.y, this.mouse.position.y)},
      Math.abs(this.mouse.right.down.x - this.mouse.position.x),
      Math.abs(this.mouse.right.down.y - this.mouse.position.y)
    );
    this.drawRectangle(this.inversionRectangle, box, 'red', false);
    const selection = this.getSelectedElementsInArea(box);
    const elementsToInvert = new Set(this.selectedFreezed);
    selection[0].forEach((element: SVGElement) => {
      if (this.selectedFreezed.has(element)) {
        elementsToInvert.delete(element);
      } else {
        elementsToInvert.add(element);
      }
    });
    this.selectAllArray(elementsToInvert);
  }

  onMouseMove(event: MouseEvent): void {
    this.mouse.position = {x: event.offsetX, y: event.offsetY};
    if (this.mouse.left.isDown) {
      this.onLeftMouseMove();
    }
    if (this.mouse.right.isDown) {
      this.onRightMouseMove();
    }
  }

  private onLeftMouseUp(event: MouseEvent): void {
    this.mouse.left.up = {x: event.offsetX, y: event.offsetY};
    this.mouse.left.isDown = false;
    this.deleteRectangle(this.selectionRectangle);
  }

  private onRightMouseUp(event: MouseEvent): void {
    this.mouse.right.up = {x: event.offsetX, y: event.offsetY};
    this.mouse.right.isDown = false;
    this.deleteRectangle(this.inversionRectangle);
  }

  onLeftClick(event: MouseEvent): void {
    if (this.sameCoordinate(this.mouse.left.down, this.mouse.left.up)) {
      if (this.shouldBeIgnored(event.target as SVGElement)) {
        this.deleteSelectedElementsRectangle();
      } else {
        const box = this.getElementBox(event.target as SVGElement);
        this.drawSelectedElementsRectangle(box);
      }
    }
  }

  onRightClick(event: MouseEvent): void {
    if (this.sameCoordinate(this.mouse.right.down, this.mouse.position) && !this.shouldBeIgnored(event.target as SVGElement)) {
      if (this.selected.has(event.target as SVGElement)) {
        this.selected.delete(event.target as SVGElement);
        this.selectAllArray(new Set(this.selected));
      } else {
        this.selected.add(event.target as SVGElement);
        this.selectAllArray(new Set(this.selected));
      }
    }
  }

  onClick(event: MouseEvent): void {
    if (event.button === 0) {
      this.onLeftClick(event);
    } else if (event.button === 2) {
      this.onRightClick(event);
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      this.onLeftMouseDown(event);
    } else if (event.button === 2) {
      this.onRightMouseDown(event);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (event.button === 0) {
      this.onLeftMouseUp(event);
    } else if (event.button === 2) {
      this.onRightMouseUp(event);
    }
  }

  drawSelectedElementsRectangle(box: Box): void {
    this.drawRectangle(this.selectedElementsRectangle, box, 'green', true);
    this.drawControlPoints(box);
  }

  drawRectangle(element: SVGElement, box: Box, color: string, isBox: boolean): void {
    element.setAttribute('x', box.startPoint.x.toString());
    element.setAttribute('y', box.startPoint.y.toString());
    element.setAttribute('width', box.width.toString());
    element.setAttribute('height', box.height.toString());
    element.setAttribute('stroke', color);
    element.setAttribute('stroke-width', '4');
    element.setAttribute('fill', 'none');
    if (!isBox) {
      element.setAttribute('stroke-dasharray', '4');
    }
  }

  drawControlPoints(box: Box): void {
    const topPoint: Coordinate = {
      x: box.startPoint.x + box.width / 2, y: box.startPoint.y
    };
    this.drawControlPoint(this.controlPoints[0], topPoint);
    const rightPoint: Coordinate = {
      x: box.startPoint.x + box.width, y: box.startPoint.y + box.height / 2
    };
    this.drawControlPoint(this.controlPoints[1], rightPoint);
    const bottomPoint: Coordinate = {
      x: box.startPoint.x + box.width / 2, y: box.startPoint.y + box.height
    };
    this.drawControlPoint(this.controlPoints[2], bottomPoint);
    const leftPoint: Coordinate = {
      x: box.startPoint.x, y: box.startPoint.y + box.height / 2
    };
    this.drawControlPoint(this.controlPoints[CONSTANTS.LAST_CONTROL_POINT], leftPoint);
  }

  drawControlPoint(element: SVGElement, position: Coordinate): void {
    element.setAttribute('cx', position.x.toString());
    element.setAttribute('cy', position.y.toString());
    element.setAttribute('r', '8');
    element.setAttribute('fill', 'green');
  }

  private deleteSelectedElementsRectangle(): void {
    this.deleteRectangle(this.selectedElementsRectangle);
    this.deleteControlPoints();
  }

  private deleteRectangle(element: SVGElement): void {
    element.setAttribute('width', '0');
    element.setAttribute('height', '0');
  }

  private deleteControlPoints(): void {
    this.controlPoints.forEach((point) => {
      point.setAttribute('r', '0');
      point.setAttribute('fill', 'none');
    });
  }

  private getSelectedElementsInArea(box: Box): [Set<SVGElement>, Box | undefined] {
    const selectedElements = new Set<SVGElement>();
    const compareBox = box;
    let selectedElementsBox: Box | undefined;
    Array.from(this.svg.children).forEach((draw: SVGElement) => {
      const elementBox = this.getElementBox(draw);
      if (!this.shouldBeIgnored(draw) && elementBox.intercepts(compareBox)) {
        selectedElementsBox = !!selectedElementsBox ? selectedElementsBox.union(elementBox) : elementBox;
        selectedElements.add(draw);
      }
    });
    return [selectedElements, selectedElementsBox];
  }

  selectAllArray(elements: Set<SVGElement>): void {
    this.selected.clear();
    let selectedElementsBox: Box | undefined;
    elements.forEach((draw: SVGElement) => {
      const elementBox = this.getElementBox(draw);
      if (!this.shouldBeIgnored(draw)) {
        selectedElementsBox = !!selectedElementsBox ? selectedElementsBox.union(elementBox) : elementBox;
        this.selected.add(draw);
      }
    });
    if (this.selected.size !== 0) {
      this.drawSelectedElementsRectangle(selectedElementsBox as Box);
    } else {
      this.deleteSelectedElementsRectangle();
    }
  }

  selectAll(): void {
    this.selectAllArray(
      new Set(Array.from(this.svg.children) as SVGElement[])
    );
  }

  getElementBox(element: SVGElement): Box {
    const boudingClientRect = element.getBoundingClientRect();
    const svgBoundingRect = this.svg.getBoundingClientRect();
    return new Box(
      { x: boudingClientRect.left - svgBoundingRect.left, y: boudingClientRect.top - svgBoundingRect.top },
      boudingClientRect.right - boudingClientRect.left, boudingClientRect.bottom - boudingClientRect.top
    );
  }

  shouldBeIgnored(element: SVGElement): boolean {
    return element instanceof SVGDefsElement || element === this.svg || element === this.selectionRectangle
      || element === this.inversionRectangle || element === this.selectedElementsRectangle || element === this.controlPoints[0]
      || element === this.controlPoints[1] || element === this.controlPoints[2]
      || element === this.controlPoints[CONSTANTS.LAST_CONTROL_POINT];
  }

  private sameCoordinate(coords1: Coordinate, coords2: Coordinate): boolean {
    return coords1.x === coords2.x && coords1.y === coords2.y;
  }
  copy(): void {
    this.clipboard.copy();
  }

  paste(): void {
    this.clipboard.paste(this.svg);
  }

  cut(): void {
    this.clipboard.cut(this.svg);
  }
  duplicate(): void {
    this.clipboard.duplicate(this.svg);
  }
  delete(): void {
    this.clipboard.delete(this.svg);
  }
}
