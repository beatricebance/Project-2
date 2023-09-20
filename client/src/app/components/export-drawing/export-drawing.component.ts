import { HttpClient} from '@angular/common/http';
import { Component, ElementRef, Inject, Renderer2, RendererFactory2} from '@angular/core';
import { MAT_DIALOG_DATA, MatRadioChange } from '@angular/material';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { ExportDrawingService } from 'src/app/services/export-drawing/export-drawing.service';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import * as CONSTANTS from '../../constants/constants';
import {Filters} from '../drawing-view/drawing-view-data';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})

export class ExportDrawingComponent  {

  protected filters: Filters[] = [Filters.normal, Filters.spray, Filters.translucide , Filters.displacement, Filters.blur , Filters.Dilate];
  protected emailAddress: string;
  protected drawingName: string;
  filter: string;
  filterState: string;
  source: string;
  safeSource: SafeHtml;
  renderer: Renderer2;
  oSerializer: XMLSerializer = new XMLSerializer();
  context: CanvasRenderingContext2D;
  pngDataURL: string;
  jpegDataURL: string;
  dataUrl: string;
  format: string;
  urlToSend: string;
  urlSvg: string;

  constructor(
              protected exportAs: ExportDrawingService,
              @Inject(MAT_DIALOG_DATA) public data: ElementRef,
              protected sanitizer: DomSanitizer,
              protected viewDrawingParameter: NewDrawingDataService,
              rendererFactory: RendererFactory2,
              private httpClient: HttpClient,

  ) {
      this.transformSource();
      this.filter = CONSTANTS.DEFAULT_FILTER;
      this.filterState = CONSTANTS.DEFAULT_FILTER;
      this.drawingName = CONSTANTS.EMPTY_STRING;
      this.renderer = rendererFactory.createRenderer(null, null);
      this.pngDataURL = CONSTANTS.EMPTY_STRING;
      this.jpegDataURL = CONSTANTS.EMPTY_STRING;
      this.emailAddress = CONSTANTS.EMPTY_STRING;
      this.format = CONSTANTS.EMPTY_STRING;
      this.urlSvg = CONSTANTS.EMPTY_STRING;
      this.urlToSend = CONSTANTS.EMPTY_STRING;
      this.svgToCanvas();
  }

  updateFilterZone(filter: string): void {
    this.filter = filter;
  }

  updateFilter(event: MatRadioChange): void {
    this. updateFilterZone(event.value);
    this.renderer.setAttribute(this.data.nativeElement, 'filter', `url(#${this.filter})`);
    this.svgToCanvas();
    this.transformSource();
}

  transformSource(): SafeHtml {
    this.source = this.oSerializer.serializeToString(this.data.nativeElement);
    return  this.safeSource = this.sanitizer.bypassSecurityTrustHtml(this.source);
  }

 async  svgToCanvas(): Promise<void> {
    const xml = new XMLSerializer().serializeToString(this.data.nativeElement);
    this.dataUrl = 'data:image/svg+xml;base64,' + btoa(xml);
    const img = this.renderer.createElement('img');
    img.setAttribute('height', this.viewDrawingParameter.svgHeight);
    img.setAttribute('width', this.viewDrawingParameter.svgWidth);
    const canvas = this.renderer.createElement('canvas');
    this.context = canvas.getContext('2d');
    img.setAttribute('src', this.dataUrl);
    img.onload = () => {
        this.context.canvas.width = img.width;
        this.context.canvas.height = img.height;
        this.context.drawImage(img, 0, 0);
        this.pngDataURL = canvas.toDataURL('data:image/png');
        this.jpegDataURL = canvas.toDataURL('data:image/jpg');
    };
  }

  tranformUrlSvg(element: SVGElement): void {
    let source;
    const oSerializer = new XMLSerializer();
    source = oSerializer.serializeToString(element);
    source = CONSTANTS.EXPORT_SVG_SOURCE + source;
    this.urlSvg = CONSTANTS.EXPORT_SVG_URI + encodeURIComponent(source);
  }

  exportSVG(fileName: string): void {
    this.exportAs.generateLink(fileName + '.svg', this.urlSvg).click();
  }

saveAsSvg(): void {
  this.tranformUrlSvg(this.data.nativeElement);
  this.exportSVG( this.drawingName);
  }

saveAsPng(): void {
  this.exportAs.exportPNG(this.drawingName, this.pngDataURL);
}

saveAsJpeg(): void {
  this.exportAs.exportJpeg(this.drawingName, this.jpegDataURL);
}

 send(): void {
  this.svgToCanvas();
  switch (this.format) {
    case 'jpeg':
         this.urlToSend = this.jpegDataURL;
         this.sendByEmail();
         break;
    case 'png':
         this.urlToSend = this.pngDataURL;
         this.sendByEmail();
         break;
   case  'svg':
         this.tranformUrlSvg(this.data.nativeElement);
         this.urlToSend = this.urlSvg;
         this.sendByEmail();
         break;
    default:
      break;
  }
}

sendByEmail(): void {
      const url = 'http://localhost:3000/api/email';
      const base64 = this.urlToSend.split(',')[1];
      const body = {
        to: this.emailAddress,
        payload: base64,
        filename: this.drawingName,
        format : this.format,
        };
      this.httpClient.post(url, body)
        .toPromise()
        .then(() => { alert('Image enregistrer'); })
        .catch((e: Error) => { throw e; })
        ;
    }

}
