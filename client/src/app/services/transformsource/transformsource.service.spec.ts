import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {SvgAttributes} from '../../constants/enum';
import { TransformsourceService } from './transformsource.service';

describe('TransformsourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransformsourceService = TestBed.get(TransformsourceService);
    expect(service).toBeTruthy();
  });
  it('should return xml', () => {
    const service: TransformsourceService = TestBed.get(TransformsourceService);
    const rect = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));

    service.safe(rect);
    expect(service.xmlserial).not.toEqual('');
  });
  it('should transformUrl', () => {
    const service: TransformsourceService = TestBed.get(TransformsourceService);
    const url = 'data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20standalone%3D%22no%22%3F%3E%0D%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20_ngcontent-drb-c7%3D%22%22%20filter%3D%22%20%22%20height%3D%22752%22%20width%3D%221476%22%20style%3D%22background-color%3A%20rgb(211%2C%200%2C%20158)%3B%22%3E%3Cimage%20_ngcontent-drb-c7%3D%22%22%20x%3D%220%22%20y%3D%220%22%20height%3D%22752%22%20width%3D%221476%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20xlink%3Ahref%3D%22%22%2F%3E%3Cdefs%20_ngcontent-drb-c7%3D%22%22%3E%3Cfilter%20_ngcontent-drb-c7%3D%22%22%20filterUnits%3D%22userSpaceOnUse%22%20height%3D%22100%25%22%20id%3D%22normal%22%20width%3D%22100%25%22%20x%3D%220px%22%20y%3D%220px%22%3E%3CfeGaussianBlur%20_ngcontent-drb-c7%3D%22%22%20stdDeviation%3D%220%22%2F%3E%3C%2Ffilter%3E%3Cfilter%20_ngcontent-drb-c7%3D%22%22%20filterUnits%3D%22userSpaceOnUse%22%20height%3D%22100%25%22%20id%3D%22spray%22%20width%3D%22100%25%22%20x%3D%220px%22%20y%3D%220px%22%3E%3CfeTurbulence%20_ngcontent-drb-c7%3D%22%22%20baseFrequency%3D%220.25%22%20numOctaves%3D%2210%22%20type%3D%22fractalNoise%22%2F%3E%3CfeDisplacementMap%20_ngcontent-drb-c7%3D%22%22%20in%3D%22SourceGraphic%22%20scale%3D%2210%22%2F%3E%3C%2Ffilter%3E%3Cfilter%20_ngcontent-drb-c7%3D%22%22%20filterUnits%3D%22userSpaceOnUse%22%20height%3D%22100%25%22%20id%3D%22emboss%22%20width%3D%22100%25%22%20x%3D%220px%22%20y%3D%220px%22%3E%3CfeConvolveMatrix%20_ngcontent-drb-c7%3D%22%22%20kernelMatrix%3D%223%200%200%200%200%200%200%200%20-3%22%2F%3E%3C%2Ffilter%3E%3Cfilter%20_ngcontent-drb-c7%3D%22%22%20filterUnits%3D%22userSpaceOnUse%22%20height%3D%22100%25%22%20id%3D%22displacementFilter%22%20width%3D%22100%25%22%20x%3D%220px%22%20y%3D%220px%22%3E%3CfeTurbulence%20_ngcontent-drb-c7%3D%22%22%20baseFrequency%3D%220.05%22%20numOctaves%3D%222%22%20result%3D%22turbulence%22%20type%3D%22turbulence%22%2F%3E%3CfeDisplacementMap%20_ngcontent-drb-c7%3D%22%22%20in%3D%22SourceGraphic%22%20in2%3D%22turbulence%22%20scale%3D%2250%22%20xChannelSelector%3D%22R%22%20yChannelSelector%3D%22G%22%2F%3E%3C%2Ffilter%3E%3Cfilter%20_ngcontent-drb-c7%3D%22%22%20height%3D%22100%25%22%20id%3D%22blur9%22%20width%3D%22100%25%22%20x%3D%220px%22%20xfilterUnits%3D%22userSpaceOnUse%22%20y%3D%220px%22%3E%3CfeGaussianBlur%20_ngcontent-drb-c7%3D%22%22%20stdDeviation%3D%228%22%2F%3E%3C%2Ffilter%3E%3Cfilter%20_ngcontent-drb-c7%3D%22%22%20filterUnits%3D%22userSpaceOnUse%22%20id%3D%22Dilate%22%3E%3CfeMorphology%20_ngcontent-drb-c7%3D%22%22%20in%3D%22SourceGraphic%22%20operator%3D%22dilate%22%20radius%3D%226%22%2F%3E%3C%2Ffilter%3E%3Cfilter%20_ngcontent-drb-c7%3D%22%22%20height%3D%22100%25%22%20id%3D%22translucide%22%20width%3D%22100%25%22%20x%3D%220px%22%20y%3D%220px%22%3E%3CfeComponentTransfer%20_ngcontent-drb-c7%3D%22%22%3E%3CfeFuncA%20_ngcontent-drb-c7%3D%22%22%20tableValues%3D%220%200.3%22%20type%3D%22table%22%2F%3E%3C%2FfeComponentTransfer%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cpath%20x%3D%22258%22%20y%3D%22184%22%20height%3D%22276%22%20width%3D%22575%22%20stroke%3D%22%23000000%22%20fill%3D%22%23FFFF00%22%20stroke-width%3D%225%22%20d%3D%22M%20258%26%2310%3B%20%20%20%20%20%20%20%20%20%20%20184%20h%20575%20v%20276%20h%20-575%20Z%22%2F%3E%3Cpath%20x%3D%22534%22%20y%3D%22393%22%20height%3D%22208%22%20width%3D%22583%22%20stroke%3D%22%23000000%22%20fill%3D%22%23FFFF00%22%20stroke-width%3D%225%22%20d%3D%22M%20534%26%2310%3B%20%20%20%20%20%20%20%20%20%20%20393%20h%20583%20v%20208%20h%20-583%20Z%22%2F%3E%3C%2Fsvg%3E';
    service.transformUrl(url);
    expect(service.xmlserial).toEqual('');
  });
});
