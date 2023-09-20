import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {SvgAttributes} from '../../constants/enum';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { PencilService } from './pencil.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-any
// tslint:disable: no-string-literal
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
const drawingData = 'drawingData';

describe('PencilService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: Renderer2, useClass: MockRenderer},
      {provide: RendererFactory2, useClass: MockRendererFactory}],
  }));

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });

  it('draw works when begin path is true', () => {
    const service: PencilService = TestBed.get(PencilService);

    const mouse = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 150
    });
    // const drawingData = 'drawingData';
    service[drawingData].beginPath = true;
    const stroke = '10';
    const contain = new ElementRef<SVGElement> ( document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));

    const test = '100 150 ';
    const nbCalls = 6;
    spyOn(service.renderer, 'setAttribute');
    service.draw(mouse, contain, stroke);
    expect(service['pointString']).toBe(test);
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(nbCalls);

  });

  it('set attribute should not been called when begin path is false', () => {
    const service: PencilService = TestBed.get(PencilService);

    const spy = spyOn(service.renderer, 'setAttribute');

    service.draw(
      ' ' as unknown as MouseEvent,
      ' ' as unknown as ElementRef,
      ' '
    );

    expect(spy).not.toHaveBeenCalled();

  });

  it('beging draw  in penAbstract should be called', () => {
    const service: PencilService = TestBed.get(PencilService);
    const spy = spyOn(service.renderer, 'setAttribute');
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));

    service.beginDrawing(
      ' ' as unknown as MouseEvent,
      contain,
      ' '
    );
    expect(spy).toHaveBeenCalled();

    expect(service[drawingData].beginPath).toBeTruthy();

  });

  it('stop draw  in penAbstract should be called', () => {
    const service: PencilService = TestBed.get(PencilService);
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    service.stopDrawing(undoRedo);
    expect(service[drawingData].beginPath).toBeFalsy();

  });
});
