import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatRadioButton, MatRadioChange, MatSliderChange } from '@angular/material';
import { GridService } from 'src/app/services/grid/grid.service';
import {SvgAttributes, ToolsIndex} from '../../constants/enum';
import {UndoRedoPile} from '../../services/commun-interface';
import { DrawingComponent } from './drawing.component';
// tslint:disable: no-string-literal

const drawingData = 'drawingData';
const selectionTool = 'selectionTool';
const gridTool = 'gridTool';
const colorAplicatorTool = 'colorAplicatorTool';
const eraseTool = 'eraseTool';
const pipetteTool = 'pipetteTool';
const polygoneTool = 'polygoneTool';
const lineTool = 'lineTool';
const drawingPile = 'drawingPile';
const pencilTool = 'pencilTool';
const ellipseTool = 'ellipseTool';
const airBrushTool = 'airBrushTool';
const rectangleTool = 'rectangleTool';
const brushTool = 'brushTool';
const number10 = 10;

describe('DrawingComponent', () => {
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingComponent, MatRadioButton],
      providers: [GridService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test initializeElements', () => {
    // tslint:disable-next-line: no-string-literal
    component['isActivetools'].length = number10;
    component.initializeElements();
    const temp = component['isActivetools'];
    for (const i of temp) {
      expect(i).toBeFalsy();
    }
    expect(component['drawingParameters'].drawablesOn).toBeFalsy();
  });

  it('Test activateTool for colorApplicator', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[colorAplicatorTool], 'onClick');
    const spy2 = spyOn(component[eraseTool], 'eraseDeactivate');
    component.activateTool(ToolsIndex.COLOR_APPLICATOR_INDEX);
    expect(component['opened']).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('Test activateTool for eraser', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[eraseTool], 'eraseActivate');
    const spy2 = spyOn(component[eraseTool], 'eraseDeactivate');
    component.activateTool(ToolsIndex.ERASE_INDEX);
    expect(component['opened']).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('Test activateTool for selection', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[selectionTool], 'initializeSelector');
    const spy2 = spyOn(component[eraseTool], 'eraseDeactivate');
    component.activateTool(ToolsIndex.SELECTION_INDEX);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component['selectorOn']).toBeTruthy();
  });

  it('Test activateTool for pipette', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[pipetteTool], 'initializePipette');
    const spy2 = spyOn(component[eraseTool], 'eraseDeactivate');
    component.activateTool(ToolsIndex.PIPETTE_INDEX);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('Test activateTool for defalut', () => {
    const spy2 = spyOn(component[eraseTool], 'eraseDeactivate');
    component.activateTool(-1);
    expect(component['selectorOn']).toBeFalsy();
    expect(spy2).toHaveBeenCalled();
  });

  it('activateTools', () => {
    component.activateTools();
    expect(component['drawingParameters'].toolsOn).toBeTruthy();
  });

  it('activateShapes', () => {
    component.activateShapes();
    expect(component['drawingParameters'].shapesOn).toBeTruthy();
  });

  it('activateGrid', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['drawingParameters'].disableGrid = false;
    const spy = spyOn(component[gridTool], 'remove');
    component.activateGrid();
    expect(spy).toHaveBeenCalled();
    expect(component['drawingParameters'].disableGrid).toBeTruthy();

    component['drawingParameters'].disableGrid = true;
    component.activateGrid();
    expect(component['drawingParameters'].disableGrid).toBeFalsy();
  });

  it('OnSideChange', () => {
    const spy = spyOn(component[polygoneTool], 'updateAngle');
    component.OnSideChange();
    expect(spy).toHaveBeenCalled();
  });

  it('draw', () => {
    component['drawingParameters'].disableGrid = false;
    const spy = spyOn(component, 'draw1');
    component.draw('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

    component['drawingParameters'].disableGrid = true;
    component.draw('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('shiftUp', () => {
    const spy = spyOn(component[lineTool], 'shiftUp');
    component.shiftUp('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('shiftDown', () => {
    const spy = spyOn(component[lineTool], 'shiftDown');
    component.shiftDown('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('escape', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.LINE_INDEX] = true;
    const spy = spyOn(component[lineTool], 'escape');
    component.onEscape();
    expect(spy).toHaveBeenCalled();

    component['isActivetools'][ToolsIndex.LINE_INDEX] = false;
    component.onEscape();
  });

  it('backspace', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.LINE_INDEX] = true;
    const spy = spyOn(component[lineTool], 'backspace');
    component.onBackspace();
    expect(spy).toHaveBeenCalled();

    component['isActivetools'][ToolsIndex.LINE_INDEX] = false;
    component.onBackspace();
  });

  it('doubleClick', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.LINE_INDEX] = true;
    const spy = spyOn(component[lineTool], 'doubleClick');
    component.doubleClick('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

    component['isActivetools'][ToolsIndex.LINE_INDEX] = false;
    component.doubleClick('' as unknown as MouseEvent);
  });

  it('undo', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[drawingPile], 'undo');
    component.undo();
    expect(spy).toHaveBeenCalled();
  });

  it('redo', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[drawingPile], 'redo');
    const temp: UndoRedoPile = {id: -1, element: ('' as unknown as ChildNode), type: ''};
    component[drawingPile].redoPile.push(temp);
    component.redo();
    expect(spy).toHaveBeenCalled();

    component[drawingPile].redoPile.push(temp);
    component.redo();
  });

  it('beginDrawing pencil', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.PENCIL_INDEX] = true;
    const spy = spyOn(component[pencilTool], 'beginDrawing');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing brushTool', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.BRUSH_INDEX] = true;
    const spy = spyOn(component[brushTool], 'beginDrawing');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing rectangleTool', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.RECTANGLE_INDEX] = true;
    const spy = spyOn(component[rectangleTool], 'onMouseDown');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.PENCIL_INDEX] = true;
    const spy = spyOn(component[pencilTool], 'beginDrawing');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing airBrushTool', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.AIR_BRUSH_INDEX] = true;
    const spy = spyOn(component[airBrushTool], 'onMouseDown');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing polygoneTool', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.POLYGONE_INDEX] = true;
    const spy = spyOn(component[polygoneTool], 'onMouseDown');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing ellipse', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.ELLIPSE_INDEX] = true;
    const spy = spyOn(component[ellipseTool], 'onMouseDown');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing erase', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.ERASE_INDEX] = true;
    const spy = spyOn(component[eraseTool], 'onMouseDown');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('beginDrawing select', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.SELECTION_INDEX] = true;
    const spy = spyOn(component[selectionTool], 'onMouseDown');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

    component['isActivetools'][ToolsIndex.SELECTION_INDEX] = false;
    component['isActivetools'][ToolsIndex.PIPETTE_INDEX] = true;
    component.beginDrawing('' as unknown as MouseEvent);
  });

  it('beginDrawing feather', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.CALLIGRAPHY_INDEX] = true;
    const spy = spyOn(component['calligraphyTool'], 'onMouseDown');
    component.beginDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('draw1 for pencil', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.PENCIL_INDEX] = true;
    const spy = spyOn(component[pencilTool], 'draw');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for brush', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.BRUSH_INDEX] = true;
    const spy = spyOn(component[brushTool], 'draw');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for line', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.LINE_INDEX] = true;
    const spy = spyOn(component[lineTool], 'draw');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for rectangle', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.RECTANGLE_INDEX] = true;
    const spy = spyOn(component[rectangleTool], 'draw');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for polygone', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.POLYGONE_INDEX] = true;
    const spy = spyOn(component[polygoneTool], 'draw');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for airbrush', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.AIR_BRUSH_INDEX] = true;
    const spy = spyOn(component[airBrushTool], 'draw');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for ellipse', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.ELLIPSE_INDEX] = true;
    const spy = spyOn(component[ellipseTool], 'draw');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for erase', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.ERASE_INDEX] = true;
    const spy = spyOn(component[eraseTool], 'mouseMouve');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for feather', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.CALLIGRAPHY_INDEX] = true;
    const spy = spyOn(component['calligraphyTool'], 'onMouseMove');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('draw1 for selection', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.SELECTION_INDEX] = true;
    const spy = spyOn(component[selectionTool], 'onMouseMove');
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

    component['isActivetools'][ToolsIndex.PIPETTE_INDEX] = true;
    component.draw1('' as unknown as MouseEvent);
  });

  it('draw1 for else of else if path', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[selectionTool], 'onMouseMove');
    component['isActivetools'][ToolsIndex.PIPETTE_INDEX] = true;
    component.draw1('' as unknown as MouseEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('draw1 for else path', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component, 'updatePathStroke');
    component['drawingParameters'].contourOn = false;
    component['drawingParameters'].fillOn = false;
    component['sliderParameters'].contourState = '';
    component['sliderParameters'].filled = '';
    component['isActivetools'][ToolsIndex.ELLIPSE_INDEX] = true;
    component.draw1('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('Test updatePathStroke', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const spy = spyOn(component[drawingData], 'updatePathStroke');
    component['isActivetools'][ToolsIndex.ELLIPSE_INDEX] = true;
    component['drawingParameters'].contourOn = false;
    component['sliderParameters'].contourState = '';
    component.updatePathStroke();
    expect(spy).not.toHaveBeenCalled();
  });

  it('stopDrawing for pencil', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.PENCIL_INDEX] = true;
    component['toolsActivated'] = true;
    const spy = spyOn(component[pencilTool], 'stopDrawing');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('stopDrawing for brush', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.BRUSH_INDEX] = true;
    component['toolsActivated'] = true;
    const spy = spyOn(component[brushTool], 'stopDrawing');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('stopDrawing for rectangle', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.RECTANGLE_INDEX] = true;
    component['toolsActivated'] = true;
    const spy = spyOn(component[rectangleTool], 'onMouseUp');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('stopDrawing for airbrush', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.AIR_BRUSH_INDEX] = true;
    component['toolsActivated'] = true;
    const spy = spyOn(component[airBrushTool], 'stopDrawing');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('stopDrawing for polygone', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.POLYGONE_INDEX] = true;
    component['toolsActivated'] = true;
    const spy = spyOn(component[polygoneTool], 'onMouseUp');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('stopDrawing for ellipse', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.ELLIPSE_INDEX] = true;
    component['toolsActivated'] = true;
    const spy = spyOn(component[ellipseTool], 'onMouseUp');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('stopDrawing for eraser', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.ERASE_INDEX] = true;
    component['toolsActivated'] = true;
    const spy = spyOn(component[eraseTool], 'onMouseUp');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('stopDrawing for seletion', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['toolsActivated'] = true;
    const spy = spyOn(component[selectionTool], 'onMouseUp');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).not.toHaveBeenCalled();

    component['isActivetools'][ToolsIndex.SELECTION_INDEX] = true;
    component['toolsActivated'] = true;
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('stopDrawing for feather', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['toolsActivated'] = true;
    component['isActivetools'][ToolsIndex.CALLIGRAPHY_INDEX] = true;
    const spy = spyOn(component['calligraphyTool'], 'onMouseUp');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('stopDrawing for else path', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['toolsActivated'] = false;
    const spy = spyOn(component[selectionTool], 'onMouseUp');
    component.stopDrawing('' as unknown as MouseEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('click for seletion', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.SELECTION_INDEX] = true;
    const spy = spyOn(component[selectionTool], 'onClick');
    component.click('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('click for pipette', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.PIPETTE_INDEX] = false;
    component.click('' as unknown as MouseEvent);
    const spy = spyOn(component[pipetteTool], 'onClick');
    expect(spy).not.toHaveBeenCalled();

    component['isActivetools'][ToolsIndex.PIPETTE_INDEX] = true;
    component.click('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('click for paintBucket', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.PAINT_BUCKET_INDEX] = true;
    component.click('' as unknown as MouseEvent);
    const spy = spyOn(component['paintBucketTool'], 'onClick');
    expect(spy).not.toHaveBeenCalled();
  });

  it('click for line', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.LINE_INDEX] = true;
    component['drawingParameters'].circleOn = true;
    component['sliderParameters'].junctionWidth = 2;
    const spy = spyOn(component[lineTool], 'click');
    component.click('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
    expect(component['drawingParameters'].cercleDiameter).toEqual(component['sliderParameters'].junctionWidth);
  });

  it('click for line else path', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['isActivetools'][ToolsIndex.LINE_INDEX] = true;
    component['sliderParameters'].junctionWidth = 2;
    const spy = spyOn(component[lineTool], 'click');
    component['drawingParameters'].circleOn = false;
    component.click('' as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
    expect(component['drawingParameters'].cercleDiameter).not.toEqual(component['sliderParameters'].junctionWidth);

  });

  it('Test updateFilter', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    component['sliderParameters'].junctionWidth = 2;
    const spy = spyOn(component[brushTool], 'updateFilter');
    component.updateFilter('' as unknown as MatRadioChange);
    expect(spy).toHaveBeenCalled();

  });

  it('updateJunction', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const radio = new MatRadioChange('' as unknown as MatRadioButton, 'Cercle');
    component.updateJunction(radio);
    expect(component['drawingParameters'].circleOn).toBeTruthy();

    const radio1 = new MatRadioChange('' as unknown as MatRadioButton, '');
    component.updateJunction(radio1);
    expect(component['drawingParameters'].circleOn).toBeFalsy();
  });

  it('updateContour', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const radio = new MatRadioChange('' as unknown as MatRadioButton, 'Activer');
    component.updateContour(radio);
    expect(component['drawingParameters'].contourOn).toBeTruthy();

    const radio1 = new MatRadioChange('' as unknown as MatRadioButton, '');
    component.updateContour(radio1);
    expect(component['drawingParameters'].contourOn).toBeFalsy();
  });

  it('updateFill', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const radio = new MatRadioChange('' as unknown as MatRadioButton, 'Activer');
    component.updateFill(radio);
    expect(component['drawingParameters'].fillOn).toBeTruthy();

    const radio1 = new MatRadioChange('' as unknown as MatRadioButton, '');
    component.updateFill(radio1);
    expect(component['drawingParameters'].fillOn).toBeFalsy();
  });

  it('updateTolerance', () => {
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    const radio = new MatSliderChange();
    const spy = spyOn(component['paintBucketTool'], 'adjustTolerance');
    component.updateTolerance(radio);
    expect(spy).toHaveBeenCalled();
  });

// tslint:disable-next-line: max-file-line-count
});
