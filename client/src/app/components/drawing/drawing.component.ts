import { AfterViewInit, Component, ElementRef, ViewChild  } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { AirBrushService } from 'src/app/services/air-brush/air-brush.service';
import { BrushService } from 'src/app/services/brush/brush.service';
import { PaintBucketService } from 'src/app/services/bucket/paint-bucket.service';
import { CalligraphyService } from 'src/app/services/calligraphy/calligraphy.service';
import { ColorApplicatorService } from 'src/app/services/color-applicator/color-applicator.service';
import { ColorDataService } from 'src/app/services/color-data/color-data.service';
import { DrawingCommunService } from 'src/app/services/drawing-commun/drawing-commun.service';
import { EllipseService } from 'src/app/services/ellipse/ellipse.service';
import { EraseService } from 'src/app/services/erase/erase.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { LineService } from 'src/app/services/line/line.service';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import { PencilService } from 'src/app/services/pencil/pencil.service';
import { PipetteService } from 'src/app/services/pipette/pipette.service';
import { PolygonService } from 'src/app/services/polygon/polygon.service';
import { RectangleService } from 'src/app/services/rectangle/rectangle.service';
import { SelectorService } from 'src/app/services/selector/selector.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import {SliderParameters, ToolsIndex} from '../../constants/enum';
import { ViewParameters } from '../drawing-view/drawing-view-data';
import { DrawingParameters } from './drawing-parameters';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})

export class DrawingComponent implements AfterViewInit  {
  @ViewChild('svgContainer', { static: false }) container: ElementRef;

  protected opened: boolean;
  protected selectorOn: boolean;
  protected isActivetools: boolean[];
  protected sliderParameters: ViewParameters = new ViewParameters();
  protected drawingParameters: DrawingParameters = new DrawingParameters();
  protected activatedToolIndex: number;
  protected toolsActivated: boolean;
  constructor(protected drawingData: DrawingCommunService,
              protected colorData: ColorDataService,
              protected pencilTool: PencilService,
              protected brushTool: BrushService,
              protected rectangleTool: RectangleService,
              protected lineTool: LineService,
              protected airBrushTool: AirBrushService,
              protected polygoneTool: PolygonService,
              protected gridTool: GridService,
              protected colorAplicatorTool: ColorApplicatorService,
              protected eraseTool: EraseService,
              public selectionTool: SelectorService,
              public paintBucketTool: PaintBucketService,
              protected pipetteTool: PipetteService,
              protected ellipseTool: EllipseService,
              protected drawingPile: UndoRedoService,
              protected calligraphyTool: CalligraphyService,
              protected viewDrawingParameter: NewDrawingDataService,
              ) {
                this.isActivetools = Array();
                this.toolsActivated = false;
                this.activatedToolIndex = -1;
                this.container = {}  as ElementRef;
              }

  ngAfterViewInit(): void {
    this.selectionTool.setSVG(this.container.nativeElement as SVGSVGElement);
    this.paintBucketTool.initialize(this.container);
    if (this.viewDrawingParameter.isAutoSave && localStorage.length !== 0) {
      this.container.nativeElement.innerHTML = localStorage.getItem('myInnerSvg');
      }
  }

  initializeElements(): void {
    this.sliderParameters.value = SliderParameters.VALUE;
    this.drawingParameters.drawablesOn = false;
    for (let i = 0; i < this.isActivetools.length; i++) {
      this.isActivetools[i] = false;
    }
  }

