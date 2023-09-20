import { Injectable } from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import {keyBoardEvents, ToolsIndex} from '../../constants/enum';
import {ColorDataService} from '../color-data/color-data.service';
import {Coordinate} from '../commun-interface';

@Injectable({
  providedIn: 'root'
})

export class DrawingCommunService {
  beginPath: boolean;
  startCoordinate: Coordinate;
  endCoordinate: Coordinate;
  pathStroke: string;
  pathFill: string;
  height: string | null;
  width: string | null;
  radiusX: number;
  radiusY: number;

  thumbLabel: boolean;
  pencilIndex: number = ToolsIndex.PENCIL_INDEX;
  brushIndex: number = ToolsIndex.BRUSH_INDEX;
  rectangleIndex: number = ToolsIndex.RECTANGLE_INDEX;
  lineIndex: number = ToolsIndex.LINE_INDEX;
  airBrushIndex: number = ToolsIndex.AIR_BRUSH_INDEX;
  polygoneIndex: number = ToolsIndex.POLYGONE_INDEX;
  colorAplicatorIndex: number = ToolsIndex.COLOR_APPLICATOR_INDEX;
  eraseIndex: number = ToolsIndex.ERASE_INDEX;
  ellipseIndex: number = ToolsIndex.ELLIPSE_INDEX;
  pipetteIndex: number = ToolsIndex.PIPETTE_INDEX;
  gridIndex: number = ToolsIndex.GRID_INDEX;
  selectorIndex: number = ToolsIndex.SELECTION_INDEX;
  paintBucketIndex: number = ToolsIndex.PAINT_BUCKET_INDEX;
  calligraphyIndex: number  = ToolsIndex.CALLIGRAPHY_INDEX;
  sideNavBarWidth: string;
  actualStrock: string;
  actualFill: string;
  map: Map<string, number>;
  space: number;
  constructor( protected colorData: ColorDataService,
               ) {
    this.initializeMap();
    this.pathFill = colorData.primaryColor;
    this.beginPath = false;
    this.width = CONSTANTS.EMPTY_STRING;
    this.height = CONSTANTS.EMPTY_STRING;
    this.pathStroke = colorData.secondaryColor;
    this.endCoordinate = { x: CONSTANTS.START_COORDINATE_X, y: CONSTANTS.START_COORDINATE_Y };
    this.startCoordinate = { x: CONSTANTS.START_COORDINATE_X, y: CONSTANTS.START_COORDINATE_Y };

    this.space = CONSTANTS.SPACE;
    this.actualStrock = colorData.secondaryColor;
    this.actualFill = colorData.primaryColor;
   }
   private initializeMap(): void {
    this.map = new Map<string, number>();
    this.map.set(keyBoardEvents.EVENT_KEY_1, this.rectangleIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_2, this.ellipseIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_3, this.polygoneIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_W, this.brushIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_C, this.pencilIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_L, this.lineIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_A, this.airBrushIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_R, this.colorAplicatorIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_E, this.eraseIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_S, this.selectorIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_P, this.calligraphyIndex);
    this.map.set(keyBoardEvents.EVENT_KEY_B, this.paintBucketIndex);
  }

  updatePathStroke(stroke: string): void {
    this.pathStroke = stroke;
  }

  updatePathFill(fill: string): void {
    this.pathFill = fill;
  }

  idGenerator(): number {
    return Math.floor(Math.random() * CONSTANTS.MAX_ID) + 1;
  }

  findActivatedIndex(array: boolean[]): number {
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        return i;
      }
    }
    return -1;
  }
}
