import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { Coordinate } from '../commun-interface';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { RectangleService } from './rectangle.service';
const drawingData = 'drawingData';
// tslint:disable:no-any
// tslint:disable: max-classes-per-file

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
describe('RectangleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
  providers: [{provide: SVGElement, useClass: MockSVGElement},
    {provide: Renderer2, useClass: MockRenderer},
    {provide: NodeList, useClass: MockRenderer},
    {provide: RendererFactory2, useClass: MockRendererFactory}],
}));
  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });
  it('onMouseDown', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousedown', { clientX: coordinate.x, clientY: coordinate.y });
    service.onMouseDown(mouse);
    expect(service[drawingData].startCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].startCoordinate.y).toBe(mouse.clientY);
  });
  it('onMouseUp', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousedown', { clientX: coordinate.x, clientY: coordinate.y });
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    service.onMouseUp(mouse, undoRedo);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
  });
  it('calculate the height', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const startPosition: Coordinate = { x: 0, y: 0 };
    const endPosition: Coordinate = { x: 3, y: 4 };
    const height = 4;
    const calculateHeight = service.calculateHeight(startPosition, endPosition);
    expect(calculateHeight).toBe(height);
  });
  it('calculate the width', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const startPosition: Coordinate = { x: 0, y: 0 };
    const endPosition: Coordinate = { x: 4, y: 5 };
    const width = 4;
    const calculateWidth = service.calculateWidth(startPosition, endPosition);
    expect(calculateWidth).toBe(width);
  });
  it('draw rectangle', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const position = 100;
    service[drawingData].beginPath = true;
    const stroke = '10';
    spyOn(service.renderer, 'setAttribute');
    spyOn<any>(service.rect, 'getAttribute').and.callFake(
      (qualifiedName: string) => {
        return '100';
      });
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    service.draw(mouse, contain, stroke);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(CONSTANTS.TIMES_CALL);
  });
  it('draw with beginPath to be false', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const test: Coordinate = { x: 2, y: 3 };
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const stroke = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service[drawingData].beginPath = false;
    service.draw(mouse, contain, stroke);
    expect(service[drawingData].endCoordinate.x).toBe(0);
    expect(service[drawingData].endCoordinate.x).not.toEqual(test.x);
    expect(service[drawingData].endCoordinate.y).toBe(0);
    expect(service[drawingData].endCoordinate.y).not.toEqual(test.y);
  });
  it('draw with first if', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const coordinate: Coordinate = { x: 100, y: 100 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_50;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_50;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const stroke = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service[drawingData].beginPath = true;
    spyOn<any>(service.rect, 'getAttribute').and.callFake((qualifiedName: string) => {
      return '100';
    });
    const startPosition: Coordinate = { x: 100, y: 100 };
    const test = `M 100
           100 h 100 v 100 h -100 Z`;
    service.draw(mouse, contain, stroke);
    expect(service[drawingData].endCoordinate.x).toBe(startPosition.x);
    expect(service[drawingData].startCoordinate.x).toBeLessThan(service[drawingData].endCoordinate.x);
    expect(service[drawingData].endCoordinate.y).toBe(startPosition.y);
    expect(service[drawingData].startCoordinate.y).toBeLessThan(service[drawingData].endCoordinate.y);
    expect(service.rectPath).toBe(test);
  });
  it('draw with first else if', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const coordinate: Coordinate = { x: 50, y: 50 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_100;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_100;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const stroke = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service[drawingData].beginPath = true;
    spyOn<any>(service.rect, 'getAttribute').and.callFake((qualifiedName: string) => {
      return '100';
    });
    const test = `M 100
           100 h -100 v -100 h 100 Z`;
    service.draw(mouse, contain, stroke);
    expect(service[drawingData].startCoordinate.x).toBeGreaterThan(mouse.clientX);
    expect(service[drawingData].startCoordinate.x).toBeGreaterThan(service[drawingData].endCoordinate.x);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(mouse.clientY);
    expect(service.rectPath).toBe(test);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(service[drawingData].endCoordinate.y);
  });
  it('draw with  second else if ', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const coordinate: Coordinate = { x: 50, y: 50 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_100;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_25;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y, shiftKey: true });
    const stroke = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service[drawingData].beginPath = true;
    spyOn<any>(service.rect, 'getAttribute').and.callFake((qualifiedName: string) => {
      return '100';
    });
    const test = `M 100
           100 h -100 v 100 h 100 Z`;
    service.draw(mouse, contain, stroke);
    service[drawingData].height = CONSTANTS.EMPTY_STRING;
    service[drawingData].width = CONSTANTS.EMPTY_STRING;
    expect(service[drawingData].height).toEqual(CONSTANTS.EMPTY_STRING);
    expect(service[drawingData].width).toEqual(CONSTANTS.EMPTY_STRING);
    expect(service[drawingData].startCoordinate.x).toBeGreaterThan(mouse.clientX);
    expect(service[drawingData].startCoordinate.x).toBeGreaterThan(service[drawingData].endCoordinate.x);
    expect(service[drawingData].startCoordinate.y).toBeLessThan(mouse.clientY);
    expect(service.rectPath).toBe(test);
    expect(service[drawingData].startCoordinate.y).toBeLessThan(service[drawingData].endCoordinate.y);
  });
  it('draw with  else ', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const coordinate: Coordinate = { x: 50, y: 50 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_25;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_100;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const stroke = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service[drawingData].beginPath = true;
    spyOn<any>(service.rect, 'getAttribute').and.callFake((qualifiedName: string) => {
      return '100';
    });
    const test = `M 100
           100 h 100 v -100 h -100 Z`;
    service.draw(mouse, contain, stroke);
    expect(service[drawingData].startCoordinate.x).toBeLessThan(mouse.clientX);
    expect(service[drawingData].startCoordinate.x).toBeLessThan(service[drawingData].endCoordinate.x);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(mouse.clientY);
    expect(service.rectPath).toBe(test);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(service[drawingData].endCoordinate.y);
  });
});
