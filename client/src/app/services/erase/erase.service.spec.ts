import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import {TestBed } from '@angular/core/testing';
import {SvgAttributes} from '../../constants/enum';
import { Coordinate } from '../commun-interface';
import { EraseService } from './erase.service';
// tslint:disable: max-classes-per-file
// tslint:disable: no-any

class MockRendererFactory {
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
}

describe('EraseService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: Renderer2, useClass: MockRenderer},
      {provide: RendererFactory2, useClass: MockRendererFactory}]
  }));

  it('should be created', () => {
    const service: EraseService = TestBed.get(EraseService);
    expect(service).toBeTruthy();
  });

  it('eraseInput', () => {
    const service: EraseService = TestBed.get(EraseService);
    const size = 5;
    const setAttributeSpy = spyOn(service.renderer, 'setAttribute').and.callThrough();
    service.eraseInput(size);
    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
  });

  it('eraseActivate', () => {
    const service: EraseService = TestBed.get(EraseService);
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const appendChildSpy = spyOn(service.renderer, 'appendChild').and.callThrough();
    service.eraseActivate(contain);
    expect(appendChildSpy).toHaveBeenCalledTimes(1);
  });

  it('eraseDeactivate', () => {
    const service: EraseService = TestBed.get(EraseService);
    const rect = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);
    const removeChilddSpy = spyOn(service.renderer, 'removeChild').and.callThrough();
    service.eraseDeactivate(rect);
    expect(removeChilddSpy).toHaveBeenCalled();
  });

  it('onMouseUp', () => {
    const service: EraseService = TestBed.get(EraseService);
    const click = 'click';
    service[click] = true;
    service.onMouseUp();
    expect(service[click]).toBeFalsy();
  });

  it('onMouseUp when click is false', () => {
    const service: EraseService = TestBed.get(EraseService);
    const click = 'click';
    service[click] = false;
    service.onMouseUp();
    expect(service[click]).toBeFalsy();
  });

  it('onMouseDown when click is true', () => {
    const service: EraseService = TestBed.get(EraseService);
    const click = 'click';
    service[click] = true;
    const rect = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);

    service.onMouseDown(rect);
    expect(service[click]).toBeTruthy();
  });

  it('onMouseDown when the map equal 0', () => {
    const service: EraseService = TestBed.get(EraseService);
    const removeChilddSpy = spyOn(service.renderer, 'removeChild').and.callThrough();
    const setAttributeSpy = spyOn(service.renderer, 'setAttribute').and.callThrough();

    const rect = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);
    expect(removeChilddSpy).not.toHaveBeenCalled();
    expect(setAttributeSpy).not.toHaveBeenCalled();
    service.onMouseDown(rect);
  });

  it('onMouseDown remove', () => {
    const service: EraseService = TestBed.get(EraseService);
    const click = 'click';
    service[click] = false;
    service.eraseMap.set('' as unknown as Element, '');
    const rect = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);
    const removeChildSpy = spyOn(service.renderer, 'removeChild').and.callThrough();
    const setAttributeSpy = spyOn(service.renderer, 'setAttribute').and.callThrough();
    service.onMouseDown(rect);
    expect(setAttributeSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('detect', () => {
    const service: EraseService = TestBed.get(EraseService);
    const setAttributeSpy = spyOn(service.eraseElement, 'getAttribute');
    const spySetAttribute = spyOn(service.eraseElement, 'setAttribute');
    const center = 5;
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service.detect( center, contain);
    expect(setAttributeSpy).toHaveBeenCalled();
    expect(spySetAttribute).toHaveBeenCalled();
  });

  it('mouseMove', () => {
    const service: EraseService = TestBed.get(EraseService);
    const setAttributeSpy = spyOn(service.renderer, 'setAttribute').and.callThrough();
    const position = 100;
    const center = 5;
    const coordinate: Coordinate = {x: position, y: position};
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y});
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service.mouseMouve(mouse, center, contain);
    expect(setAttributeSpy).toHaveBeenCalled();

    const click = 'click';
    service[click] = true;
    service.eraseMap.set('' as unknown as Element, '');
    service.mouseMouve(mouse, center, contain);
    expect(service[click]).toBeTruthy();

  });
});