  activateTool(val: number): void {
    this.activatedToolIndex = val;
    this.opened = true;
    this.initializeElements();
    this.isActivetools[val] = true;
    this.drawingParameters.drawablesOn = true;
    this.selectorOn = false;
    this.eraseTool.eraseDeactivate(this.container);
    // this.calligraphyTool.calligraphyDesactivate(this.container);
    this.selectionTool.resetPoints();
    switch (val) {
      case ToolsIndex.COLOR_APPLICATOR_INDEX: {
        this.colorAplicatorTool.onClick(this.container, this.drawingPile);
      }                                       break;
      case ToolsIndex.ERASE_INDEX: {
        this.deactivateToolsAndShapes();
        this.eraseTool.eraseActivate(this.container);
      }                            break;
      case ToolsIndex.SELECTION_INDEX: {
        this.deactivateToolsAndShapes();
        this.selectionTool.initializeSelector();
        this.selectorOn = true;
      }                                break;
      case ToolsIndex.PIPETTE_INDEX: {
        this.deactivateToolsAndShapes();
        this.pipetteTool.initializePipette(this.container.nativeElement as SVGElement);
      }                              break;
      default:
        break;
    }
  }

  activateTools(): void {
    this.initializeElements();
    this.opened = true;
    this.drawingParameters.toolsOn = true;
    this.drawingParameters.shapesOn = false;
  }

  activateShapes(): void {
    this.initializeElements();
    this.opened = true;
    this.drawingParameters.toolsOn = false;
    this.drawingParameters.shapesOn = true;
  }

  deactivateToolsAndShapes(): void {
    this.drawingParameters.toolsOn = false;
    this.drawingParameters.shapesOn = false;
  }

  activateGrid(): void {
    if (this.drawingParameters.disableGrid === false) {
      this.gridTool.remove(this.container);
      this.drawingParameters.disableGrid = true;
    } else  {
      this.gridTool.grid(this.container, this.sliderParameters.valueDecimal, this.drawingData.space);
      this.drawingParameters.disableGrid = false;
    }
  }

  OnSideChange(): void {
    this.polygoneTool.updateAngle(this.sliderParameters.polygoneSides);
  }

  beginDrawing(event: MouseEvent): void {
    this.toolsActivated = true;
    const val = this.drawingData.findActivatedIndex(this.isActivetools);
    switch (val) {
      case ToolsIndex.PENCIL_INDEX: {
        this.pencilTool.beginDrawing(event, this.container, this.sliderParameters.value.toString());
      }                             break;
      case ToolsIndex.BRUSH_INDEX: {
        this.brushTool.beginDrawing(event, this.container, this.sliderParameters.value.toString());
      }                            break;
      case ToolsIndex.RECTANGLE_INDEX: {
        this.rectangleTool.onMouseDown(event);
      }                                break;
      case ToolsIndex.AIR_BRUSH_INDEX: {
        this.airBrushTool.onMouseDown(event, this.container, this.sliderParameters.value);
      }                                break;
      case ToolsIndex.POLYGONE_INDEX: {
        this.polygoneTool.onMouseDown(event);
      }                               break;
      case ToolsIndex.ELLIPSE_INDEX: {
        this.ellipseTool.onMouseDown(event);
      }                              break;
      case ToolsIndex.ERASE_INDEX: {
        this.eraseTool.onMouseDown(this.container);
      }                            break;
      case ToolsIndex.SELECTION_INDEX: {
        this.selectionTool.onMouseDown(event);
      }                                break;
      case ToolsIndex.CALLIGRAPHY_INDEX: {
        this.calligraphyTool.onMouseDown(event, this.container, this.sliderParameters.angleCalligraphy, this.sliderParameters.value);
      }                                  break;
      default:
        break;
    }
  }
  draw1(event: MouseEvent): void {
    this.updatePathStroke();
    this.updatePathFill();
    const val = this.drawingData.findActivatedIndex(this.isActivetools);
    switch (val) {
      case ToolsIndex.PENCIL_INDEX: {
        this.pencilTool.draw(event, this.container, this.sliderParameters.value.toString());
      }                             break;
      case ToolsIndex.BRUSH_INDEX: {
        this.brushTool.draw(event, this.container, this.sliderParameters.value.toString());
      }                            break;
      case ToolsIndex.RECTANGLE_INDEX: {
        this.rectangleTool.draw(event, this.container, this.sliderParameters.value.toString());
      }                                break;
      case ToolsIndex.AIR_BRUSH_INDEX: {
        this.airBrushTool.draw(event, this.container, this.sliderParameters.value, this.drawingParameters.airBrushEmission);
      }                                break;
      case ToolsIndex.POLYGONE_INDEX: {
        this.polygoneTool.draw(event, this.container, this.sliderParameters.value.toString());
      }                               break;
      case ToolsIndex.ELLIPSE_INDEX: {
        this.ellipseTool.draw(event, this.container, this.sliderParameters.value.toString());
      }                              break;
      case ToolsIndex.ERASE_INDEX: {
        this.eraseTool.mouseMouve(event, this.sliderParameters.value, this.container);
      }                            break;
      case ToolsIndex.SELECTION_INDEX: {
        this.selectionTool.onMouseMove(event);
      }                                break;
      case ToolsIndex.CALLIGRAPHY_INDEX: {
        this.calligraphyTool.onMouseMove(event, this.container, this.sliderParameters.angleCalligraphy, this.sliderParameters.value);
      }                                  break;
      case ToolsIndex.LINE_INDEX: {
        this.lineTool.draw(event);
      }                           break;
      default:
        break;
    }
  }

