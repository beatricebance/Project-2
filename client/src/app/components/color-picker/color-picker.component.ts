import { AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ColorDataService } from 'src/app/services/color-data/color-data.service';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import * as CONSTANTS from '../../constants/constants';
import {Coordinate} from '../../services/commun-interface';

export interface RGBAColor {
  a: number;
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {
  @Input()
   color: string ;
  startingColorRgba: RGBAColor;
  mousePosition: Coordinate;

  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('recentColors', {static: false})
  recentColors: ElementRef<HTMLElement>;

  @Output()
  colorPicked: EventEmitter<string> = new EventEmitter(true);

  private mouseDown: boolean;
  canvasContext: CanvasRenderingContext2D | null;
  rgbaColor: string;
  gradient: CanvasGradient;
  isOpened: false;
  colorForm: FormGroup;
  match: RegExpMatchArray | null;
  hex: string;
  newHex: string;
  aValue: number;
  aValueSecondary: number;
  constructor(protected viewDrawingParameter: NewDrawingDataService,
              public colorData: ColorDataService,
              private formBuilder: FormBuilder,
              private renderer: Renderer2)  {
    this.color = 'rgba(255, 255, 255, 1)';
    this.match = this.color.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/i);
    if (this.match !== null) {
      this.startingColorRgba = {
        a: Number(this.match[CONSTANTS.MATCH_A_POSITION])
      };
    }

    this.colorForm = this.formBuilder.group({
      a: [this.startingColorRgba.a * CONSTANTS.TRANSPARENCE_POURCENTAGE,
        [Validators.required,
        Validators.min(0),
        Validators.max(CONSTANTS.TRANSPARENCE_POURCENTAGE)]]
    });

    this.aValueSecondary =  CONSTANTS.TRANSPARENCE_POURCENTAGE;
    this.aValue =  CONSTANTS.TRANSPARENCE_POURCENTAGE;
    this.mouseDown = false;

  }

  ngAfterViewInit(): void {
    this.mousePosition = {x: CONSTANTS.START_COORDINATE_X, y: CONSTANTS.START_COORDINATE_Y};
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
    this.draw();
    this.addPrimarycolor();
    this.addSecondaryColor();
    this.displayRecentColors();
  }

  savingColor(): void {
     if (this.containsColor() < 0) {
      const newTop10Colors = this.colorData.top10RecentColors;
      newTop10Colors.pop();
      newTop10Colors.unshift(this.rgbaColor);
      this.addPrimarycolor();
      this.addSecondaryColor();
      this.displayRecentColors();
     }
  }

  colorIsSaved(): void {
    this.savingColor();
    this.colorData.primaryColor = this.colorData.top10RecentColors[0];
  }

  backgroundIsSaved(): void {
    this.savingColor();
    this.colorData.backgroundColor = this.colorData.top10RecentColors[0];
    this.viewDrawingParameter.svgColorHexa = this.colorData.backgroundColor;
  }

  containsColor(): number {
    for (let index = 0; index < this.colorData.top10RecentColors.length; index++) {
      if (this.colorData.top10RecentColors[index] === this.rgbaColor) {
        return index;
      }
    }

    return CONSTANTS.RETURN_VALUE;
  }

  addSecondaryColor(): void {
     for (let index = 0; index < this.colorData.top10RecentColors.length; index++) {
        this.renderer.listen(
          this.recentColors.nativeElement.children.item(index), 'contextmenu', ($event: Event) => {
            $event.preventDefault();
            this.colorData.secondaryColor = this.colorData.top10RecentColors[index];
          });
      }
  }

   displayRecentColors(): void {
      for (let index = 0; index < this.colorData.top10RecentColors.length; index++) {
        this.renderer.setStyle(
          this.recentColors.nativeElement.children.item(index),
          'background-color',
          this.colorData.top10RecentColors[index]);
      }
   }

  swapColors(): void {
    this.colorData.swapingColors();
  }

  rgbToHEX(color: number): string {
    this.hex = (color).toString(CONSTANTS.STRING_CONVERSION);
    if (this.hex.length < 2) {
      this.hex = '0' + this.hex;
    }
    return this.hex;
  }

