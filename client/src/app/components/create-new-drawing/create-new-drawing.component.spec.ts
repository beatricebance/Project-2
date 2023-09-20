import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY } from 'rxjs';
import { ColorDataService } from 'src/app/services/color-data/color-data.service';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import * as CONSTANTS from '../../constants/constants';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { CreateNewDrawingComponent } from './create-new-drawing.component';

const mockRef = {
  close(): void {
    return;
  }
};
const viewDrawingParameter = 'viewDrawingParameter';

describe('CreateNewDrawingComponent', () => {
  let component: CreateNewDrawingComponent;
  let fixture: ComponentFixture<CreateNewDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewDrawingComponent , ColorPickerComponent ],
      providers: [ColorDataService, NewDrawingDataService, FormBuilder,
        { provide: MatDialogRef, useValue: mockRef } ,
       ],
     imports: [RouterTestingModule.withRoutes([]), ReactiveFormsModule, FormsModule, MatDialogModule],
     schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should veriifyDrawing not send', () => {
  const spy1 =  spyOn(component, 'verifyDrawing').and.callThrough();
  const spy2 =  spyOn(component, 'send');
  component[viewDrawingParameter].isSpaceCreated = true;
  component.verifyDrawing();
  expect(spy1).toHaveBeenCalled();
  expect(spy2).not.toHaveBeenCalled();
  });
  it('should veriifyDrawing do send', () => {
    component[viewDrawingParameter].isSpaceCreated = false;
    spyOn(component, 'verifyDrawing').and.callThrough();
    spyOn(component, 'send');
    component.verifyDrawing();
    expect(component.verifyDrawing).toHaveBeenCalled();
    expect(component.send).toHaveBeenCalled();
  });
  it('should send', () => {
    const colorhexadecimal = '#000000';
    const height = 600;
    const width = 600;
    component.f.colorHexa.setValue(colorhexadecimal);
    component.f.height.setValue(height);
    component.f.width.setValue(width);
    spyOn(component, 'send').and.callThrough();
    spyOn (component, 'validateForm');
    component.send();
    expect(component.send).toHaveBeenCalled();
    expect(component.validateForm).toHaveBeenCalled();
    expect(component[viewDrawingParameter].svgHeight).toEqual(height - CONSTANTS.MARGIN);
    expect(component[viewDrawingParameter].svgWidth).toEqual(width - CONSTANTS.SIDENAVBAR_SIZE);
    expect(component[viewDrawingParameter].svgColorHexa).toEqual(colorhexadecimal);
  });

  it('should resize', () => {
    window.dispatchEvent(new Event('resize'));
    component.resize();
    expect(component.height).toEqual(window.innerHeight);
    expect(component.width).toEqual(window.innerWidth);
  });

  it('should not resize', () => {
     const reSize = true;
     component.width = CONSTANTS.DIALOG_WIDTH_TEST;
     component.shouldResize = reSize ;
     window.dispatchEvent(new Event('resize'));
     component.resize();
     expect(component.width).not.toEqual(window.innerWidth);

  });

  it('shouldResize should be true', () => {
    component.collectData();
    expect(component.shouldResize).toEqual(true);
  });

  it('invalid forminValid', () => {
    const heightinput = CONSTANTS.HEIGHT_INPUT_TEST;
    component.f.height.setValue(heightinput);
    component.verifyDrawing();
    expect(component[viewDrawingParameter].svgHeight).not.toEqual(heightinput);
  });

  it('other_route ', () => {
    const spyNavigate = spyOn(component.router, 'navigateByUrl');
    component.navigateHander();
    expect(spyNavigate).toHaveBeenCalled();
  });

  it('should refresh', () => {
    spyOn(component, 'validateForm').and.callThrough();
    component.validateForm();
    expect(component.validateForm).toHaveBeenCalled();
  });
  it('should openColorDialog', () => {
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and
      // tslint:disable-next-line:no-any
      .returnValue({ afterClosed: () => EMPTY } as any);
    component.openColorDialog();
    expect(openDialogSpy).toHaveBeenCalled();
  });

});
