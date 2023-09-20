import { ElementRef, Renderer2, RendererFactory2} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {Coordinate} from '../commun-interface';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { EllipseService } from './ellipse.service';
const drawingData = 'drawingData';

// tslint:disable:no-any
// tslint:disable: max-classes-per-file
// tslint:disable: no-magic-numbers
class MockSVGElement {
  isEqualNode(child: SVGElement): boolean {
    return false;
  }
  cloneNode(): ChildNode {
    return ('' as unknown as ChildNode);
  }
  getAttribute(name: string): string {
    if (name === 'fill') {
      return '';
    } else { return 'no'; }
  }
  setAttribute(name1: string, name2: string): void {
    return;
  }
  appendChild(child: any): void {
    return ;
  }
}
class MockRendererFactory {
  // tslint:disable-next-line: no-any
  createRenderer(renderer: any, element: any): MockRenderer {
    return new MockRenderer();
  }
}
class MockRenderer {
  appendChild(parent: any , child: any): void {
    return ;
  }
  createElement(name: string): any {
    return document. createElementNS('http://www.w3.org/2000/svg', 'svg');
  }
  setAttribute(element: any, element2: any, element3: any): boolean {
    return true;
  }
  removeChild(parent: any, child: any): void {
    return;
  }
}
describe('EllipseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: SVGElement, useClass: MockSVGElement},
      {provide: Renderer2, useClass: MockRenderer},
      {provide: NodeList, useClass: MockRenderer},
      {provide: RendererFactory2, useClass: MockRendererFactory}],
  }));
  it('onMouseDown', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousedown', { clientX: coordinate.x, clientY: coordinate.y });
    service[drawingData].beginPath = true;
    service.onMouseDown(mouse);
    expect(service[drawingData].startCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].startCoordinate.y).toBe(mouse.clientY);
  });
  it('onMouseUp', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousedown', { clientX: coordinate.x, clientY: coordinate.y });
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    service[drawingData].beginPath = false;
    service.onMouseUp(mouse, undoRedo);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
  });
  it('calculate the RadiusX', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const startPosition: Coordinate = { x: 2, y: 2 };
    const endPosition: Coordinate = { x: 8, y: 8 };
    const radiusX = 3;
    const calculateHeight = service.calculateRadiusX(startPosition, endPosition);
    expect(calculateHeight).toBe(radiusX);
  });
  it('calculate the RadiusY', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const startPosition: Coordinate = { x: 2, y: 2 };
    const endPosition: Coordinate = { x: 8, y: 8 };
    const radiusY = 3;
    const calculateWidth = service.calculateRadiusY(startPosition, endPosition);
    expect(calculateWidth).toBe(radiusY);
  });
  it('draw ellipse', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const position = 100;
    service[drawingData].beginPath = true;
    const strokeWidth = '10';
    spyOn(service.renderer, 'setAttribute');
    spyOn<any> (service.ellipse, 'getAttribute').and.callFake(
      (qualifiedName: string)  => {
        return '100';
      });
    const contain = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    service.draw(mouse, contain, strokeWidth);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(7);
  });
  it('draw with beginPath to be false', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const test: Coordinate = { x: 2, y: 3 };
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const stroke = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    service[drawingData].beginPath = false;
    service.draw(mouse, contain, stroke);
    expect(service[drawingData].endCoordinate.x).toBe(0);
    expect(service[drawingData].endCoordinate.x).not.toEqual(test.x);
    expect(service[drawingData].endCoordinate.x).toBe(0);
    expect(service[drawingData].endCoordinate.x).not.toEqual(test.y);
  });
});