  draw(event: MouseEvent): void {
    if ( this.drawingParameters.disableGrid === false ) {
      this.draw1(event);
      this.gridTool.grid(this.container, this.sliderParameters.valueDecimal, this.drawingData.space);
    } else {
      this.draw1(event);
    }
  }

  click(event: MouseEvent): void {
    if (this.isActivetools[ToolsIndex.LINE_INDEX]) {
      if (this.drawingParameters.circleOn) { this.drawingParameters.cercleDiameter = this.sliderParameters.junctionWidth; }
      this.lineTool.click(event, this.container, this.sliderParameters.value.toString(),
      this.drawingParameters.cercleDiameter.toString());
    } else if (this.isActivetools[ToolsIndex.SELECTION_INDEX]) {
      this.selectionTool.onClick(event);
    } else if (this.isActivetools[ToolsIndex.PIPETTE_INDEX]) {
     this.pipetteTool.onClick(event, this.container);
    } else if (this.isActivetools[ToolsIndex.PAINT_BUCKET_INDEX]) {
      this.paintBucketTool.onClick(event, this.container, this.drawingPile);
    }
  }
  AutoBackup(): void {
    this.viewDrawingParameter.isAutoSave = true;
    localStorage.setItem('myInnerSvg', this.container.nativeElement.innerHTML);
    localStorage.setItem('myWidth', JSON.stringify(this.viewDrawingParameter.svgWidth));
    localStorage.setItem('myHeight', JSON.stringify(this.viewDrawingParameter.svgHeight));
    localStorage.setItem('myColor', JSON.stringify(this.viewDrawingParameter.svgColorHexa));
  }

  stopDrawing(event: MouseEvent): void {
    if (this.toolsActivated) {
      const val = this.drawingData.findActivatedIndex(this.isActivetools);
      switch (val) {
        case ToolsIndex.PENCIL_INDEX: {
          this.pencilTool.stopDrawing(this.drawingPile);
        }                             break;
        case ToolsIndex.BRUSH_INDEX: {
          this.brushTool.stopDrawing(this.drawingPile);
        }                            break;
        case ToolsIndex.RECTANGLE_INDEX: {
          this.rectangleTool.onMouseUp(event, this.drawingPile);
        }                                break;
        case ToolsIndex.AIR_BRUSH_INDEX: {
          this.airBrushTool.stopDrawing(this.drawingPile);
        }                                break;
        case ToolsIndex.POLYGONE_INDEX: {
          this.polygoneTool.onMouseUp(event, this.container, this.sliderParameters.value.toString(), this.drawingPile);
        }                               break;
        case ToolsIndex.ELLIPSE_INDEX: {
          this.ellipseTool.onMouseUp(event, this.drawingPile);
        }                              break;
        case ToolsIndex.ERASE_INDEX: {
          this.eraseTool.onMouseUp();
        }                            break;
        case ToolsIndex.SELECTION_INDEX: {
          this.selectionTool.onMouseUp(event);
        }                                break;
        case ToolsIndex.CALLIGRAPHY_INDEX: {
          this.calligraphyTool.onMouseUp();
        }                                  break;
        default:
          break;
      }
      this.drawingParameters.canRedo = this.drawingPile.newElementInSvg(this.container);
      this.toolsActivated = false;
      this.drawingParameters.canUndo = true;
      this.AutoBackup();

    }
  }
  shiftUp(event: MouseEvent): void {
    this.lineTool.shiftUp(event);
  }

