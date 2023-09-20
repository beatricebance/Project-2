import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrushService } from './brush.service';

describe('BrushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });

  it('updateFilter', () => {
    const service: BrushService = TestBed.get(BrushService);
    const filt = 'HDHD';
    service.updateFilter(filt);
    expect(service.filter).toEqual(filt);
  });

  it('draw works when begin path is true', () => {
    const service: BrushService = TestBed.get(BrushService);

    const mouse = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 150
    });
    const drawingData = 'drawingData';
    service[drawingData].beginPath = true;
    const stroke = '10';
    const contain = new ElementRef<SVGElement> ( document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    const test = '100 150 ';
    const nbCalls = 7;
    spyOn(service.renderer, 'setAttribute');
    // tslint:disable-next-line: no-any
    service.draw(mouse, contain, stroke);
    // tslint:disable-next-line: no-string-literal
    expect(service['pointString']).toBe(test);
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(nbCalls);
  });

  it('set attribute should not been called when begin path is false', () => {
    const service: BrushService = TestBed.get(BrushService);

    const spy = spyOn(service.renderer, 'setAttribute');

    service.draw(
      ' ' as unknown as MouseEvent,
      ' ' as unknown as ElementRef,
      ' '
    );

    expect(spy).not.toHaveBeenCalled();

  });
});
