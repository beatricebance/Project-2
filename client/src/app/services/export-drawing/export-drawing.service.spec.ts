import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { ExportDrawingService } from './export-drawing.service';

// tslint:disable: no-string-literal
const nativeelement = document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING);

describe('ExportDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: ElementRef,
      useValue: {
      nativeElement: nativeelement
      }
      }, ]
  }));

  it('should be created', () => {
    const service: ExportDrawingService = TestBed.get(ExportDrawingService);
    expect(service).toBeTruthy();
  });

  it('should generatelink', () => {
    const service: ExportDrawingService = TestBed.get(ExportDrawingService);
    const oSerializer = new XMLSerializer();
    const spy2 = spyOn(service, 'generateLink').and.callThrough();
    const  fileName = 'halima';
    const element = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    let source = oSerializer.serializeToString(element.nativeElement);
    source = CONSTANTS.EXPORT_SVG_SOURCE + source;
    const url = CONSTANTS.EXPORT_SVG_URI + encodeURIComponent(source);
    service.generateLink(fileName, url);
    expect(spy2).toHaveBeenCalled();
    });
  it('should export png', () => {
      const service: ExportDrawingService = TestBed.get(ExportDrawingService);
      const oSerializer = new XMLSerializer();
      const spy1 = spyOn(service, 'exportPNG').and.callThrough();
      const  fileName = 'halima';
      const element = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
      let source = oSerializer.serializeToString(element.nativeElement);
      source = CONSTANTS.EXPORT_SVG_SOURCE + source;
      const url = CONSTANTS.EXPORT_SVG_URI + encodeURIComponent(source);
      service.exportPNG(fileName, url);
      expect(spy1).toHaveBeenCalled();
    });
  it('should export jpeg', () => {
      const service: ExportDrawingService = TestBed.get(ExportDrawingService);
      const oSerializer = new XMLSerializer();
      const spy1 = spyOn(service, 'exportJpeg').and.callThrough();
      const  fileName = 'halima';
      const element = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
      let source = oSerializer.serializeToString(element.nativeElement);
      source = CONSTANTS.EXPORT_SVG_SOURCE + source;
      const url = CONSTANTS.EXPORT_SVG_URI + encodeURIComponent(source);
      service.exportJpeg(fileName, url);
      expect(spy1).toHaveBeenCalled();
    });
});
