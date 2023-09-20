import { Component, HostListener, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialog, MatDialogRef, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
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
import { OpenDialogService } from 'src/app/services/open-dialog/open-dialog.service';
import { PencilService } from 'src/app/services/pencil/pencil.service';
import { PipetteService } from 'src/app/services/pipette/pipette.service';
import { PolygonService } from 'src/app/services/polygon/polygon.service';
import { RectangleService } from 'src/app/services/rectangle/rectangle.service';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { SelectorService } from 'src/app/services/selector/selector.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import * as CONSTANTS from '../../constants/constants';
import {keyBoardEvents, ToolsIndex } from '../../constants/enum';
import { DrawingGalleryComponent } from '../drawing-gallery/drawing-gallery.component';
import { DrawingComponent } from '../drawing/drawing.component';
import { ExportDrawingComponent } from '../export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '../save-drawing/save-drawing.component';
import {Contour, Fill, Filters, Grid, JunctionType} from './drawing-view-data';
@Component({
  selector: 'app-drawing-view',
  templateUrl: './drawing-view.component.html',
  styleUrls: ['./drawing-view.component.scss']
})
export class DrawingViewComponent extends DrawingComponent implements OnInit {
  protected filters: Filters[] = [Filters.normal, Filters.spray, Filters.emboss, Filters.displacement, Filters.blur];
  protected contours: Contour[] = [Contour.activate, Contour.deactivate];
  protected fills: Fill[] = [Fill.activate, Fill.deactivate];
  protected grids: Grid[] = [Grid.activate, Grid.deactivate];
  protected junctionType: JunctionType[] = [JunctionType.normal, JunctionType.cercle];
  renderer: Renderer2;
  private isExported: boolean;
  private isSaved: boolean;
  private isGalleryOpened: boolean;
  private eventKey: string;
  constructor(private dialogRefExport: MatDialogRef<ExportDrawingComponent>,
              private dialogRefSave: MatDialogRef<SaveDrawingComponent>,
              private dialogRefGallery: MatDialogRef<DrawingGalleryComponent>,
              protected drawingData: DrawingCommunService,
              protected viewDrawingParameter: NewDrawingDataService,
              protected dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              protected colorData: ColorDataService,
              protected pencilTool: PencilService,
              protected brushTool: BrushService,
              protected rectangleTool: RectangleService,
              protected lineTool: LineService,
              public airBrushTool: AirBrushService,
              public polygoneTool: PolygonService,
              protected gridTool: GridService,
              protected eraseTool: EraseService,
              public selectionTool: SelectorService,
              public paintBucketTool: PaintBucketService,
              protected colorAplicatorTool: ColorApplicatorService,
              protected pipetteTool: PipetteService,
              protected ellipseTool: EllipseService,
              protected calligraphyTool: CalligraphyService,
              rendererFactory: RendererFactory2,
              protected drawingPile: UndoRedoService,
              protected saveService: SaveDrawingService,
              protected openDialogService: OpenDialogService) {
    super(drawingData, colorData, pencilTool, brushTool,
      rectangleTool, lineTool, airBrushTool, polygoneTool,
      gridTool, colorAplicatorTool, eraseTool,
      selectionTool, paintBucketTool, pipetteTool,
      ellipseTool, drawingPile, calligraphyTool, viewDrawingParameter);
    for (let i = 0; i < CONSTANTS.ICON_NUMBER; i++) {
      iconRegistry.addSvgIcon(
        CONSTANTS.ICON_NAMES[i],
        sanitizer.bypassSecurityTrustResourceUrl(CONSTANTS.ICON_LINKS[i]));
    }
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isExported = false;
    this.isSaved = false;
    this.isGalleryOpened = false;
    this.reload();

  }

  reload(): void {
    if (this.viewDrawingParameter.isAutoSave && localStorage.length !== 0) {
      this.viewDrawingParameter.svgWidth = Number(localStorage.getItem('myWidth'));
      this.viewDrawingParameter.svgHeight = Number(localStorage.getItem('myHeight'));
      this.viewDrawingParameter.svgColorHexa = localStorage.getItem('myColor') as string;
      }
  }

  ngOnInit(): void {
    this.initializeTools();
  }

  initializeTools(): void {
    for (let i = 0; i < CONSTANTS.NUMBER_OF_TOOLS; i++) {
      this.isActivetools.push(false);
    }
  }

  openDialogExport(): void {
    this.gridNotPresent();
    if (!this.isExported) {
      this.isExported = true;
      this.openDialogService.isDialogOpen = true;
      this.dialogRefExport = this.dialog.open(ExportDrawingComponent, {
        data: this.container,
      });
      this.dialogRefExport.afterClosed()
        .subscribe(() => {
          this.isExported = false;
          this.openDialogService.isDialogOpen = false;
          this.renderer.setAttribute(this.container.nativeElement, 'filter', 'url(#normal)');
        });
    }
  }

  gridNotPresent(): void {
    if (!this.drawingParameters.disableGrid) {
      this.gridTool.remove(this.container);
      this.drawingParameters.disableGrid = true;
    }
  }

    openDialogSaveDrawing(): void {
      this.gridNotPresent();
      if (!this.isSaved) {
       this.isSaved = true;
       this.saveService.initTagZone();
       this.openDialogService.isDialogOpen = true;
       this.dialogRefSave = this.dialog.open(SaveDrawingComponent, {
         data: this.container,
       });
       this.dialogRefSave.afterClosed()
        .subscribe(() => {
          this.isSaved = false;
          this.openDialogService.isDialogOpen = false;
        });
    }
  }

  openDialogDrawingGallery(): void {
    if (!this.isGalleryOpened) {
      this.isGalleryOpened = true;
      this.openDialogService.isDialogOpen = true;
      this.dialogRefGallery = this.dialog.open(DrawingGalleryComponent, {
        data: this.container,
      });
      this.dialogRefGallery.afterClosed()
        .subscribe(() => {
          this.isGalleryOpened = false;
          this.openDialogService.isDialogOpen = false;
        });
    }
  }

  newDrawing(): void {
    if (!this.openDialogService.isOpen) {
      this.openDialogService.openDialog();
      this.openDialogService.isOpen = true;
      this.openDialogService.isDialogOpen = true;
      this.drawingPile.resetPiles();
    }
  }

  chooseEvent(): void {
    switch (this.eventKey) {
      case keyBoardEvents.EVENT_KEY_O: {
        this.newDrawing();
        break;
      }
      case keyBoardEvents.EVENT_KEY_E: {
        this.openDialogExport();
        break;
      }
      case keyBoardEvents.EVENT_KEY_S: {
        this.openDialogSaveDrawing();
        break;
      }
      case keyBoardEvents.EVENT_KEY_G: {
        this.openDialogDrawingGallery();
        break;
      }
      default: {
        break;
      }
    }
  }

  drawableType(drawable: number): void {
    if ((drawable === this.drawingData.brushIndex) || drawable === this.drawingData.pencilIndex ||
    drawable === this.drawingData.airBrushIndex || drawable === this.drawingData.calligraphyIndex) {
      this.activateTools();
      return;
    } else if ((drawable === this.drawingData.rectangleIndex ) || (drawable === this.drawingData.ellipseIndex) ||
      (drawable === this.drawingData.polygoneIndex) || (drawable === this.drawingData.lineIndex)) {
      this.activateShapes();
      return;
    }
    this.deactivateToolsAndShapes();
  }

  chooseClipboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && (event.key === keyBoardEvents.EVENT_KEY_A)) {
      this.selectorOn = true;
      this.activateTool(ToolsIndex.SELECTION_INDEX);
      this.selectionTool.selectAll();
    } else if (event.ctrlKey && (event.key === keyBoardEvents.EVENT_KEY_C)) {
      this.selectionTool.copy();
    } else if (event.ctrlKey && (event.key === keyBoardEvents.EVENT_KEY_V)) {
      this.selectorOn = true;
      this.activateTool(ToolsIndex.SELECTION_INDEX);
      this.selectionTool.paste();
    } else if (event.ctrlKey && (event.key === keyBoardEvents.EVENT_KEY_X)) {
      this.selectionTool.cut();
    } else if (event.ctrlKey && (event.key === keyBoardEvents.EVENT_KEY_D)) {
      this.selectionTool.duplicate();
    } else if (event.key === keyBoardEvents.EVENT_KEY_DELETE) {
      this.selectionTool.delete();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (!this.openDialogService.isDialogOpen) {
      this.eventKey = event.key;
      if (event.ctrlKey && (event.key === this.eventKey)) {
        this.chooseEvent();
      }
    }
    if (event.ctrlKey && (event.key === keyBoardEvents.EVENT_KEY_Z)) {
      this.undo();
    } else if (event.ctrlKey && event.shiftKey && (event.key === keyBoardEvents.EVENT_KEY_SHIFT_Z)) {
      this.redo();
    }
    this.chooseClipboardEvent(event);
    if (event.key && !event.ctrlKey) {
      return;
    }
    event.preventDefault();
  }

  @HostListener('window:keyup', ['$event'])
  keyEventTools(event: KeyboardEvent): void {
    let toolIndex;
    if (!event.ctrlKey) {
      toolIndex = this.drawingData.map.get(event.key);
    }

    if (!this.openDialogService.isDialogOpen) {
      if (toolIndex !== undefined) {
        this.drawableType(toolIndex);
        this.activateTool(toolIndex);
      }
      if (!(this.drawingParameters.disableGrid) && (event.key === keyBoardEvents.EVENT_KEY_G)) {
        this.gridTool.remove(this.container);
        this.drawingParameters.disableGrid = true;
      } else if ((event.key === keyBoardEvents.EVENT_KEY_G) && (this.drawingParameters.disableGrid)) {
        this.gridTool.grid(this.container, this.sliderParameters.valueDecimal, this.drawingData.space);
        this.drawingParameters.disableGrid = false;
      }
      if (!this.drawingParameters.disableGrid && event.key === keyBoardEvents.EVENT_KEY_MINUS) {
        this.gridTool.reduceSize(this.container, this.sliderParameters.valueDecimal, this.drawingData.space);
      }
      if (!this.drawingParameters.disableGrid && event.key === keyBoardEvents.EVENT_KEY_PLUS) {
        this.gridTool.increaseSize(this.container, this.sliderParameters.valueDecimal, this.drawingData.space);

      }
    }
  }

}
