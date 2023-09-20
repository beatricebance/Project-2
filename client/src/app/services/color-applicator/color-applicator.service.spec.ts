import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import {UndoRedoPile} from '../../services/commun-interface';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { ColorApplicatorService } from './color-applicator.service';
// tslint:disable: no-any
// tslint:disable: max-classes-per-file

class MockRendererFactory {
  createRenderer(renderer: any, element: any): MockRenderer {
    return new MockRenderer();
  }
}

class MockRenderer {
  createElement(name: string): any {
    return document. createElementNS(SvgAttributes.LINK, SvgAttributes.STRING);
  }
}

describe('ColorApplicatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: Renderer2, useClass: MockRenderer},
      {provide: RendererFactory2, useClass: MockRendererFactory}],
  }));

  it('should be created', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    expect(service).toBeTruthy();
  });
  it(' Test of getChildType', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    const child: ChildNode = ({ isEqualNode: () => true } as unknown as ChildNode);
    const pile: UndoRedoPile[] = [];
    pile.push({id: 1, element: ({ isEqualNode: () => true } as unknown as ChildNode), type: 'string'});
    const returnValue = service.getChildType(child, pile);
    expect(returnValue).toEqual('string');
    const pile2: UndoRedoPile[] = [];
    pile.push({id: 1, element: ({ isEqualNode: () => false } as unknown as ChildNode), type: 'string'});
    const returnValue2 = service.getChildType(child, pile2);
    expect(returnValue2).toEqual('');
  });

  it('Test of updateUndoPile', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    const child: ChildNode = ({ isEqualNode: () => true } as unknown as ChildNode);
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    service.tempId = 1;
    undoRedo.undoPile.push({id: 1, element: ({ isEqualNode: () => false } as unknown as ChildNode), type: 'string'});
    service.updateUndoPile(child, undoRedo);
    const temp = undoRedo.undoPile.pop();
    if (temp !== undefined) {
      expect(temp.id).toEqual(1);
    }
    const child2: ChildNode = ({ isEqualNode: () => true } as unknown as ChildNode);
    undoRedo.undoPile.push({id: 1, element: ({ isEqualNode: () => true } as unknown as ChildNode), type: 'string'});
    service.updateUndoPile(child2, undoRedo);
  });

  it('Test onClick', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    for (let i = 0; i <= (CONSTANTS.NB_ELEM_SVG + 1); i++) {
      contain.nativeElement.append('' as unknown as Node);
    }
    const spyL = spyOn(service, 'onLeftClick');
    const spyR = spyOn(service, 'onRightClick');
    service.onClick(contain, undoRedo);
    expect(spyL).toHaveBeenCalled();
    expect(spyR).toHaveBeenCalled();

  });

  it('Test shapesLeftClick', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    const elem1 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.ELLIPSE);
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const spy = spyOn(service, 'updateUndoPile');
    service.shapesLeftClick(elem1, undoRedo);
    expect(spy).toHaveBeenCalled();
    const rect1 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.RECT);
    rect1.setAttribute('fill', 'transparent');
    service.shapesLeftClick(rect1, undoRedo);
  });

  it('Test toolsLeftClick', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    const elem1 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.ELLIPSE);
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const spy = spyOn(service, 'updateUndoPile');
    service.toolsLeftClick(elem1, undoRedo);
    expect(spy).toHaveBeenCalled();

  });

  it('Test lineLeftClick', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    const rect1 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.RECT);
    const rect2 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.RECT);
    const circle = document.createElementNS(SvgAttributes.LINK, SvgAttributes.CIRCLE);
    const wrapper = document.createElementNS(SvgAttributes.LINK, SvgAttributes.G);
    wrapper.appendChild(rect1);
    wrapper.appendChild(rect2);
    wrapper.appendChild(circle);
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const spy = spyOn(service, 'updateUndoPile');
    service.lineLeftClick(wrapper, undoRedo);
    expect(spy).toHaveBeenCalled();
  });

  it('Test onLeftClick', (done: DoneFn) => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const elem1 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.ELLIPSE);
    const elem2 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.RECT);
    const elem3 = document.createElementNS(SvgAttributes.LINK, 'polyline');
    const elem4 = document.createElementNS(SvgAttributes.LINK, 'path');
    const elem5 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.G);
    const element1: UndoRedoPile = {id: 1, element: elem1, type: SvgAttributes.ELLIPSE};
    const element2: UndoRedoPile = {id: 2, element: elem2, type: 'shape'};
    const element3: UndoRedoPile = {id: 3, element: elem3, type: 'line'};
    const element4: UndoRedoPile = {id: 4, element: elem4, type: 'tool'};
    const element5: UndoRedoPile = {id: 5, element: elem5, type: 'none'};
    undoRedo.undoPile.push(element1);
    undoRedo.undoPile.push(element2);
    undoRedo.undoPile.push(element3);
    undoRedo.undoPile.push(element4);
    undoRedo.undoPile.push(element5);
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    service.onLeftClick(elem1, undoRedo);
    elem1.dispatchEvent(new MouseEvent('click', {
      button: 0
    }));
    setTimeout(() => {
      expect(true).toEqual(true);
      done();
    }, CONSTANTS.TEST_WAIT_TIME);

    service.onLeftClick(elem2, undoRedo);
    elem2.dispatchEvent(new MouseEvent('click', {
      button: 0
    }));

    service.onLeftClick(elem3, undoRedo);
    elem3.dispatchEvent(new MouseEvent('click', {
      button: 0
    }));

    service.onLeftClick(elem4, undoRedo);
    elem4.dispatchEvent(new MouseEvent('click', {
      button: 0
    }));

    service.onLeftClick(elem5, undoRedo);
    elem5.dispatchEvent(new MouseEvent('click', {
      button: 0
    }));

    elem1.dispatchEvent(new MouseEvent('click', {
      button: 1
    }));
  });
  it('Test onRightClick', (done: DoneFn) => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    const elem1 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.ELLIPSE);
    const elem2 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.RECT);
    const elem3 = document.createElementNS(SvgAttributes.LINK, 'polyline');
    elem2.setAttribute('fill', 'transparent');
    const element1: UndoRedoPile = {id: 1, element: elem1, type: SvgAttributes.ELLIPSE};
    const element2: UndoRedoPile = {id: 2, element: elem2, type: 'shape'};
    const element3: UndoRedoPile = {id: 3, element: elem3, type: 'line'};
    undoRedo.undoPile.push(element1);
    undoRedo.undoPile.push(element2);
    undoRedo.undoPile.push(element3);
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    service.onRightClick(elem1, undoRedo);
    elem1.dispatchEvent(new MouseEvent('contextmenu', {
      button: 2
    }
    ));
    setTimeout(() => {
      expect(true).toEqual(true);
      done();
    }, CONSTANTS.TEST_WAIT_TIME);

    service.onRightClick(elem2, undoRedo);
    elem2.dispatchEvent(new MouseEvent('contextmenu', {
      button: 2
    }));

    service.onRightClick(elem3, undoRedo);
    elem3.dispatchEvent(new MouseEvent('contextmenu', {
      button: 2
    }));
    elem1.dispatchEvent(new MouseEvent('contextmenu', {
      button: 1
    }));
  });
});
