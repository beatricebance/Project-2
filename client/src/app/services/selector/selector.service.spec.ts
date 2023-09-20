// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any
import { TestBed } from '@angular/core/testing';
import { Box } from '../box';
import { Coordinate } from '../commun-interface';
import { SelectorService } from './selector.service';

describe('SelectorService', () => {
  let service: SelectorService;
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(SelectorService);
    service['mouse'] = {
      left: { down: { x: 0, y: 0 }, up: { x: 0, y: 0 }, isDown: false },
      right: { down: { x: 0, y: 0 }, up: { x: 0, y: 0 }, isDown: false },
      position: { x: 0, y: 0 }
    };
  });

  it('should be created', () => {
    service = TestBed.get(SelectorService);
    expect(service).toBeTruthy();
  });

  it('should test reset points for inversionRectangle', () => {
    service['inversionRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const spy = spyOn(service['inversionRectangle'], 'remove');
    service.resetPoints();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should test reset points for selectedElementsRectangle', () => {
    service['selectedElementsRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const spy = spyOn(service['selectedElementsRectangle'], 'remove');
    service.resetPoints();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should test reset points for selectionRectangle', () => {
    service = TestBed.get(SelectorService);
    service['selectionRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const spy = spyOn(service['selectionRectangle'], 'remove');
    service.resetPoints();
    expect(spy).toHaveBeenCalledTimes(1);

  });

  it('should test reset points for controlPoints', () => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    service['controlPoints'] = [];
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    const spy = spyOn(service['controlPoints'][1], 'remove');
    service.resetPoints();
    expect(spy).toHaveBeenCalledTimes(2);

  });

  it('#initializeSelector should allow right click and initialise all attributes ', (done: DoneFn) => {
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('contextmenu', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    const spy = spyOn(service, 'onRightClick');
    service.initializeSelector();
    service['svg'].dispatchEvent(event);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('#initializeSelector should activate wheel event listener ', (done: DoneFn) => {
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('wheel', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    const spy = spyOn(service['rotateSelection'], 'onWheel');
    service.initializeSelector();
    service['svg'].dispatchEvent(event);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should test rotate-selection on wheel for else path', () => {
    service = TestBed.get(SelectorService);
    const rotate = service['rotateSelection'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    service['selected'] = new Set<SVGElement>();
    service['selected'].add(element);
    service['selected'].add(element);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    service['controlPoints'] = [];
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['selectedElementsRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const spy = spyOn(rotate['selection'], 'selectAllArray');
    spyOn<any>(service, 'getElementBox').and.callFake(() => {
      return box;
    });
    rotate.onWheel('' as unknown as WheelEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should test rotate-selection on wheel for if path', () => {
    service = TestBed.get(SelectorService);
    const rotate = service['rotateSelection'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    element.setAttribute('transform', 'matrix(1,0,0,0,1,0)');
    service['selected'] = new Set<SVGElement>();
    service['selected'].add(element);
    service['selected'].add(element);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    service['controlPoints'] = [];
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['selectedElementsRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const mouse = new WheelEvent('scroll', {shiftKey: true, altKey: true, deltaY: -1});

    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const spy = spyOn(rotate['selection'], 'selectAllArray');
    spyOn<any>(service, 'getElementBox').and.callFake(() => {
      return box;
    });
    rotate.onWheel(mouse);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should test rotate-selection rotateOnAll with undifined box', () => {
    service = TestBed.get(SelectorService);
    const rotate = service['rotateSelection'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    element.setAttribute('transform', 'matrix(1,0,0,0,1,0)');
    service['selected'] = new Set<SVGElement>();
    service['selected'].add(element);
    service['selected'].add(element);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    service['controlPoints'] = [];
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['controlPoints'].push(circle);
    service['selectedElementsRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const spy = spyOn(rotate, 'rotate');
    spyOn<any>(service, 'getElementBox').and.callFake(() => {
      return undefined;
    });
    rotate.rotateOnAll(1);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#setSVG should create an SVG', () => {
    const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service.setSVG(element1);
    expect(service['svg']).toEqual(element1);
  });

  it('#onLeftMouseDown should let me know if left mouse is down', () => {
    service['mouse'].left.isDown = false;
    service['mouse'].left.down = { x: 0, y: 0 };
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    service['onLeftMouseDown'](event);
    expect(service['mouse'].left.isDown).toEqual(true);
    expect(service['mouse'].left.down.x).toEqual(100);
    expect(service['mouse'].left.down.y).toEqual(100);

  });

  it('#onRightMouseDown should let me know if right mouse is down', () => {
    service['mouse'].right.isDown = false;
    service['mouse'].right.down = { x: 0, y: 0 };
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });

    service['onRightMouseDown'](event);
    expect(service['mouse'].right.isDown).toEqual(true);
    expect(service['mouse'].right.down.x).toEqual(100);
    expect(service['mouse'].right.down.y).toEqual(100);

  });

  it('#onLeftMouseUp should let me know if left mouse is up', () => {
    service['mouse'].left.isDown = true;
    service['mouse'].left.up = { x: 0, y: 0 };
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    spyOn<any>(service, 'deleteRectangle');
    service['onLeftMouseUp'](event);
    expect(service['deleteRectangle']).toHaveBeenCalled();
    expect(service['mouse'].left.isDown).toEqual(false);
    expect(service['mouse'].left.up.x).toEqual(100);
    expect(service['mouse'].left.up.y).toEqual(100);

  });

  it('#onRightMouseUp should let me know if right mouse is up', () => {
    service['mouse'].right.isDown = true;
    service['mouse'].right.up = { x: 0, y: 0 };
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    spyOn<any>(service, 'deleteRectangle');
    service['onRightMouseUp'](event);
    expect(service['deleteRectangle']).toHaveBeenCalled();
    expect(service['mouse'].right.isDown).toEqual(false);
    expect(service['mouse'].right.up.x).toEqual(100);
    expect(service['mouse'].right.up.y).toEqual(100);

  });

  it('#sameCoordinate should indicate if 2 coordinates are the same', () => {
    const coords1: Coordinate = { x: 0, y: 0 };
    const coords2: Coordinate = { x: 0, y: 0 };
    service['sameCoordinate'](coords1, coords2);
    expect(service['sameCoordinate'](coords1, coords2)).toEqual(true);
  });

  it('#deleteRectangle should remove all lines of main rectangle', () => {
    const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spyOn(element1, 'setAttribute');
    service['deleteRectangle'](element1);
    expect(element1.setAttribute).toHaveBeenCalledTimes(2);
  });

  it('#deleteSelectedElementsRectangle should delete specific rectangle', () => {
    spyOn<any>(service, 'deleteRectangle');
    spyOn<any>(service, 'deleteControlPoints');
    service['deleteSelectedElementsRectangle']();
    expect(service['deleteRectangle']).toHaveBeenCalled();
    expect(service['deleteControlPoints']).toHaveBeenCalled();
  });

  it('#deleteControlPoints should remove all points on the rectangle', () => {
    service['controlPoints'] = [];
    const point = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const spy = spyOn(point, 'setAttribute');
    service['controlPoints'].push(point);
    service['deleteControlPoints']();
    expect(spy).toHaveBeenCalled();
  });

  it('#drawControlPoint should add one of the control points', () => {
    const position: Coordinate = { x: 0, y: 0 };
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spyOn(element, 'setAttribute');
    service.drawControlPoint(element, position);
    expect(element.setAttribute).toHaveBeenCalledTimes(4);
  });

  it('#onMouseDown should call left mouse down if left click', () => {
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
      button: 0
    });
    spyOn<any>(service, 'onLeftMouseDown');
    service.onMouseDown(event);
    expect(service['onLeftMouseDown']).toHaveBeenCalledWith(event);

  });
  it('#onMouseDown should call right mouse down if right click 1', () => {
    const event = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100,
      button: 2
    });
    spyOn<any>(service, 'onRightMouseDown');
    service.onMouseDown(event);
    expect(service['onRightMouseDown']).toHaveBeenCalledWith(event);
  });
  it('#onMouseDown should call right mouse down if right click 2', () => {
    const event = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100,
      button: 5
    });
    spyOn<any>(service, 'onRightMouseDown');
    service.onMouseDown(event);
    expect(service['onRightMouseDown']).not.toHaveBeenCalledWith(event);
  });

  it('#onMouseUp should call left mouse up if left click', () => {
    const event = new MouseEvent('mouseup', {
      clientX: 100,
      clientY: 100,
      button: 0
    });
    spyOn<any>(service, 'onLeftMouseUp');
    spyOn<any>(service, 'onRightMouseUp');
    service.onMouseUp(event);
    expect(service['onLeftMouseUp']).toHaveBeenCalled();
    expect(service['onRightMouseUp']).not.toHaveBeenCalled();
  });

  it('#onMouseUp should call right mouse up if right click 1', () => {
    const event = new MouseEvent('mouseup', {
      clientX: 100,
      clientY: 100,
      button: 2
    });
    spyOn<any>(service, 'onRightMouseUp');
    service.onMouseUp(event);
    expect(service['onRightMouseUp']).toHaveBeenCalled();
  });

  it('#onMouseUp should call right mouse up if right click 2', () => {
    const event = new MouseEvent('mouseup', {
      clientX: 100,
      clientY: 100,
      button: 5
    });
    spyOn<any>(service, 'onRightMouseUp');
    service.onMouseUp(event);
    expect(service['onRightMouseUp']).not.toHaveBeenCalled();
  });

  it('#onClick should call left click if left click', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100,
      button: 0
    });
    spyOn<any>(service, 'onLeftClick');
    service.onClick(event);
    expect(service['onLeftClick']).toHaveBeenCalledWith(event);

  });

  it('#onClick should call right click if right click 1', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100,
      button: 2
    });
    spyOn<any>(service, 'onRightClick');
    service.onClick(event);
    expect(service['onRightClick']).toHaveBeenCalledWith(event);

  });

  it('#onClick should call right click if right click 2', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100,
      button: 5
    });
    spyOn<any>(service, 'onRightClick');
    service.onClick(event);
    expect(service['onRightClick']).not.toHaveBeenCalledWith(event);

  });

  it('#onMouseMove should call left mouse move or right if left/right click', () => {
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
      button: 0
    });
    service['mouse'].left.isDown = true;
    service['mouse'].right.isDown = true;
    spyOn<any>(service, 'onLeftMouseMove');
    spyOn<any>(service, 'onRightMouseMove');
    service.onMouseMove(event);
    expect(service['mouse'].position.x).toEqual(100);
    expect(service['mouse'].position.y).toEqual(100);
    expect(service['onLeftMouseMove']).toHaveBeenCalled();
    expect(service['onRightMouseMove']).toHaveBeenCalled();

  });

  it('#onMouseMove should call left mouse move if left click', () => {
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
      button: 2
    });
    service['mouse'].left.isDown = false;
    service['mouse'].right.isDown = false;
    spyOn<any>(service, 'onLeftMouseMove');
    spyOn<any>(service, 'onRightMouseMove');
    service.onMouseMove(event);
    expect(service['mouse'].position.x).toEqual(100);
    expect(service['mouse'].position.y).toEqual(100);
    expect(service['onLeftMouseMove']).not.toHaveBeenCalled();
    expect(service['onRightMouseMove']).not.toHaveBeenCalled();

  });

  it('#drawControlPoints should draw all 4 points on rectangle', () => {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['controlPoints'] = [];
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    const element: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(element, width, height);
    spyOn(service, 'drawControlPoint');
    service.drawControlPoints(box);
    expect(service.drawControlPoint).toHaveBeenCalledTimes(4);
  });

  it('#selectAll ', () => {
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spyOn<any>(service, 'selectAllArray');
    service.selectAll();
    expect(service['selectAllArray']).toHaveBeenCalled();
  });

  it('#drawRectangle should create rectangle lines of inividual rectangles', () => {
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const color = 'red';
    const isBox = true;
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spyOn<any>(element, 'setAttribute');
    service.drawRectangle(element, box, color, isBox);
    expect(element.setAttribute).toHaveBeenCalledTimes(7);
  });

  it('#drawRectangle should create encompassing rectangle with dotted line', () => {
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const color = 'red';
    const isBox = false;
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spyOn<any>(element, 'setAttribute');
    service.drawRectangle(element, box, color, isBox);
    expect(element.setAttribute).toHaveBeenCalledTimes(8);
  });

  it('#drawSelectedElementsRectangle when left click is dragged on the page', () => {
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    spyOn(service, 'drawRectangle');
    spyOn(service, 'drawControlPoints');
    service.drawSelectedElementsRectangle(box);
    expect(service.drawRectangle).toHaveBeenCalled();
    expect(service.drawControlPoints).toHaveBeenCalled();

  });

  it('#onRightMouseMove should draw red rectangle and delete other crossing boxes', () => {
    service['selectedFreezed'] = new Set();
    spyOn(service, 'drawRectangle');
    spyOn<any>(service, 'selectAllArray');
    spyOn<any>(service, 'getSelectedElementsInArea').and.callFake(() => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      const test = new Set<SVGElement>();
      test.add(element);
      return [test, {}];
    });
    service['onRightMouseMove']();
    expect(service['drawRectangle']).toHaveBeenCalled();
    expect(service['selectAllArray']).toHaveBeenCalled();

  });
  it('#onRightMouseMove should draw red box and add objets that are not selected', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selectedFreezed'] = new Set<SVGElement>();
    service['selectedFreezed'].add(element);
    spyOn(service, 'drawRectangle');
    spyOn<any>(service, 'selectAllArray');
    spyOn<any>(service, 'getSelectedElementsInArea').and.callFake(() => {
      const test = new Set<SVGElement>();
      test.add(element);
      return [test, {}];
    });
    service['onRightMouseMove']();
    expect(service['drawRectangle']).toHaveBeenCalled();
    expect(service['selectAllArray']).toHaveBeenCalled();

  });
  it('#onLeftMouseMove should draw selection rectangle 1', () => {
    service['selectedFreezed'] = new Set();
    spyOn(service, 'drawRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    spyOn<any>(service, 'getSelectedElementsInArea').and.callFake(() => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const test = new Set<SVGElement>();
      test.add(element);
      return [test, {}];
    });
    service['onLeftMouseMove']();
    expect(service['drawRectangle']).toHaveBeenCalled();
    expect(service.drawSelectedElementsRectangle).toHaveBeenCalled();

  });

  it('#onLeftMouseMove should draw selection rectangle 2', () => {
    service['selected'] = new Set();
    service['selectedFreezed'] = new Set();
    service['selectedElementsRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spyOn(service, 'drawRectangle');
    spyOn<any>(service['selected'], 'clear');
    spyOn(service, 'drawSelectedElementsRectangle');
    spyOn<any>(service, 'getSelectedElementsInArea').and.callFake(() => {
      const test = new Set<SVGElement>();
      return [test, {}];
    });
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['controlPoints'] = [];
    service['controlPoints'].push(svgElement);
    service['onLeftMouseMove']();
    expect(service['selected'].clear).toHaveBeenCalled();
    expect(service['drawRectangle']).toHaveBeenCalled();
  });

  it('#initialiseAttribute should initialise all elements used', () => {
    service['mouse'].left.isDown = true;
    service['mouse'].right.isDown = true;
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['controlPoints'] = [];
    service['controlPoints'].push(element);
    service['selectionRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['inversionRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selectedElementsRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selectedFreezed'] = new Set();
    service['initialiseAttributes']();
    expect(service['mouse'].left.isDown).toEqual(false);
    expect(service['mouse'].right.isDown).toEqual(false);

  });
  it('#getSelectedElementsInArea should group together all element boxes 1', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'].appendChild(element);
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['controlPoints'] = [];
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    spyOn<any>(service, 'getElementBox');
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return true;
    });
    service['getSelectedElementsInArea'](box);
    expect(service['getElementBox']).toHaveBeenCalled();
  });

  it('#getSelectedElementsInArea should group together all element boxes 2', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'].appendChild(element);
    service['svg'].appendChild(element2);
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['controlPoints'] = [];
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    service['controlPoints'].push(svgElement);
    spyOn<any>(service, 'getElementBox').and.callFake(() => {
      return box;
    });
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    service['getSelectedElementsInArea'](box);
    expect(service['getElementBox']).toHaveBeenCalled();

  });

  it('#onLeftClick should create the element box clicked 1', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selectedElementsRectangle'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return true;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    service.onLeftClick(event);
    expect(service['deleteSelectedElementsRectangle']).toHaveBeenCalled();
  });

  it('#onLeftClick should create the element box clicked 2', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    service.onLeftClick(event);
    expect(service['deleteSelectedElementsRectangle']).not.toHaveBeenCalled();
    expect(service.drawSelectedElementsRectangle).toHaveBeenCalled();
  });

  it('#onLeftClick should create the element box clicked 3', () => {
    service['mouse'].left.down.x = 2;
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    service.onLeftClick(event);
    expect(service['deleteSelectedElementsRectangle']).not.toHaveBeenCalled();
    expect(service.drawSelectedElementsRectangle).not.toHaveBeenCalled();
  });

  it('#onRightClick should unselect the element box clicked 1', () => {
    service['selected'] = new Set();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    spyOn<any>(service['selected'], 'has').and.callFake(() => {
      return true;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    const spy = spyOn<any>(service, 'selectAllArray');
    service.onRightClick(event);
    expect(spy).toHaveBeenCalled();

  });

  it('#onRightClick should unselect the element box clicked 2', () => {
    service['selected'] = new Set();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    spyOn<any>(service['selected'], 'has').and.callFake(() => {
      return false;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    const spy = spyOn<any>(service, 'selectAllArray');
    service.onRightClick(event);
    expect(spy).toHaveBeenCalled();

  });

  it('#onRightClick should unselect the element box clicked 3', () => {
    service['mouse'].right.down.x = 8;
    service['selected'] = new Set();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 150,
      button: 2
    });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    spyOn<any>(service['selected'], 'has').and.callFake(() => {
      return false;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    const spy = spyOn<any>(service, 'selectAllArray');
    service.onRightClick(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#selectAllArray adds up all the selected elements in an array 1', () => {
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selected'] = new Set();
    service['selected'].add(element);
    service['selected'].add(element);
    const tab = new Set<SVGElement>();
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return true;
    });
    spyOn<any>(service, 'getElementBox').and.callFake(() => {
      return box;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    tab.add(element);
    service['selectAllArray'](tab);
    expect(service['deleteSelectedElementsRectangle']).toHaveBeenCalled();
  });

  it('#selectAllArray adds up all the selected elements in an array 2', () => {
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selected'] = new Set();
    service['selected'].add(element);
    service['selected'].add(element);
    const tab = new Set<SVGElement>();
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    spyOn<any>(service, 'getElementBox').and.callFake(() => {
      return box;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    tab.add(element);
    service['selectAllArray'](tab);
    expect(service['deleteSelectedElementsRectangle']).not.toHaveBeenCalled();
    expect(service.drawSelectedElementsRectangle).toHaveBeenCalled();
  });

  it('#selectAllArray other', () => {
    const elementBox: Coordinate = { x: 0, y: 0 };
    const width = 5;
    const height = 5;
    const box = new Box(elementBox, width, height);
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selected'] = new Set();
    service['selected'].add(element);
    service['selected'].add(element);
    const tab = new Set<SVGElement>();
    spyOn<any>(service, 'shouldBeIgnored').and.callFake(() => {
      return false;
    });
    spyOn<any>(service, 'getElementBox').and.callFake(() => {
      return box;
    });
    spyOn<any>(service, 'deleteSelectedElementsRectangle');
    spyOn(service, 'drawSelectedElementsRectangle');
    tab.add(element);
    tab.add(element.cloneNode(true) as SVGElement);
    service['selectAllArray'](tab);
    expect(service['deleteSelectedElementsRectangle']).not.toHaveBeenCalled();
    expect(service.drawSelectedElementsRectangle).toHaveBeenCalled();
  });

  it('#shouldBeIgnored 1', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['controlPoints'] = [];
    service['controlPoints'].push(element);
    service['controlPoints'].push(element);
    service['controlPoints'].push(element);
    service['controlPoints'].push(element);
    service['shouldBeIgnored'](element);
    expect(service['controlPoints'][0]).toEqual(element);

  });

  it('#shouldBeIgnored 2', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    service['controlPoints'] = [];
    service['controlPoints'].push(element);
    service['controlPoints'].push(element2);
    service['controlPoints'].push(element);
    service['controlPoints'].push(element);
    service['shouldBeIgnored'](element2);
    expect(service['controlPoints'][1]).toEqual(element2);
  });

  it('#shouldBeIgnored 3', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    service['controlPoints'] = [];
    service['controlPoints'].push(element);
    service['controlPoints'].push(element);
    service['controlPoints'].push(element2);
    service['controlPoints'].push(element);
    service['shouldBeIgnored'](element2);
    expect(service['controlPoints'][2]).toEqual(element2);
  });

  it('#shouldBeIgnored 4', () => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    service['controlPoints'] = [];
    service['controlPoints'].push(element);
    service['controlPoints'].push(element);
    service['controlPoints'].push(element);
    service['controlPoints'].push(element2);
    service['shouldBeIgnored'](element2);
    expect(service['controlPoints'][3]).toEqual(element2);
  });

  it('test clipboard fonctions in selection', () => {
    service['svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selected'] = new Set();
    service['selected'].add(element);
    service['selected'].add(element);
    service.copy();

    spyOn<any>(service['clipboard'], 'paste').and.callFake(() => {
      return;
    });
    service.paste();
    expect(service['clipboard'].paste).toHaveBeenCalled();

    spyOn<any>(service['clipboard'], 'cut').and.callFake(() => {
      return;
    });
    service.cut();
    expect(service['clipboard'].cut).toHaveBeenCalled();

    spyOn<any>(service['clipboard'], 'duplicate').and.callFake(() => {
      return;
    });
    service.duplicate();
    expect(service['clipboard'].duplicate).toHaveBeenCalled();

    spyOn<any>(service['clipboard'], 'delete').and.callFake(() => {
      return;
    });
    service.delete();
    expect(service['clipboard'].delete).toHaveBeenCalled();

  });
  it('#test function pasteForOtherShape', () => {
    const clipboard = service['clipboard'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
    const boardShape = new Set<SVGElement>();
    boardShape.add(element.cloneNode(true) as SVGElement);
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pathElement.setAttribute('x', 'x');
    pathElement.setAttribute('y', 'y');
    svg.appendChild(pathElement);
    const spy = spyOn(service.renderer, 'setAttribute');
    clipboard.pasteForOtherShape(boardShape, svg, 2, 2);
    expect(spy).toHaveBeenCalled();
  });

  it('#pasteForOtherShape should return nothing if empty string', () => {
    const clipboard =  service['clipboard'];
    const boardShape = new Set<SVGElement>();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    element.setAttribute('d', '1 2 1 ');
    boardShape.add(element);
    clipboard.pasteForOtherShape(boardShape, svg, 2, 2);
    expect().nothing();
  });

  it('#test function pasteForPolygon if path', () => {
    const clipboard = service['clipboard'];
    clipboard['board'] = new Set<SVGElement>();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.setAttribute('d', 'M1 23 M90');
    clipboard['board'].add(element);
    clipboard['board'].add(element2);
    svg.appendChild(element);
    svg.appendChild(element2);
    const spy = spyOn(service.renderer, 'setAttribute');
    spyOn<any>(svg, 'getAttribute').and.callFake(
      (qualifiedName: string) => {
        return;
      });
    clipboard. pasteForPolygon(svg, 2);
    expect(spy).toHaveBeenCalled();
  });

  it('#test function pasteForPolygon else path', () => {
    const clipboard = service['clipboard'];
    clipboard['board'] = new Set<SVGElement>();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.setAttribute('d', '["", " 55, 44 a 1 1 0 1,0 0 1,0 "]');
    clipboard['board'].add(element);
    svg.appendChild(element);
    const spy = spyOn(service.renderer, 'setAttribute');
    spyOn<any>(svg, 'getAttribute').and.callFake(
      (qualifiedName: string) => {
        return;
      });
    clipboard. pasteForPolygon(svg, 2);
    expect(spy).toHaveBeenCalled();
  });

  it('#delete should delete svg', () => {
    const clipboard = service['clipboard'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selected'] = new Set<SVGElement>();
    service['selected'].add(element);
    const spy = spyOn(svg, 'removeChild');
    clipboard.delete(svg);
    expect(spy).toHaveBeenCalled();
  });

  it('#cut should cut svg', () => {
    const clipboard = service['clipboard'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selected'] = new Set<SVGElement>();
    service['selected'].add(element);
    const spy = spyOn(svg, 'removeChild');
    clipboard.cut(svg);
    expect(spy).toHaveBeenCalled();
  });

  it('#duplicate should duplicate svg', () => {
    const clipboard = service['clipboard'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['selected'] = new Set<SVGElement>();
    service['selected'].add(element);
    const spy1 = spyOn(clipboard['boardForDuplication'], 'add');
    const spy2 = spyOn(clipboard, 'pasteForDuplication');
    clipboard.duplicate(svg);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('#test function pasteForLine', () => {
    const clipboard = service['clipboard'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '1 4 5 6');
    lineGroup.appendChild(element);
    lineGroup.appendChild(polyline);
    lineGroup.appendChild(element);
    lineGroup.appendChild(element);
    const spy = spyOn(service.renderer, 'appendChild');
    clipboard.pasteForLine(lineGroup, svg, 2, 2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('#test function pasteForLine else path', () => {
    const clipboard = service['clipboard'];
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '["", "  "]');
    lineGroup.appendChild(element);
    lineGroup.appendChild(polyline);
    lineGroup.appendChild(element);
    lineGroup.appendChild(element);
    const spy = spyOn(service.renderer, 'appendChild');
    clipboard.pasteForLine(lineGroup, svg, 2, 2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('#test function paste line', () => {
    const clipboard = service['clipboard'];
    clipboard['board'] = new Set<SVGElement>();
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    lineGroup.appendChild(circle);
    lineGroup.appendChild(polyline);
    lineGroup.appendChild(circle);
    lineGroup.appendChild(circle);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.appendChild(lineGroup);
    clipboard['board'].add(lineGroup);
    clipboard['distanceXCopy'] = 1;
    clipboard['distanceYCopy'] = 2;

    clipboard.paste(svg);
    expect().nothing();
  });

  it('#test function paste tools', () => {
    const clipboard = service['clipboard'];
    clipboard['board'] = new Set<SVGElement>();
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', '0 1 0 1 0M 0 1 0 1 10 10 a1 01 M 0 1 0 1 10 10 M 0 1 0 1 10 10 a1 0M a1 01 10 10 1 01 01 0M 0 1 0 1 0 10 1 01 01 0M 0 1 0 1 10 1 01 01 0M 0 1 0 1 10  0M 0 1 0 1 10 10  01 0M 0 1 0 1 10 0M 0 1 10 1 01 01 0M 0 1  01 10 10 1 01 01 0M 0 1 0  10 1 01 01 0M ');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', '0 1 0 1 0M 0 1 0 1 10 10 a1 01 ');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
    svg.appendChild(path);
    clipboard['board'].add(path);
    clipboard['board'].add(path2);

    clipboard['distanceXCopy'] = 1;
    clipboard['distanceYCopy'] = 2;

    clipboard.paste(svg);
    expect().nothing();
  });

  it('#test function paste otherShapes', () => {
    const clipboard = service['clipboard'];
    clipboard['board'] = new Set<SVGElement>();
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rect.setAttribute('height', '0');
    rect.setAttribute('width', '0');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.appendChild(rect);

    clipboard['board'].add(rect);

    clipboard['distanceXCopy'] = 1;
    clipboard['distanceYCopy'] = 2;

    clipboard.paste(svg);
    expect().nothing();
  });

  it('#test function pasteForDuplication line', () => {
    const clipboard = service['clipboard'];
    clipboard['boardForDuplication'] = new Set<SVGElement>();
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    lineGroup.appendChild(circle);
    lineGroup.appendChild(polyline);
    lineGroup.appendChild(circle);
    lineGroup.appendChild(circle);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.appendChild(lineGroup);
    clipboard['boardForDuplication'].add(lineGroup);
    clipboard['distanceXDuplication'] = 1;
    clipboard['distanceYDuplication'] = 2;

    clipboard.pasteForDuplication(svg);
    expect().nothing();
  });

  it('#test function pasteForDuplication tools', () => {
    const clipboard = service['clipboard'];
    clipboard['boardForDuplication'] = new Set<SVGElement>();
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', '0 1 0 1 0M 0 1 0 1 10 10 a1 01 M 0 1 0 1 10 10 M 0 1 0 1 10 10 a1 0M a1 01 10 10 1 01 01 0M 0 1 0 1 0 10 1 01 01 0M 0 1 0 1 10 1 01 01 0M 0 1 0 1 10  0M 0 1 0 1 10 10  01 0M 0 1 0 1 10 0M 0 1 10 1 01 01 0M 0 1  01 10 10 1 01 01 0M 0 1 0  10 1 01 01 0M ');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', '0 1 0 1 0M 0 1 0 1 10 10 a1 01 ');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.appendChild(path);
    clipboard['boardForDuplication'].add(path);
    clipboard['boardForDuplication'].add(path2);

    clipboard['distanceXDuplication'] = 1;
    clipboard['distanceYDuplication'] = 2;

    clipboard.pasteForDuplication(svg);
    expect().nothing();
  });

  it('#test function pasteForDuplication otherShapes', () => {
    const clipboard = service['clipboard'];
    clipboard['boardForDuplication'] = new Set<SVGElement>();
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rect.setAttribute('height', '0');
    rect.setAttribute('width', '0');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.appendChild(rect);

    clipboard['boardForDuplication'].add(rect);

    clipboard['distanceXDuplication'] = 1;
    clipboard['distanceYDuplication'] = 2;

    clipboard.pasteForDuplication(svg);
    expect().nothing();
  });

  // tslint:disable-next-line: max-file-line-count
});
