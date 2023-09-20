import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Coordinate } from '../commun-interface';
import { PipetteService } from './pipette.service';
// tslint:disable: no-magic-numbers

describe('PipetteService', () => {
  let service: PipetteService;
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(PipetteService);
  });

  it('should be created', () => {
    service = TestBed.get(PipetteService);
    expect(service).toBeTruthy();
  });

  it('#initializePipette should remove the default menu and allow right click ', (done: DoneFn) => {
    const spy = spyOn(service.eventManager, 'addEventListener');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('contextmenu', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    spyOn(service, 'onRightClick');
    service.initializePipette(svg);
    svg.dispatchEvent(event);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 10);  });

  it('#rgbToHex should give a hex with 0 if length is smaller than 2', () => {
    service.hex = '0';
    const color = 0;
    service.rgbToHex(color);
    expect(service.hex).toEqual('00');
  });

  it('#rgbToHex should give a hex using the rgb color', () => {
    service.hex = '00';
    const color = 255;
    service.rgbToHex(color);
    expect(service.hex).toBe('ff');
  });

  it('#getColorAtPosition should return an empty string if null', () => {
    service.context = null;
    const coord: Coordinate = {x: 0, y: 0};
    const contain = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    spyOn(service, 'svgToACanvas');
    service.getColorAtPosition(coord, contain);
    expect(service.getColorAtPosition({x: 0, y: 0}, contain)).toEqual('');
    expect(service.svgToACanvas).toHaveBeenCalled();
    });

  it('#onClick does not go into first if', () => {
    const contain = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 0
    });
    // const coord: Coordinate = { x: event.offsetX, y: event.offsetY };
    spyOn(service, 'getColorAtPosition');
    service.onClick(event, contain);
    expect(service.getColorAtPosition).toHaveBeenCalled();
  });

  it('#onClick goes into first if and is a left click', () => {
    const contain = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 0
    });
    service.colorDataService.primaryColor = 'FFFFFF';
    const pipetteColor = '#000000';
    service.onClick(event, contain);
    expect(service.colorDataService.primaryColor).toEqual(pipetteColor);
  });

  it('#onClick goes into first if and is a right click', () => {
    const contain = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    spyOn(service, 'onRightClick');
    service.onClick(event, contain);
    expect(service.onRightClick).toHaveBeenCalled();
  });

  it('#onClick else path', () => {
    const contain = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    spyOn(service, 'onRightClick');
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 3
    });
    service.onClick(event, contain);
    expect(service.onRightClick).not.toHaveBeenCalled();
  });

  it('#onRightClick should put the pipette color as the secondaryColor', () => {
    service.colorDataService.secondaryColor = 'FFFFFF';
    const pipetteColor = '000000';
    service.onRightClick(pipetteColor);
    expect(service.colorDataService.secondaryColor).toEqual(pipetteColor);
  });

  it('#svgToACanvas ', () => {
    const element = new ElementRef<SVGElement>(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
    service.svgToACanvas(element);
    expect(service.context).not.toEqual(null);
  });

});
