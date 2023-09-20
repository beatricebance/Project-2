import { TestBed } from '@angular/core/testing';
import {SvgAttributes} from '../../constants/enum';
import { GridService } from './grid.service';

describe('GridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridService = TestBed.get(GridService);
    expect(service).toBeTruthy();
  });

  it('remove', () => {
    const service: GridService = TestBed.get(GridService);
    const removeChild = spyOn(service.renderer, 'removeChild');
    const container = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);

    service.remove(container);
    expect(removeChild);
    expect(service).toBeTruthy();
  });

  it('grid', () => {
    const service: GridService = TestBed.get(GridService);
    const setAttributeSpy = spyOn(service.renderer, 'setAttribute');
    const appenChildSpy = spyOn(service.renderer, 'appendChild');
    const container = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);
    const opacity = 0.5;
    const space = 20;
    service.grid(container, opacity, space);
    expect(setAttributeSpy).toHaveBeenCalled();
    expect(appenChildSpy).toHaveBeenCalled();
  });

  it('grid first for', () => {
    const service: GridService = TestBed.get(GridService);
    const appenChildSpy = spyOn(service.renderer, 'appendChild');
    const container = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);
    const opacity = 0.5;
    const space = 20;
    const test = ' M 20 0 V 40M 0 20 H 40 ' ;
    service.viewDrawingParameter.svgHeight = space * 2;
    service.viewDrawingParameter.svgWidth = space * 2;
    service.grid(container, opacity, space);
    expect(service.path).toBe(test);
    expect(appenChildSpy).toHaveBeenCalled();
  });

  it('reduce size ', () => {
    const service: GridService = TestBed.get(GridService);
    const space = 20;
    const container = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);
    const opacity = 0.5;
    const removeSpy = spyOn(service, 'remove');
    const gridSpy = spyOn(service, 'grid');
    service.reduceSize(container, opacity, space);
    expect(removeSpy).toHaveBeenCalled();
    expect(gridSpy).toHaveBeenCalled();

    const drawingData = 'drawingData';
    service[drawingData].space = 2;
    service.reduceSize(container, opacity, space);

  });

  it('increase size ', () => {
    const service: GridService = TestBed.get(GridService);
    const space = 20;
    const container = service.renderer.createElement(SvgAttributes.RECT, SvgAttributes.STRING);
    const opacity = 0.5;
    const removeSpy = spyOn(service, 'remove');
    const gridSpy = spyOn(service, 'grid');
    service.increaseSize(container, opacity, space);
    expect(removeSpy).toHaveBeenCalled();
    expect(gridSpy).toHaveBeenCalled();

    const drawingData = 'drawingData';
    // tslint:disable-next-line: no-magic-numbers
    service[drawingData].space = 150;
    service.increaseSize(container, opacity, space);
  });

});
