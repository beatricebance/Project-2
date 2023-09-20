import { Overlay } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule, MatDialogRef, MatDivider, MatIcon, MatRadioButton,
  MatRadioGroup, MatRipple, MatSidenav, MatSidenavContainer, MatSidenavContent, MatSlider
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, EMPTY } from 'rxjs';
import {SvgAttributes} from '../../constants/enum';
import { ColorPickerModalComponent } from '../color-picker-modal/color-picker-modal.component';
import { CreateNewDrawingComponent } from '../create-new-drawing/create-new-drawing.component';
import { DrawingViewComponent } from './drawing-view.component';

 // tslint:disable no-any
    // tslint:disable: no-string-literal

class MockRef  {
  test: BehaviorSubject<any> = new BehaviorSubject(1);
  close(): boolean {
    this.test.next(2);
    return true;
  }
  afterClosed(): BehaviorSubject<any> {
    return this.test;
  }
}

const gridTool = 'gridTool';
const openDialogService = 'openDialogService';
const selectionTool = 'selectionTool';
const dialog = 'dialog';
const dialogRefExport = 'dialogRefExport';
const dialogRefSave = 'dialogRefSave';
const dialogRefGallery = 'dialogRefGallery';

describe('DrawingViewComponent', () => {
  let component: DrawingViewComponent;
  let fixture: ComponentFixture<DrawingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingViewComponent,
        MatIcon,
        MatSidenav,
        MatSlider,
        MatDivider,
        MatRadioButton,
        MatRadioGroup,
        MatSidenavContent,
        MatSidenavContainer,
        ColorPickerModalComponent,
        CreateNewDrawingComponent,
        MatRipple, ],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          MatDialogModule,
          HttpClientModule
        ],
        providers: [
          MatDialog,
          Overlay,
          { provide: MatDialogRef, useClass: MockRef },
          MAT_DIALOG_SCROLL_STRATEGY_PROVIDER
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test gridNotPresent', () => {
    component['drawingParameters'].disableGrid = true;
    const spy = spyOn(component[gridTool], 'remove');
    component.gridNotPresent();
    expect(spy).not.toHaveBeenCalled();
    component['drawingParameters'].disableGrid = false;
    component.gridNotPresent();
    expect(spy).toHaveBeenCalled();
    expect(component['drawingParameters'].disableGrid).toBeTruthy();
  });

  it('Test newDrawing', () => {
    component[openDialogService].isOpen = true;
    const spy = spyOn(component[openDialogService], 'openDialog');
    component.newDrawing();
    expect(spy).not.toHaveBeenCalled();

    component[openDialogService].isOpen = false;
    component.newDrawing();
    expect(spy).toHaveBeenCalled();
  });

  it('Test chooseEvent', () => {
    component['eventKey'] = 'o';
    const spy = spyOn(component, 'newDrawing');
    component.chooseEvent();
    expect(spy).toHaveBeenCalled();

    component['eventKey'] = 'e';
    const spy2 = spyOn(component, 'openDialogExport');
    component.chooseEvent();
    expect(spy2).toHaveBeenCalled();

    component['eventKey'] = 's';
    const spy3 = spyOn(component, 'openDialogSaveDrawing');
    component.chooseEvent();
    expect(spy3).toHaveBeenCalled();

    component['eventKey'] = 'g';
    const spy4 = spyOn(component, 'openDialogDrawingGallery');
    component.chooseEvent();
    expect(spy4).toHaveBeenCalled();

    component['eventKey'] = '';
    component.chooseEvent();
  });

  it('Test keyEvent', () => {
    component[openDialogService].isDialogOpen = true;
    const event1 = new KeyboardEvent('keydown', {key: '0', ctrlKey: true});
    const spy = spyOn(component, 'chooseEvent');
    component.keyEvent(event1);
    expect(spy).not.toHaveBeenCalled();

    const event2 = new KeyboardEvent('keydown', {key: '0', ctrlKey: true});
    component[openDialogService].isDialogOpen = false;
    component.keyEvent(event2);
    expect(spy).toHaveBeenCalled();

    const event3 = new KeyboardEvent('keydown', {key: '0', ctrlKey: false});
    component[openDialogService].isDialogOpen = false;
    component.keyEvent(event3);
    expect(spy).toHaveBeenCalled();

    const event4 = new KeyboardEvent('keydown', {key: 'z', ctrlKey: true});
    component[openDialogService].isDialogOpen = false;
    const spy1 = spyOn(component, 'undo');
    component.keyEvent(event4);
    expect(spy1).toHaveBeenCalled();

    const event5 = new KeyboardEvent('keydown', {key: 'Z', ctrlKey: true, shiftKey: true});
    component[openDialogService].isDialogOpen = false;
    const spy2 = spyOn(component, 'redo');
    component.keyEvent(event5);
    expect(spy2).toHaveBeenCalled();

    const event6 = new KeyboardEvent('keydown', {key: 'a', ctrlKey: true});
    component['selectorOn'] = true;
    component[openDialogService].isDialogOpen = false;
    const spy3 = spyOn(component[selectionTool], 'selectAll');
    component.keyEvent(event6);
    expect(spy3).toHaveBeenCalled();

  });

  it('Test keyEventTools', () => {
    const event1 = new KeyboardEvent('keydown', {key: 'a', ctrlKey: false});
    component[openDialogService].isDialogOpen = false;
    const spy = spyOn(component, 'activateTool');
    component.keyEventTools(event1);
    expect(spy).toHaveBeenCalled();

    const event2 = new KeyboardEvent('keydown', {key: 'x', ctrlKey: true});
    component[openDialogService].isDialogOpen = true;
    component.keyEventTools(event2);

    const event3 = new KeyboardEvent('keydown', {key: 'x', ctrlKey: false});
    component[openDialogService].isDialogOpen = false;
    component.keyEventTools(event3);

    const event4 = new KeyboardEvent('keydown', {key: 'g'});
    component['drawingParameters'].disableGrid = false;
    component.keyEventTools(event4);
    expect(component['drawingParameters'].disableGrid).toBeTruthy();

    const event5 = new KeyboardEvent('keydown', {key: 'g'});
    component['drawingParameters'].disableGrid = true;
    component.keyEventTools(event5);
    expect(component['drawingParameters'].disableGrid).toBeFalsy();

    const event6 = new KeyboardEvent('keydown', {key: '-'});
    component[openDialogService].isDialogOpen = false;
    const spy2 = spyOn(component[gridTool], 'reduceSize');
    component.keyEventTools(event6);
    expect(spy2).toHaveBeenCalled();

    const event7 = new KeyboardEvent('keydown', {key: '='});
    component[openDialogService].isDialogOpen = false;
    const spy3 = spyOn(component[gridTool], 'increaseSize');
    component.keyEventTools(event7);
    expect(spy3).toHaveBeenCalled();
  });

  it('openDialogExport', () => {
    component['isExported'] = false;
    const openDialogSpy = spyOn(component[dialog], 'open')
      .and
      .returnValue({ afterClosed: () => EMPTY } as any);
    const spy = spyOn(component, 'openDialogExport').and.callThrough();
    component.openDialogExport();
    expect(spy).toHaveBeenCalled();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(component['isExported']).toBeTruthy();
    component['isExported'] = true;
    component.openDialogExport();
  });

  it('openDialogSaveDrawing', () => {
    component['isSaved'] = false;
    const openDialogSpy = spyOn(component[dialog], 'open')
      .and
      .returnValue({ afterClosed: () => EMPTY } as any);
    const spy = spyOn(component, 'openDialogSaveDrawing').and.callThrough();
    component.openDialogSaveDrawing();
    expect(spy).toHaveBeenCalled();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(component['isSaved']).toBeTruthy();

    component['isSaved'] = true;
    component.openDialogSaveDrawing();
  });

  it('openDialogDrawingGallery', () => {
    component['isGalleryOpened'] = false;
    const openDialogSpy = spyOn(component[dialog], 'open')
      .and
      .returnValue({ afterClosed: () => EMPTY } as any);
    const spy = spyOn(component, 'openDialogDrawingGallery').and.callThrough();
    component.openDialogDrawingGallery();
    expect(spy).toHaveBeenCalled();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(component['isGalleryOpened']).toBeTruthy();

    component['isGalleryOpened'] = true;
    component.openDialogDrawingGallery();
  });
  it('should test afterclose diologexport', () => {
    const test: BehaviorSubject<any> = new BehaviorSubject(1);

    spyOn(component[dialog], 'open')
    .and
    .returnValue( {
      close(): boolean {
        test.next(2);
        return true;
      },
      afterClosed(): BehaviorSubject<any> {
        return test;
      }
    } as any);

    component.openDialogExport();
    component[dialogRefExport].close();
    expect(component['isExported']).toBeFalsy();
    expect(component[openDialogService].isDialogOpen).toBeFalsy();
  });

  it('should test afterclose dialogsave', () => {
    const test: BehaviorSubject<any> = new BehaviorSubject(1);
    spyOn(component[dialog], 'open')
    .and
    .returnValue( {
      close(): boolean {
        test.next(2);
        return true;
      },
      afterClosed(): BehaviorSubject<any> {
        return test;
      }
    } as any);

    component.openDialogSaveDrawing();
    component[dialogRefSave].close();
    expect(component['isSaved']).toBeFalsy();
    expect(component[openDialogService].isDialogOpen).toBeFalsy();
  });
  it('should test afterclose dialog gallery', () => {
    const test: BehaviorSubject<any> = new BehaviorSubject(1);

    spyOn(component[dialog], 'open')
    .and
    .returnValue( {
      close(): boolean {
        test.next(2);
        return true;
      },
      afterClosed(): BehaviorSubject<any> {
        return test;
      }
    } as any);

    component.openDialogDrawingGallery();
    component[dialogRefGallery].close();
    expect(component['isGalleryOpened']).toBeFalsy();
    expect(component[openDialogService].isDialogOpen).toBeFalsy();
  });

  it('should test reload', () => {
    component['viewDrawingParameter'].isAutoSave = true;
    component.container = new ElementRef<SVGElement>(document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING));
    localStorage.setItem('myInnerSvg', component.container.nativeElement.innerHTML);
    localStorage.setItem('myWidth', JSON.stringify(component['viewDrawingParameter'].svgWidth));
    localStorage.setItem('myHeight', JSON.stringify(component['viewDrawingParameter'].svgHeight));
    localStorage.setItem('myColor', JSON.stringify(component['viewDrawingParameter'].svgColorHexa));
    component.reload();
    expect().nothing();
  });

  it('should test drawableType', () => {
    const spy = spyOn(component, 'activateTools');
    component.drawableType(component['drawingData'].calligraphyIndex);
    expect(spy).toHaveBeenCalled();

    const spy2 = spyOn(component, 'activateShapes');
    component.drawableType(component['drawingData'].rectangleIndex);
    expect(spy2).toHaveBeenCalled();

    component.drawableType(component['drawingData'].ellipseIndex);
    expect(spy2).toHaveBeenCalled();

    component.drawableType(component['drawingData'].lineIndex);
    expect(spy2).toHaveBeenCalled();

    component.drawableType(component['drawingData'].polygoneIndex);
    expect(spy2).toHaveBeenCalled();

    const trente = 30;
    const spy3 = spyOn(component, 'deactivateToolsAndShapes');
    component.drawableType(trente);
    expect(spy3).toHaveBeenCalled();
  });

  it('should test chooseClipboardEvent', () => {
    const event2 = new KeyboardEvent('keydown', {key: 'v', ctrlKey: true});
    const spy2 = spyOn(component['selectionTool'], 'paste');
    component.chooseClipboardEvent(event2);
    expect(spy2).toHaveBeenCalled();

    const event3 = new KeyboardEvent('keydown', {key: 'x', ctrlKey: true});
    const spy3 = spyOn(component['selectionTool'], 'cut');
    component.chooseClipboardEvent(event3);
    expect(spy3).toHaveBeenCalled();

    const event4 = new KeyboardEvent('keydown', {key: 'd', ctrlKey: true});
    const spy4 = spyOn(component['selectionTool'], 'duplicate');
    component.chooseClipboardEvent(event4);
    expect(spy4).toHaveBeenCalled();

    const event5 = new KeyboardEvent('keydown', {key: 'Delete', ctrlKey: false});
    const spy5 = spyOn(component['selectionTool'], 'delete');
    component.chooseClipboardEvent(event5);
    expect(spy5).toHaveBeenCalled();

    const event6 = new KeyboardEvent('keydown', {key: 'd', ctrlKey: false});
    component.chooseClipboardEvent(event6);

    const event1 = new KeyboardEvent('keydown', {key: 'c', ctrlKey: true});
    const spy = spyOn(component['selectionTool'], 'copy');
    component.chooseClipboardEvent(event1);
    expect(spy).toHaveBeenCalled();
  });

// tslint:disable-next-line: max-file-line-count
});