  hexToRgb(unHex: string): string {
    const color = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(unHex);
    return color ? 'rgb(' + parseInt(color[CONSTANTS.RED_POSITION], 16).toString() + ', '
     + parseInt(color[CONSTANTS.GREEN_POSITION], 16).toString() + ', ' + parseInt(color[CONSTANTS.BLUE_POSITION], 16).toString() + ')' : '';
  }

  addAlpha(opacity: number): void {
    opacity = Math.round(Math.min(Math.max((opacity / CONSTANTS.TRANSPARENCE_POURCENTAGE) ||
     CONSTANTS.TRANSPARENCE_POURCENTAGE, 0), 1) * CONSTANTS.MAX_COLOR);
    this.colorData.primaryColor = this.newHex + opacity.toString(CONSTANTS.STRING_CONVERSION).toUpperCase();
  }

  addPrimarycolor(): void {
     for (let index = 0; index < this.colorData.top10RecentColors.length; index++) {
        this.renderer.listen(
            this.recentColors.nativeElement.children.item(index), 'click', () => {
            this.colorData.primaryColor = this.colorData.top10RecentColors[index];
        });
      }
  }
  draw(): void {
    if (this.canvasContext !== null) {
      const width = this.canvas.nativeElement.width;
      const height = this.canvas.nativeElement.height;
      this.gradient = this.canvasContext.createLinearGradient(0, 0, height, 0);
      // dark pink color
      this.gradient.addColorStop(0, 'rgba(255,0,127,1)');
      // purple
      this.gradient.addColorStop( CONSTANTS.PURPLE_GRADIENT, 'rgba(127,0,255,1)');
      // blue
      this.gradient.addColorStop( CONSTANTS.BLUE_GRADIENT, 'rgba(0,128,255,1)');
      // green
      this.gradient.addColorStop( CONSTANTS.GREEN_GRADIENT, 'rgba(128,255,0,1)');
      // yellow
      this.gradient.addColorStop( CONSTANTS.YELLOW_GRADIENT, 'rgba(255,255,0,1)');
      // orange
      this.gradient.addColorStop( CONSTANTS.ORANGE_GRADIENT, 'rgba(255,128,0,1)');
      // red
      this.gradient.addColorStop(1, 'rgba(255,0,0,1)');
      this.canvasContext.rect(0, 0, width, height);
      this.canvasContext.fillStyle = this.gradient;
      this.canvasContext.fill();

      // create black and white gradient
      this.gradient = this.canvasContext.createLinearGradient(0, 0, 0, width);
      this.gradient.addColorStop(0, 'rgba(0,0,0,1)');
      this.gradient.addColorStop( CONSTANTS.WHITE_GRADIENT, 'rgba(0,0,0,0)');
      this.gradient.addColorStop( CONSTANTS.WHITE_GRADIENT, 'rgba(255,255,255,0)');
      this.gradient.addColorStop(1, 'rgba(255,255,255,1)');
      this.canvasContext.fillStyle = this.gradient;
      this.canvasContext.fillRect(0, 0, width, height);

      // create pointer/picker in the canvas
      this.canvasContext.beginPath();
      this.canvasContext.arc(this.mousePosition.x, this.mousePosition.y, CONSTANTS.ARC_RADIUS, 0, 2 * Math.PI);
      this.canvasContext.strokeStyle = 'black';
      this.canvasContext.fillStyle = 'white';
      this.canvasContext.stroke();
      this.canvasContext.closePath();

    }
  }

  onMouseUp(): void {
    this.mouseDown = false;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.mousePosition = { x: event.offsetX, y: event.offsetY};
    this.draw();
    this.emitColor(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.mousePosition = { x: event.offsetX, y: event.offsetY};
      this.draw();
      this.emitColor(event.offsetX, event.offsetY);
    }
  }

  emitColor(x: number, y: number): void {
    this.rgbaColor = this.hexToRgb(this.newHex);
    this.colorData.hexColor = this.getMousePositionColorHEX(x, y);
    this.colorPicked.emit(this.colorData.hexColor);

  }

  getMousePositionColorHEX(x: number, y: number): string {
    if (this.canvasContext !== null) {
      const imageInfo = this.canvasContext.getImageData(x, y, 1, 1).data;
      this.newHex = '#' + this.rgbToHEX(imageInfo[0]) + this.rgbToHEX(imageInfo[1]) + this.rgbToHEX(imageInfo[2]);
      return this.newHex;
    }
    return CONSTANTS.EMPTY_STRING;
  }

}
