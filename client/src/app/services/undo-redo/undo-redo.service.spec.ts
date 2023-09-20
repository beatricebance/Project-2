import { ElementRef} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import {UndoRedoPile} from '../commun-interface';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UndoRedoService = TestBed.get(UndoRedoService);
    expect(service).toBeTruthy();
  });

  it('Test resetPiles', () => {
    const service: UndoRedoService = TestBed.get(UndoRedoService);
    const pile: UndoRedoPile[] = [];
    service.undoPile.push({id: -1, element: '' as unknown as ChildNode, type: ''});
    service.redoPile.push({id: -1, element: '' as unknown as ChildNode, type: ''});
    service.resetPiles();
    expect(service.undoPile).toEqual(pile);
    expect(service.redoPile).toEqual(pile);
  });

  it('Test newElementInSvg', () => {
    const service: UndoRedoService = TestBed.get(UndoRedoService);
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const pile: UndoRedoPile[] = [];
    const pileFull: UndoRedoPile[] = [{id: -1, element: '' as unknown as ChildNode, type: ''}];
    service.undoPile.push({id: -1, element: '' as unknown as ChildNode, type: ''});
    service.redoPile.push({id: -1, element: '' as unknown as ChildNode, type: ''});
    const returnValue = service.newElementInSvg(contain);
    expect(service.redoPile).toEqual(pileFull);
    expect(returnValue).toBeTruthy();
    for (let i = 0; i <= (CONSTANTS.NB_ELEM_SVG + 1); i++) {
      contain.nativeElement.append({ isEqualNode: () => true } as unknown as ChildNode);
    }
    const returnValue2 = service.newElementInSvg(contain);
    expect(service.redoPile).toEqual(pile);
    expect(returnValue2).toBeFalsy();
  });

  it('Test undo', () => {
    const service: UndoRedoService = TestBed.get(UndoRedoService);
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    let ellipse;
    for (let i = 0; i <= (CONSTANTS.NB_ELEM_SVG + 1); i++) {
     ellipse = document.createElementNS(SvgAttributes.LINK, 'ellipse');
     const rect = document.createElementNS(SvgAttributes.LINK, 'rect');
     contain.nativeElement.appendChild(rect);
     contain.nativeElement.appendChild(ellipse);
    }
    service.undo(contain);
    const temp: UndoRedoPile = {id: -1, element: (ellipse as ChildNode), type: ''};
    const temp2: UndoRedoPile = {id: 1, element: (ellipse as ChildNode), type: ''};
    service.undoPile.push(temp2);
    service.undoPile.push(temp);
    service.undoPile.push(temp);
    service.undo(contain);
    expect(service.redoPile[0]).toEqual(temp);
  });

  it('Test redo', () => {
    const service: UndoRedoService = TestBed.get(UndoRedoService);
    const contain = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    let ellipse;
    let path;
    const wrapper = document.createElementNS(SvgAttributes.LINK, SvgAttributes.G);
    for (let i = 0; i <= (CONSTANTS.NB_ELEM_SVG + 1); i++) {
     ellipse = document.createElementNS(SvgAttributes.LINK, SvgAttributes.ELLIPSE);
     ellipse.setAttribute('cx', '1');
     ellipse.setAttribute('cy', '1');
     path = document.createElementNS(SvgAttributes.LINK, SvgAttributes.PATH);
     path.setAttribute('d', '1');
     contain.nativeElement.appendChild(ellipse);
     contain.nativeElement.appendChild(path);
    }
    const line = document.createElementNS(SvgAttributes.LINK, SvgAttributes.POLYLINE);
    const line2 = document.createElementNS(SvgAttributes.LINK, SvgAttributes.CIRCLE);
    line.setAttribute('points', '1 10');
    wrapper.appendChild(line);
    wrapper.appendChild(line2);
    service.redo(contain);

    const temp: UndoRedoPile = {id: -1, element: path as ChildNode, type: 'tool'};
    const temp2: UndoRedoPile = {id: -1, element: path as ChildNode, type: 'shape'};
    service.redoPile.push(temp);
    service.redoPile.push(temp);
    service.redoPile.push(temp2);
    service.redo(contain);
    expect(service.undoPile[0].element).toEqual(temp.element);

    const temp4: UndoRedoPile = {id: -1, element: ellipse as ChildNode, type: 'ellipse'};
    service.redoPile.push(temp4);
    service.redo(contain);

    contain.nativeElement.appendChild(wrapper);
    const temp3: UndoRedoPile = {id: -1, element: wrapper as ChildNode, type: 'line'};
    service.redoPile.push(temp3);
    service.redo(contain);

  });
});
