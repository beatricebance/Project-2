// tslint:disable:no-string-literal
// tslint:disable: no-magic-numbers
import { TestBed } from '@angular/core/testing';

import { ElementRef, RendererFactory2 } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { SvgAttributes } from 'src/app/constants/enum';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { BucketCalculationService } from './bucket-calculation.service';
import { PaintBucketService } from './paint-bucket.service';

describe('PaintBucketService', () => {
  let service: PaintBucketService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PaintBucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#adjustTolerance should initialize tolerance and adjust when tolerance changed', () => {
    expect(service.tolerance.value).toEqual(0);
    service.adjustTolerance({value: 50} as unknown as MatSliderChange);
    expect(service.tolerance.value).toEqual(50);
  });

  it('#adjustTolerance should not change tolerance if value is null', () => {
    expect(service.tolerance.value).toEqual(0);
    service.adjustTolerance({value: null} as unknown as MatSliderChange);
    expect(service.tolerance.value).toEqual(0);
  });

  it('#initialize should create svg image', () => {
    const svg = new ElementRef<SVGSVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const element1 = new ElementRef<SVGSVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    service.initialize(svg);
    expect(svg).toEqual(element1);
  });

  it('100% of tolerance should color all the draw', (done: DoneFn) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '1000');
    svg.setAttribute('width', '1000');
    service.image = {nativeElement : svg};

    const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect1.setAttribute('x', '50');
    rect1.setAttribute('y', '50');
    rect1.setAttribute('width', '500');
    rect1.setAttribute('height', '500');
    rect1.setAttribute('fill', '#FF0000');

    const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect2.setAttribute('x', '250');
    rect2.setAttribute('y', '250');
    rect2.setAttribute('width', '100');
    rect2.setAttribute('height', '100');
    rect2.setAttribute('fill', '#00FF00');

    svg.appendChild(rect1);
    svg.appendChild(rect2);
    document.body.appendChild(svg);

    const event = {
      button: 0,
      offsetX: 100,
      offsetY: 100
    } as MouseEvent;

    svg.style.backgroundColor = '#FFFFFF';
    service.colorDataService.primaryColor = '#0000FF';

    service.tolerance = { value: 3 } as unknown as BehaviorSubject<number>;
    const rendererFactory = TestBed.get(RendererFactory2);
    const undoRedo = new UndoRedoService(rendererFactory);
    service.onClick(event, service.image, undoRedo);

    setTimeout(() => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      canvas.setAttribute('height', service.image.nativeElement.scrollHeight.toString());
      canvas.setAttribute('width', service.image.nativeElement.scrollWidth.toString());
      canvas.style.backgroundColor = service.image.nativeElement.style.backgroundColor;

      const svgSerialized = new XMLSerializer().serializeToString(service.image.nativeElement);
      const img = new Image();
      img.setAttribute('src', `data:image/svg+xml;base64,${btoa(svgSerialized)}`);
      img.onload = () => {
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(200, 200, 1, 1);
        expect(imageData.data[0]).toEqual(0);
        expect(imageData.data[1]).toEqual(0);
        expect(imageData.data[2]).toEqual(255);
      };
      done();
    }, 1000);
  });

  it('#makePath should return path if pathToFill is undefined', () => {
    service['bucketAlgorithm'] = new BucketCalculationService(0, 0, '' as unknown as CanvasRenderingContext2D, 0);
    expect(service['makePath']()).toEqual('');
  });

  it('#determinePath should return nothing if length is 0', () => {
    let bucket =  service['bucketAlgorithm'];
    bucket = new BucketCalculationService(0, 0, '' as unknown as CanvasRenderingContext2D, 0);
    bucket['strokes'].length = 0;
    bucket['determinePath']();
    expect().nothing();
  });

});
