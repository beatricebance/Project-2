import { ElementRef,  Renderer2, RendererFactory2} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { Coordinate } from '../commun-interface';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { PolygonService } from './polygon.service';
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
  // tslint:disable-next-line:typedef
  removeChild(parent: any, child: any) {
    return;
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
    return document. createElementNS(SvgAttributes.LINK, SvgAttributes.STRING);
  }
  setAttribute(element: any, element2: any, element3: any): boolean {
    return true;
  }
  removeChild(parent: any, child: any): void {
    return;
  }
  removeAttribute(element: any, element2: any, element3: any): void {
    return;
  }
}
const drawingData = 'drawingData';
describe('PolygonService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: SVGElement, useClass: MockSVGElement},
      {provide: Renderer2, useClass: MockRenderer},
      {provide: NodeList, useClass: MockRenderer},
      {provide: RendererFactory2, useClass: MockRendererFactory}],
  }));
  it('onMouseDown', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousedown', { clientX: coordinate.x, clientY: coordinate.y });
    service.onMouseDown(mouse);
    expect(service[drawingData].startCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].startCoordinate.y).toBe(mouse.clientY);
  });
  it('onMouseUp', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousedown', { clientX: coordinate.x, clientY: coordinate.y });
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const stroke = '10';
    spyOn(service.renderer, 'removeChild');
    service.onMouseUp(mouse, contain, stroke, undoRedo);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
  });
  it('drawRectangle', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const position = 100;
    spyOn<any> (service.rect, 'getAttribute').and.callFake(
      (qualifiedName: string)  => {
        return '100';
      });
    const coordinate: Coordinate = { x: position, y: position };
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    service.drawRectangle(mouse);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
    const height = '';
    const width = '';
    expect(service[drawingData].height).toBe(height);
    expect(service[drawingData].width).toBe(width);
  });
  it('draw with first if', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const coordinate: Coordinate = { x: 100, y: 100 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_50;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_50;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const startPosition: Coordinate = { x: 100, y: 100 };
    const test = CONSTANTS.TEST_STRING_1;
    service.drawRectangle(mouse);
    expect(service[drawingData].endCoordinate.x).toBe(startPosition.x);
    expect(service[drawingData].startCoordinate.x).toBeLessThan(service[drawingData].endCoordinate.x);
    expect(service[drawingData].endCoordinate.y).toBe(startPosition.y);
    expect(service[drawingData].startCoordinate.y).toBeLessThan(service[drawingData].endCoordinate.y);
    expect(service.rectPath).toBe(test);
  });
  it('draw with first else if', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const coordinate: Coordinate = { x: 50, y: 50 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_100;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_100;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const test = CONSTANTS.TEST_STRING_2;
    service.drawRectangle(mouse);
    expect(service[drawingData].startCoordinate.x).toBeGreaterThan(mouse.clientX);
    expect(service[drawingData].startCoordinate.x).toBeGreaterThan(service[drawingData].endCoordinate.x);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(mouse.clientY);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(service[drawingData].endCoordinate.y);
    expect(service.rectPath).toBe(test);
  });
  it('draw with  else ', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const coordinate: Coordinate = { x: 50, y: 50 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_25;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_100;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const test = CONSTANTS.TEST_STRING_3;
    service.drawRectangle(mouse);
    expect(service[drawingData].startCoordinate.x).toBeLessThan(mouse.clientX);
    expect(service[drawingData].startCoordinate.x).toBeLessThan(service[drawingData].endCoordinate.x);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(mouse.clientY);
    expect(service[drawingData].startCoordinate.y).toBeGreaterThan(service[drawingData].endCoordinate.y);
    expect(service.rectPath).toBe(test);
  });
  it('draw with  second else if ', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const coordinate: Coordinate = { x: 50, y: 50 };
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_100;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_25;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y, shiftKey: true });
    const test = CONSTANTS.TEST_STRING_4;
    service.drawRectangle(mouse);
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
  it('draw Shape first if', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const position = 0;
    const coordinate: Coordinate = { x: position, y: position };
    spyOn(service.renderer, 'setAttribute');
    spyOn<any>(service.rect, 'getAttribute').and.callFake(
      (qualifiedName: string) => {
        return '100';
      });
    spyOn(service.renderer, 'appendChild');
    const strokeWidth = '10';
    const sideTest = 3;
    const angle = 78;
    const test =  '0,0 0,0 0,0  Z ';
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    service.drawShape(strokeWidth);
    expect(service.side).toBe(sideTest);
    expect(service.anglePlacement).toBe(angle);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
    expect(service.polyPath).toBe(test);
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(4);

    service.side = 4;
    service.drawShape(strokeWidth);

    service.side = 5;
    service.drawShape(strokeWidth);

    service.side = 7;
    service.drawShape(strokeWidth);

  });
  it('draw' , () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const spy = spyOn(service.renderer, 'removeChild');
    expect(spy);
    const coordinate: Coordinate = { x: 0, y: 0 };
    service.startDrawing = true;
    service[drawingData].startCoordinate.x = CONSTANTS.TEST_START_COORDINATE_100;
    service[drawingData].startCoordinate.y = CONSTANTS.TEST_START_COORDINATE_25;
    spyOn(service.renderer, 'setAttribute');
    spyOn<any>(service.rect, 'getAttribute').and.callFake(
      (qualifiedName: string) => {
        return '100';
      });
    spyOn(service.renderer, 'appendChild');
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y, shiftKey: true });
    const strokeWidth = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service.draw(mouse, contain, strokeWidth);
    service.drawRectangle(mouse);
    service.drawShape(strokeWidth);
    expect(service[drawingData].endCoordinate.x).toBe(mouse.clientX);
    expect(service[drawingData].endCoordinate.y).toBe(mouse.clientY);
    expect(service).toBeTruthy();
  });

  it('draw with beginPath to be false', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const position = 100;
    const coordinate: Coordinate = { x: position, y: position };
    const test: Coordinate = { x: 2, y: 3 };
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const strokeWidth = '10';
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service.startDrawing = false;
    service.draw(mouse, contain, strokeWidth);
    service.drawRectangle(mouse);
    service.drawShape(strokeWidth);
    expect(service[drawingData].endCoordinate.x).toBe(100);
    expect(service[drawingData].endCoordinate.x).not.toEqual(test.x);
    expect(service[drawingData].endCoordinate.y).toBe(100);
    expect(service[drawingData].endCoordinate.y).not.toEqual(test.y);
  });
  it('update angle', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    const side = 3;
    const angleTest = 60;
    service.updateAngle(side);
    expect(service.angle).toBe(angleTest);
  });
});
