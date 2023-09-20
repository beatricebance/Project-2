import { ElementRef, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Coordinate } from '../commun-interface';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { LineService } from './line.service';

 // tslint:disable: no-magic-numbers
describe('LineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineService = TestBed.get(LineService);
    expect(service).toBeTruthy();
  });

  it('click ', () => {
    const service: LineService = TestBed.get(LineService);
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y});
    const contain = new ElementRef<SVGElement> ( document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    const strokeWidth = '3';
    const stroke = 'blue';
    service.click(mouse, contain, strokeWidth, stroke);
    expect(service.actualCoordinate).toEqual({x: mouse.clientX, y: mouse.clientY});
  });

  it('updateArray ', () => {
    const service: LineService = TestBed.get(LineService);
    const coordinate: Coordinate = {x: 100, y: 100};
    const strokeWidth = '3';
    const stroke = 'blue';
    const spyAttribute = spyOn(service.renderer, 'setAttribute');
    const spyAppendChild = spyOn(service.renderer, 'appendChild');
    const contain = new ElementRef<SVGElement> ( document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    service.updateArray(coordinate, contain , strokeWidth, stroke );
    expect(spyAttribute).toHaveBeenCalled();
    expect(spyAppendChild).toHaveBeenCalled();
  });

  it('draw', () => {
    const service: LineService = TestBed.get(LineService);
    const spy = spyOn(service.renderer, 'setAttribute');
    const position = 100;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
    service.arrayCoordinate.push({x: 9 , y :  9 });
    service.draw(mouse);
    expect(spy).toHaveBeenCalled();
    // size 0
    service.arrayCoordinate.length = 0 ;
    service.draw(mouse);
    expect(spy).toHaveBeenCalled();
  });

  it('draw when shift down', () => {
    const service: LineService = TestBed.get(LineService);
    const shiftClick = 'shiftClick';
    service[shiftClick] = true;
    const drawWithAngleSpy = spyOn(service, 'drawWithAngle').and.callThrough();
    const position = 100;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
    service.arrayCoordinate.push({x: 9 , y :  9 });
    service.draw(mouse);
    expect(drawWithAngleSpy).toHaveBeenCalled();
  });

  it('draw when second if true ', () => {
    const service: LineService = TestBed.get(LineService);
    const shiftClick = 'shiftClick';
    service[shiftClick] = true;
    const drawWithAngleSpy = spyOn(service, 'drawWithAngle').and.callThrough();
    const spy = spyOn(service.renderer, 'setAttribute');
    const position = 100;
    const size = 10;
    service.lastPointX = size;
    service.lastPointY = size;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
    service.arrayCoordinate.push({x: 9 , y :  9 });
    service.draw(mouse);
    expect(drawWithAngleSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('remove', () => {
    const service: LineService = TestBed.get(LineService);
    const test = '' ;
    const result = service.toString();
    service.remove();
    expect(result).toEqual(test);
  });

  it('should test escape ', () => {
    const service: LineService = TestBed.get(LineService);
    const spyAttribut = spyOn(service.renderer, 'setAttribute');
    service.arrayCoordinate.length = 0;
    service.escape();
    expect(service.arrayCoordinate.length).toEqual(0);
    expect(spyAttribut).toHaveBeenCalled();
  });

  it('should test backspace', () => {
    const service: LineService = TestBed.get(LineService);
    const setattribut = spyOn(service.renderer, 'setAttribute' );
    // inferieur a 2
    service.arrayCoordinate = [];
    service.backspace();
    expect(setattribut).toHaveBeenCalledTimes(0);

    // superieur a 2
    service.arrayCoordinate.push({x: 9 , y :  9 });
    service.arrayCoordinate.push({x: 10 , y :  10 });
    service.arrayCoordinate.push({x: 10 , y :  10 });
    service.arrayCoordinate.push({x: 10 , y :  10 });
    service.backspace();
    expect(setattribut).toHaveBeenCalledTimes(3);

  });

  it('doubleCLick', () => {
    const service: LineService = TestBed.get(LineService);
    const createElementSpy = spyOn(service.renderer, 'createElement');
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const position = 100;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
    service.arrayCoordinate.push({x: 9 , y :  9 });
    service.doubleClick(mouse, undoRedo);
    expect(service.arrayCoordinate.length).toEqual(0);
    expect(createElementSpy).toHaveBeenCalled();
  });

  it('shiftUp', () => {
    const service: LineService = TestBed.get(LineService);
    const shiftClick = 'shiftClick';
    service[shiftClick] = false;
    const spyDraw = spyOn(service, 'draw');
    const position = 100;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position});
    service.shiftUp(mouse);
    expect(spyDraw).toHaveBeenCalled();

  });

  it('shiftDown', () => {
    const service: LineService = TestBed.get(LineService);
    const shiftClick = 'shiftClick';
    service[shiftClick] = true;
    const spyDrawWithAngle = spyOn(service, 'drawWithAngle');
    const position = 100;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
    service.shiftDown(mouse);
    expect(spyDrawWithAngle).toHaveBeenCalled();
  });

  it('drawn with angle when angle < 22', () => {
    const service: LineService = TestBed.get(LineService);
    const positionX = 1;
    const positionY = 9;
    const coordinate: Coordinate = { x: positionX, y: positionY };
    const mouse = new MouseEvent('mousemove', { clientX: positionX, clientY: positionY });
    service.arrayCoordinate.push({x: 9 , y :  9 });
    service.drawWithAngle(mouse);
    expect(coordinate.x).toBe(mouse.x);
    expect(coordinate.y).toBe(service.arrayCoordinate[0].y);
  });

  it('drawn with angle when angle > 67', () => {
    const service: LineService = TestBed.get(LineService);
    const positionX = 9;
    const positionY = 1;
    const coordinate: Coordinate = { x: positionX, y: positionY };
    const mouse = new MouseEvent('mousemove', { clientX: positionX, clientY: positionY });
    service.arrayCoordinate.push({x: 9 , y :  9 });
    service.drawWithAngle(mouse);
    expect(coordinate.x).toBe(service.arrayCoordinate[0].x);
    expect(coordinate.y).toBe(mouse.y);
  });

  it('drawn with angle in the other case ', () => {
      const service: LineService = TestBed.get(LineService);
      const positionX = -1;
      const positionY = 1;
      const coordinate: Coordinate = { x: positionX, y: positionY };
      const mouse = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
      service.arrayCoordinate.push({x: 9 , y :  9 });
      service.drawWithAngle(mouse);
      expect(coordinate.x).toEqual(-1);
      expect(coordinate.y).toEqual(1);
    });

  it('draw with angle when (deltaX>0 && deltaY<0) || (deltaX<0 && deltaY>0)', () => {
      const service: LineService = TestBed.get(LineService);
      const positionX = 10;
      const positionY = 0;
      const coordinate: Coordinate = { x: positionX, y: positionY };
      const mouse1 = new MouseEvent('mousemove', { clientX: coordinate.x, clientY: coordinate.y });
      service.arrayCoordinate.push({x: 0 , y :  10 });
      service.drawWithAngle(mouse1);
      expect(coordinate.x).toEqual(10);
      expect(coordinate.y).toEqual(0);
      expect(service).toBeTruthy();
    });

  it('draw With angle', () => {
      const service: LineService = TestBed.get(LineService);
      const spy = spyOn(service.renderer, 'setAttribute');
      const position = 0;
      const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
      service.arrayCoordinate.push({x: 0, y :  0});
      service.drawWithAngle(mouse);
      expect(spy).not.toHaveBeenCalled();
  });

  it('draw With angle else paths', () => {
    const service: LineService = TestBed.get(LineService);
    const spy = spyOn(service.renderer, 'setAttribute');
    service.arrayCoordinate.length = 0 ;
    service.arrayCoordinate = [];
    const position = 100;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
    service.drawWithAngle(mouse);
    expect(spy).not.toHaveBeenCalled();

});

  it('junction', () => {
    const service: LineService = TestBed.get(LineService);
    const position = 100;
    const mouse = new MouseEvent('mousemove', { clientX: position, clientY: position });
    service.arrayCoordinate.push({x: 101 , y :  101 });
    service.junction(mouse);
    expect(service.lastPointX).toEqual(101);
    expect(service.lastPointY).toEqual(101);
    // entre 0 et -3
    service.arrayCoordinate = [];
    service.arrayCoordinate.push({x: 99 , y :  99 });
    service.junction(mouse);
    expect(service.lastPointX).toEqual(99);
    expect(service.lastPointY).toEqual(99);
     // inferieur a -3
    service.arrayCoordinate = [];
    service.arrayCoordinate.push({x: 90 , y :  90 });
    service.junction(mouse);
    expect(service.lastPointX).not.toEqual(90);
    expect(service.lastPointY).not.toEqual(90);
  });
});
