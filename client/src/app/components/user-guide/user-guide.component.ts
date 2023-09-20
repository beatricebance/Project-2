import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import airBrush from '../../../assets/air-brush.json';
import brush from '../../../assets/brush.json';
import bucket from '../../../assets/bucket.json';
import colorApplicator from '../../../assets/color-applicator.json';
import continueDrawing from '../../../assets/continue-drawing.json';
import ellipse from '../../../assets/ellipse.json';
import eraser from '../../../assets/eraser.json';
import exportDrawing from '../../../assets/export.json';
import feather from '../../../assets/feather.json';
import gallery from '../../../assets/galerie.json';
import grid from '../../../assets/grid.json';
import line from '../../../assets/line.json';
import newDrawing from '../../../assets/new.json';
import pencil from '../../../assets/pencil.json';
import pipette from '../../../assets/pipette.json';
import polygone from '../../../assets/polygone.json';
import rectangle from '../../../assets/rectangle.json';
import save from '../../../assets/save.json';
import selection from '../../../assets/selection.json';
import shortcut from '../../../assets/shortcuts.json';
import undoRedo from '../../../assets/undo-redo.json';
import * as CONSTANTS from '../../constants/constants';
import {GuideData, GuideIndex} from './guide-data';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  opened: boolean;
  isToolHidden: boolean;
  isShapeHidden: boolean;
  isUtilitiesHidden: boolean;
  isFilesHidden: boolean;
  index: number;
  guideList: GuideData[];
  nbElements: number;
  map: Map<number, GuideData[]>;

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    this.opened = true;
    this.isToolHidden = false;
    this.isShapeHidden = false;
    this.isUtilitiesHidden = false;
    this.isFilesHidden = false;
    this.nbElements = CONSTANTS.NB_ELEMENTS;
    this.initializeMap();
    iconRegistry.addSvgIcon(
      'closeguide',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/clear-24px.svg'));
  }

  updateIndex(indice: number): void {
    this.index = indice;
    this.updateGuideContent();
  }
  updatePrevious(): void {
    this.isToolHidden = true;
    this.isShapeHidden = true;
    this.isUtilitiesHidden = true;
    this.isFilesHidden = true;
    this.index -= 1;
    this.updateGuideContent();
  }
  updateNext(): void {
    this.isToolHidden = true;
    this.isShapeHidden = true;
    this.isUtilitiesHidden = true;
    this.isFilesHidden = true;
    this.index += 1;
    this.updateGuideContent();
  }
  previous(): void {
    window.history.back();
  }

  updateGuideContent(): void {
    const toolIndex = this.map.get(this.index);
    if (toolIndex !== undefined) {
      this.guideList = toolIndex;
    }
  }

  private initializeMap(): void {
    this.map = new Map<number, GuideData[]>();
    this.map.set(GuideIndex.GUIDE_PENCIL_INDEX, pencil);
    this.map.set(GuideIndex.GUIDE_BRUSH_INDEX, brush);
    this.map.set(GuideIndex.GUIDE_PIPETTE_INDEX, pipette);
    this.map.set(GuideIndex.GUIDE_COLOR_APPLICATOR_INDEX, colorApplicator);
    this.map.set(GuideIndex.GUIDE_AIR_BRUSH_INDEX, airBrush);
    this.map.set(GuideIndex.GUIDE_ERASER_INDEX, eraser);
    this.map.set(GuideIndex.GUIDE_LINE_INDEX, line);
    this.map.set(GuideIndex.GUIDE_RECTANGLE_INDEX, rectangle);
    this.map.set(GuideIndex.GUIDE_ELLIPSE_INDEX, ellipse);
    this.map.set(GuideIndex.GUIDE_POLYGONE_INDEX, polygone);
    this.map.set(GuideIndex.GUIDE_SELECTION_INDEX, selection);
    this.map.set(GuideIndex.GUIDE_UNDO_REDO_INDEX, undoRedo);
    this.map.set(GuideIndex.GUIDE_GRID_INDEX, grid);
    this.map.set(GuideIndex.GUIDE_SHORTCUT_INDEX, shortcut);
    this.map.set(GuideIndex.GUIDE_EXPORT_INDEX, exportDrawing);
    this.map.set(GuideIndex.GUIDE_SAVE_INDEX, save);
    this.map.set(GuideIndex.GUIDE_CONTINUE_INDEX, continueDrawing);
    this.map.set(GuideIndex.GUIDE_BUCKET_INDEX, bucket);
    this.map.set(GuideIndex.GUIDE_GALERIE_INDEX, gallery);
    this.map.set(GuideIndex.GUIDE_NEW_INDEX, newDrawing);
    this.map.set(GuideIndex.GUIDE_FEATHER_INDEX, feather);
  }

  ngOnInit(): void {
    this.index = 0;
    this.updateGuideContent();
  }
}
