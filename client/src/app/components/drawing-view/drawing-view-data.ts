import * as CONSTANTS from '../../constants/constants';
import {SliderParameters} from '../../constants/enum';

export enum Filters {
  normal = 'normal',
  spray = 'spray',
  emboss = 'emboss',
  displacement = 'displacementFilter',
  blur = 'blur9',
  translucide = 'translucide',
  Dilate = 'Dilate',
}

export enum Contour {
  activate = 'Activer',
  deactivate = 'Desactiver'
}

export enum Fill {
  activate = 'Activer',
  deactivate = 'Desactiver'
}

export enum Grid {
  activate = 'Activer',
  deactivate = 'Desactiver'
}

export enum JunctionType {
  normal = 'Normal',
  cercle = 'Cercle'
}

export class ViewParameters {
  max: number = SliderParameters.MAX_SLIDER;
  maxDecimal: number = SliderParameters.MAX_DECIMAL_SLIDER;
  minDecimal: number = SliderParameters.MIN_DECIMAL_SLIDER;
  min: number = SliderParameters.MIN_SLIDER;
  minGrid: number = SliderParameters.MIN_SLIDER_GRID;
  minErase: number = CONSTANTS.ERASE_MIN_VALUE;
  maxErase: number = CONSTANTS.ERASE_MAX_VALUE;
  maxSides: number = SliderParameters.MAX_SIDES;
  minSides: number = SliderParameters.MIN_SIDES;
  step: number = SliderParameters.SLIDER_STEP;
  step5: number = SliderParameters.SLIDER_STEP_5;
  stepDecimal: number = SliderParameters.SLIDER_DECIMAL_STEP;
  maxCalligraphy: number = SliderParameters.MAX_CALLIGRAPHY;
  minCalligraphy: number = SliderParameters.MIN_CALLIGRAPHY;
  value: number = SliderParameters.VALUE;
  valueDecimal: number = SliderParameters.VALUE_DECIMAL;
  polygoneSides: number = SliderParameters.MIN_SIDES;
  junctionWidth: number = SliderParameters.VALUE;
  angleCalligraphy: number = CONSTANTS.CALLIGRAPHY_ANGLE;
  contourState: string = CONSTANTS.ACTIVE;
  filled: string = CONSTANTS.ACTIVE;
  grid: string = CONSTANTS.DEACTIVATED;
  junctionState: string = CONSTANTS.JUCTION_NORMAL;
  filterState: string = CONSTANTS.DEFAULT_FILTER;
}
