import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgAttributes } from 'src/app/constants/enum';
import * as CONSTANTS from '../../constants/constants';
import { CalligraphyService } from './calligraphy.service';

describe('CalligraphyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalligraphyService = TestBed.get(CalligraphyService);
    expect(service).toBeTruthy();
  });

  it('should test onMouseDown()', () => {
    const service: CalligraphyService = TestBed.get(CalligraphyService);
    const setAttribute = spyOn(service.renderer, 'setAttribute');
    const angle = CONSTANTS.CALLIGRAPHY_ANGLE_15;
    const lineSize = 12;
    const mouse = new MouseEvent('mousemove', { clientX: 100, clientY: 100});
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));

    service.onMouseDown(mouse, contain, angle, lineSize);
    expect(setAttribute).toHaveBeenCalled();
  });

  it('should test onMouseUp()', () => {
    const service: CalligraphyService = TestBed.get(CalligraphyService);
    const click = 'click';
    service[click] = false;
    service.onMouseUp();
    expect(service[click]).toBeFalsy();
  });

  it('should test onMouseMove()', () => {
    const service: CalligraphyService = TestBed.get(CalligraphyService);
    const setAttribute = spyOn(service.renderer, 'setAttribute');
    const angle = CONSTANTS.CALLIGRAPHY_ANGLE_15;
    const lineSize = 12;
    const mouse = new MouseEvent('mousemove', { clientX: 100, clientY: 100});
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));

    service.onMouseMove(mouse, contain, angle, lineSize);
    expect(setAttribute).not.toHaveBeenCalled();

    const click = 'click';
    service[click] = true;
    service.onMouseMove(mouse, contain, angle, lineSize);
    expect(setAttribute).toHaveBeenCalled();

  });

  it('should test setPath()', () => {
    const service: CalligraphyService = TestBed.get(CalligraphyService);
    const setAttribute = spyOn(service.renderer, 'setAttribute');
    const angle = CONSTANTS.CALLIGRAPHY_ANGLE_15;
    const lineSize = 12;
    const mouse = new MouseEvent('mousemove', { clientX: 100, clientY: 100});
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));

    service.setPath(mouse, contain, angle, lineSize);
    expect(setAttribute).toHaveBeenCalled();
  });

  it('should test rotate()', () => {
    const service: CalligraphyService = TestBed.get(CalligraphyService);
    const angle = CONSTANTS.CALLIGRAPHY_ANGLE_15;
    const lineSize = 12;
    const mouse = new MouseEvent('mousemove', { clientX: 100, clientY: 100});

    service.rotate(mouse, angle, lineSize);
    expect().nothing();

  });
});
