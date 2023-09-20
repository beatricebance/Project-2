import { ElementRef, Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as CONSTANTS from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TransformsourceService {
  oSerializer: XMLSerializer = new XMLSerializer();
  xmlserial: string;
  safeUrl: SafeUrl;
  constructor(protected sanitizer: DomSanitizer) {
    this.xmlserial = CONSTANTS.EMPTY_STRING;
    this.safeUrl = CONSTANTS.EMPTY_STRING;
  }

  safe(element: ElementRef): string {
    this.xmlserial = this.oSerializer.serializeToString(element.nativeElement);
    return this.xmlserial;
  }
  transformUrl(url: string): SafeUrl {
    return this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
