const TRUE = true;
const FALSE = false;
const AIR_BRUSH_SECOND = 10;
const ZER0 = 0;
export class DrawingParameters {
  canRedo: boolean = FALSE;
  canUndo: boolean = FALSE;
  drawablesOn: boolean = FALSE;
  toolsOn: boolean = FALSE;
  shapesOn: boolean = FALSE;
  disableGrid: boolean = TRUE;
  contourOn: boolean = FALSE;
  fillOn: boolean = FALSE;
  circleOn: boolean = FALSE;
  disableJunction: boolean = TRUE;
  cercleDiameter: number = ZER0;
  airBrushEmission: number = AIR_BRUSH_SECOND;
}