  shiftDown(event: MouseEvent): void {
    this.lineTool.shiftDown(event);
  }

  updateJunction(event: MatRadioChange): void {
    if (event.value === 'Cercle') {
      this.drawingParameters.cercleDiameter = this.sliderParameters.junctionWidth;
      this.drawingParameters.disableJunction = false;
      this.drawingParameters.circleOn = true;
    } else {
      this.drawingParameters.cercleDiameter = 0;
      this.drawingParameters.disableJunction = true;
      this.drawingParameters.circleOn = false;
    }
  }

  onEscape(): void {
    if (this.isActivetools[ToolsIndex.LINE_INDEX]) {
      this.lineTool.escape();
    }
  }

  onBackspace(): void {
    if (this.isActivetools[ToolsIndex.LINE_INDEX]) {
      this.lineTool.backspace();
    }
  }

  doubleClick(event: MouseEvent): void {
    if (this.isActivetools[ToolsIndex.LINE_INDEX]) {
      this.lineTool.doubleClick(event, this.drawingPile);
    }
  }

  undo(): void {
    this.drawingPile.undo(this.container);
    this.drawingParameters.canRedo = true;
  }

  redo(): void {
    if (this.drawingPile.redoPile.length <= 1) {
      this.drawingParameters.canRedo = false;
    }
    this.drawingPile.redo(this.container);
  }

  updatePathStroke(): void {
    if (this.isActivetools[ToolsIndex.RECTANGLE_INDEX] || this.isActivetools[ToolsIndex.POLYGONE_INDEX] ||
      this.isActivetools[ToolsIndex.ELLIPSE_INDEX]) {
      if (this.drawingParameters.contourOn || this.sliderParameters.contourState === 'Activer') {
        this.drawingData.updatePathStroke(this.colorData.secondaryColor);
      }
    } else {
      this.drawingData.updatePathStroke(this.colorData.primaryColor);
    }
  }

  updateFilter(event: MatRadioChange): void {
    this.brushTool.updateFilter(event.value);
  }

  updateContour(event: MatRadioChange): void {
    if (event.value === 'Activer') {
      this.drawingParameters.contourOn = true;
      this.drawingData.updatePathStroke(this.drawingData.actualStrock);
    } else {
      this.drawingData.updatePathStroke('');
      this.drawingParameters.contourOn = false;
    }
  }
  updatePathFill(): void {
    if (this.drawingParameters.fillOn || this.sliderParameters.filled === 'Activer') {
      this.drawingData.updatePathFill(this.colorData.primaryColor);
      this.drawingData.actualFill = this.colorData.primaryColor;
    }
  }

  updateFill(event: MatRadioChange): void {
    if (event.value === 'Activer') {
      this.drawingParameters.fillOn = true;
      this.drawingData.updatePathFill(this.drawingData.actualFill);
    } else {
      this.drawingData.updatePathFill('transparent');
      this.drawingParameters.fillOn = false;
    }
  }

  updateTolerance(event: MatSliderChange): void {
    this.paintBucketTool.adjustTolerance(event);
  }
// Remplacement des if else par des switch comme vous avez dis pour le sprint 2 augmente le nombre de ligne considerablement
// tslint:disable-next-line:max-file-line-count
}
