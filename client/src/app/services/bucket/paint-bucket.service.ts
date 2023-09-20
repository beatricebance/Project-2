import { ElementRef, Injectable } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { SvgAttributes } from 'src/app/constants/enum';
import { ColorDataService } from '../color-data/color-data.service';
import { Coordinate } from '../commun-interface';
import { DrawingCommunService } from '../drawing-commun/drawing-commun.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { BucketCalculationService } from './bucket-calculation.service';

@Injectable({
  providedIn: 'root'
})
export class PaintBucketService {
  tolerance: BehaviorSubject<number>;
  private bucketAlgorithm: BucketCalculationService;
  image: ElementRef<SVGSVGElement>;
  colorService: ColorDataService;
  context: HTMLCanvasElement;
  private subElement: SVGPathElement;

  constructor(public colorDataService: ColorDataService, private drawingData: DrawingCommunService) {
    this.tolerance = new BehaviorSubject<number>(0);
  }

  adjustTolerance(event: MatSliderChange): void {
    const value = event.value;
    if (value !== null) {
      this.tolerance.next(value);
    }
  }

  initialize(svg: ElementRef<SVGSVGElement>): void {
    this.image = svg;
  }

  onClick(event: MouseEvent, container: ElementRef, undoService: UndoRedoService): void {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.setAttribute('height', this.image.nativeElement.scrollHeight.toString());
    canvas.setAttribute('width', this.image.nativeElement.scrollWidth.toString());
    canvas.style.backgroundColor = this.image.nativeElement.style.backgroundColor;

    const svgSerialized = new XMLSerializer().serializeToString(this.image.nativeElement);
    const img = new Image();
    img.setAttribute('src', `data:image/svg+xml;base64,${btoa(svgSerialized)}`);
    img.onload = () => {
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      context.drawImage(img, 0, 0);
      this.bucketAlgorithm = new BucketCalculationService(
        this.image.nativeElement.width.animVal.value,
        this.image.nativeElement.height.animVal.value,
        context,
        this.tolerance.value
      );
      this.bucketAlgorithm.fillAlgorithm({x: event.offsetX, y: event.offsetY}, container);
      const definePath = this.makePath();
      this.draw(definePath, undoService);
    };

  }

  private draw(aDrawing: string, undoService: UndoRedoService): void {
    this.subElement = document.createElementNS(SvgAttributes.LINK, SvgAttributes.G) as SVGPathElement;
    this.subElement.setAttribute('fill', this.colorDataService.primaryColor);
    this.subElement.setAttribute('color', 'none');
    this.subElement.setAttribute('thickness', '1');

    const path: SVGPathElement = document.createElementNS(SvgAttributes.LINK, SvgAttributes.PATH);
    path.setAttribute('d', aDrawing);
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('joint', 'round');
    path.setAttribute('endOfLine', 'round');
    this.subElement.appendChild(path);
    this.image.nativeElement.appendChild(this.subElement);
    undoService.undoPile.push({id: this.drawingData.idGenerator(), element: this.subElement, type: 'tool'});

  }

  private makePath(): string {
    let definePath = '';
    const pointFive = 0.5;
    if (this.bucketAlgorithm.pathsToPaint !== undefined) {
      this.bucketAlgorithm.pathsToPaint.forEach((array) => {
        array.forEach((pixel: Coordinate, i: number) => {
          if (i === 0) {
            definePath += ` M${pixel.x + pointFive} ${pixel.y + pointFive}`;
          } else {
            definePath += ` L${pixel.x + pointFive} ${pixel.y + pointFive}`;
          }
        });
        definePath += ' z';
      });
    }
    return definePath;
  }

}
