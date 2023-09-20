import { HttpClientTestingModule} from '@angular/common/http/testing';
import { ElementRef, SecurityContext} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA , MatDialogModule , MatDialogRef, MatRadioChange, MatRadioModule} from '@angular/material';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import * as CONSTANTS from '../../constants/constants';
import {SvgAttributes} from '../../constants/enum';
import { ExportDrawingComponent } from './export-drawing.component';

  // tslint:disable:no-string-literal

const mockRef = {
  close(): void {
    return;
  }
};

const mock = {
  bypassSecurityTrustHtml(value: string): SafeHtml {
    return value as unknown as SafeHtml;
  },
  sanitize(context: SecurityContext, value: string): string {
    return value;
  }
};
const nativeelement = document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING);

const exportAs = 'exportAs';
const httpClient = 'httpClient';

describe('ExportDrawingComponent', () => {
  let component: ExportDrawingComponent;
  let fixture: ComponentFixture<ExportDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDrawingComponent ],
      imports: [
        MatDialogModule,
        MatRadioModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule],
    providers: [
        { provide: MAT_DIALOG_DATA,
          useValue: {
          nativeElement: nativeelement}
          },
        { provide: DomSanitizer, useValue: mock },
      { provide: MatDialogRef, useValue: mockRef },
      { provide: DomSanitizer, useValue: mock },
    ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should updatefilterzone', () => {
    spyOn(component, 'updateFilterZone').and.callThrough();
    component.updateFilterZone('spray');
    expect(component.filter).toEqual('spray');
    expect(component.updateFilterZone).toHaveBeenCalled();
  });
  it('should updatefilte', () => {
  const spy1 = spyOn(component, 'updateFilter').and.callThrough();
  const spy2 = spyOn(component, 'svgToCanvas');
  const spy3 = spyOn(component, 'transformSource');
  const spy4 = spyOn(component, 'updateFilterZone');
  component.updateFilter('' as unknown as MatRadioChange);
  expect(component.filter).toEqual('normal');
  expect(spy4).toHaveBeenCalled();
  expect(spy1).toHaveBeenCalled();
  expect(spy2).toHaveBeenCalled();
  expect(spy3).toHaveBeenCalled();
  });

  it('should saassvg', () => {
  component.data = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
  component['drawingName'] = 'halima';
  spyOn(component, 'saveAsSvg').and.callThrough();
  spyOn(component, 'exportSVG');
  spyOn(component, 'tranformUrlSvg');
  component.saveAsSvg();
  expect(component.saveAsSvg).toHaveBeenCalled();
  expect(component.exportSVG).toHaveBeenCalled();
  expect(component.tranformUrlSvg).toHaveBeenCalled();
  });

  it('should saveaspng', () => {
    spyOn(component, 'saveAsPng').and.callThrough();
    spyOn(component[exportAs], 'exportPNG');
    component.saveAsPng();
    expect(component.saveAsPng).toHaveBeenCalled();
    expect(component[exportAs].exportPNG).toHaveBeenCalled();
  });
  it('should saveasjpeg', () => {
    spyOn(component, 'saveAsJpeg').and.callThrough();
    spyOn(component[exportAs], 'exportJpeg');
    component.saveAsJpeg();
    expect(component.saveAsJpeg).toHaveBeenCalled();
    expect(component[exportAs].exportJpeg).toHaveBeenCalled();
  });
  it('should exportsvg', () => {
    const fileName = 'beatrice';
    spyOn(component, 'exportSVG').and.callThrough();
    spyOn(component[exportAs], 'generateLink').and.callThrough();
    component.exportSVG(fileName);
    expect(component.exportSVG).toHaveBeenCalled();
  });

  it('should test sendbyemail : catch error', () => {
    component['emailAddress'] = 'halimabance@gmail.com';
    component['urlToSend'] = CONSTANTS.BASE64;
    const spy = spyOn(component[httpClient], 'post').and.returnValue(new Observable((subscriber) => {
      subscriber.error();
    }));
    component.sendByEmail();
    expect(spy).toBeTruthy();
   });

  it('should test sendbyemail : email send', () => {
    component['emailAddress'] = 'halimabance@gmail.com';
    component['urlToSend'] = CONSTANTS.BASE64;
    component['drawingName'] = 'bae';
    component.format = 'jpeg';
    const spy = spyOn(component[httpClient], 'post').and.returnValue(new Observable((subscriber) => {
      subscriber.complete();
    }));
    component.sendByEmail();
    expect(spy).toBeTruthy();
   });

  it('should tranformUrlSvg', () => {
    const oSerializer = new XMLSerializer();
    const element = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    spyOn(component, 'tranformUrlSvg').and.callThrough();
    let source = oSerializer.serializeToString(element.nativeElement);
    source = CONSTANTS.EXPORT_SVG_SOURCE + source;
    component.tranformUrlSvg(element.nativeElement);
    expect(component.tranformUrlSvg).toHaveBeenCalled();
  });
  it('should send : jpeg', () => {
    component.format = 'jpeg';
    const spy = spyOn(component, 'send').and.callThrough();
    const spy2 = spyOn(component, 'sendByEmail');
    component.data = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component.send();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

  });
  it('should send : png', () => {
    component.format = 'png';
    const spy = spyOn(component, 'send').and.callThrough();
    const spy2 = spyOn(component, 'sendByEmail');
    component.data = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component.send();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should send : svg', () => {
    component.format = 'svg';
    const spy = spyOn(component, 'send').and.callThrough();
    const spy2 = spyOn(component, 'sendByEmail');
    const spy3 = spyOn(component, 'tranformUrlSvg');
    component.data = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component.send();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();

  });

  it('should send nothing case default', () => {
    component.format = '';
    const spy = spyOn(component, 'send').and.callThrough();
    const spy2 = spyOn(component, 'sendByEmail');
    const spy3 = spyOn(component, 'tranformUrlSvg');
    component.data = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component.send();

    expect(spy).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();

  });

});
