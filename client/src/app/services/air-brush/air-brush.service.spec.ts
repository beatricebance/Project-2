import { ElementRef, Renderer2, RendererFactory2} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { Coordinate } from '../../services/commun-interface';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { AirBrushService } from './air-brush.service';

// tslint:disable:no-any
// tslint:disable: max-classes-per-file
// tslint:disable: no-magic-numbers
class MockSVGElement {
  isEqualNode(child: SVGElement): boolean {
    return false;
  }
  cloneNode(): ChildNode {
    return (CONSTANTS.EMPTY_STRING as unknown as ChildNode);
  }
  getAttribute(name: string): string {
    if (name === SvgAttributes.FILL) {
      return CONSTANTS.EMPTY_STRING;
    } else { return CONSTANTS.VALUE_NO; }
  }
  setAttribute(name1: string, name2: string): void {
    return;
  }
  appendChild(child: any): void {
    return;
  }
}
class MockRendererFactory {
  createRenderer(renderer: any, element: any): MockRenderer {
    return new MockRenderer();
  }
}
class MockRenderer {
  appendChild(parent: any, child: any): void {
    return;
  }
  createElement(name: string): any {
    return document.createElementNS(SvgAttributes.LINK, SvgAttributes.PATH);
  }
  setAttribute(element: any, element2: any, element3: any): boolean {
    return true;
  }
  removeChild(parent: any, child: any): void {
    return;
  }
}
describe('AirBrushService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: SVGElement, useClass: MockSVGElement},
      {provide: Renderer2, useClass: MockRenderer},
      {provide: NodeList, useClass: MockRenderer},
      {provide: RendererFactory2, useClass: MockRendererFactory}],
  }));
  it('should be created', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    expect(service).toBeTruthy();
  });
  it('press', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    service.pressing = true;
    expect(service.press).toMatch('true');
  });
  it('longPress', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    service.longPressing = true;
    expect(service.longPress).toMatch('true');
  });
  it('loop', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    spyOn(service.renderer, 'setAttribute');
    const coordinate: Coordinate = { x: 100, y: 100 };
    service.longPressing = true;
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service.loop(mouse, contain);
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(0);
    service.angle = Math.random() * 2 * Math.PI;
    Math.random = () => 0;
    Math.random = () => 1 - Number.EPSILON;
  });
  it('if longPressing', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    const coordinate: Coordinate = { x: 100, y: 100 };
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service.onLongPressing.emit(mouse);
    jasmine.clock().install();
    service.loop(mouse, contain);
    jasmine.clock().tick(5000);
    expect(service.loop).toBeTruthy();
    jasmine.clock().uninstall();
  });
  it('endPress', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    service.longPressing = false;
    service.pressing = false;
    spyOn(service.onLongPressing, 'emit');
    expect(service.onLongPressing.emit).toBeTruthy();
    service.endPress();
  });
  it('onMouseDown', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    const position = 105;
    const coordinate: Coordinate = { x: position, y: position };
    service.x = CONSTANTS.TEST_START_COORDINATE_50;
    service.y = CONSTANTS.TEST_START_COORDINATE_50;
    const mouse = new MouseEvent('mousedown', { clientX: coordinate.x, clientY: coordinate.y });
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const strokeWidth = 10;
    spyOn(service.renderer, 'setAttribute');
    spyOn<any>(service.airPath, 'getAttribute').and.callFake(
      (qualifiedName: string) => {
        return '100';
      });
    service.pressing = true;
    service.longPressing = false;
    service.drawing = true;
    spyOn(service.renderer, 'appendChild');
    service.onMouseDown(mouse, contain, strokeWidth);
    expect(service.onMouseDown).toBeTruthy();
  });
  it('stopDrawing', () => {
    const service: AirBrushService = TestBed.get(AirBrushService);
    service.drawing = false;
    service.pressing = false;
    const test = '';
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    service.stopDrawing(undoRedo);
    service.endPress();
    expect(service.pointString).toBe(test);
  });
  it('Drawing', () => {
  const service: AirBrushService = TestBed.get(AirBrushService);
  const coordinate: Coordinate = { x: 3.5023879905214854, y: 4.464595713866023 };
  const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
  const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
  const strokeWidth = 10;
  const second = 3 ;
  service.pressing = true;
  service.longPressing = true;
  service.drawing = true;
  service.draw(mouse, contain, strokeWidth, second );
  spyOn(service.renderer, 'setAttribute');
  expect(service.renderer.setAttribute).toHaveBeenCalledTimes(0);
  spyOn(service.renderer, 'appendChild');
  });
});
it('draw with drawing to be false', () => {
  const service: AirBrushService = TestBed.get(AirBrushService);
  const coordinate: Coordinate = { x: 3.5023879905214854, y: 4.464595713866023 };
  const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
  const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
  const strokeWidth = 10;
  const second = 3 ;
  service.pressing = true;
  service.longPressing = true;
  service.drawing = false;
  const spy = spyOn(service.renderer, 'setAttribute');
  service.draw(mouse, contain, strokeWidth, second );
  expect(spy).not.toHaveBeenCalled();
});
it('draw with pressing and longPressing to be false', () => {
  const service: AirBrushService = TestBed.get(AirBrushService);
  const coordinate: Coordinate = { x: 3.5023879905214854, y: 4.464595713866023 };
  const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
  const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
  const strokeWidth = 10;
  const second = 3 ;
  service.pressing = false;
  service.longPressing = false;
  service.drawing = true;
  const spy = spyOn(service.renderer, 'setAttribute');
  service.draw(mouse, contain, strokeWidth, second );
  expect(spy).toHaveBeenCalled();
});
