// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorDataService } from 'src/app/services/color-data/color-data.service';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ ColorPickerComponent ],
          providers: [FormBuilder, ColorDataService],
          imports: [MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, BrowserAnimationsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
      }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute addSecondaryColor', () => {
        component.colorData.top10RecentColors = [];
        const spy = spyOn(component['renderer'], 'listen').and.callThrough();
        component.colorData.top10RecentColors.push('#000000');
        component.addSecondaryColor();
        expect(spy).toHaveBeenCalled();
        expect(component.colorData.secondaryColor).toEqual('#000000');
      });
  it('should execute addPrimarycolor', () => {
    component.colorData.top10RecentColors = [];
    const spy = spyOn(component['renderer'], 'listen').and.callThrough();
    component.colorData.top10RecentColors.push('#000000');
    component.addPrimarycolor();
    expect(spy).toHaveBeenCalled();
    expect(component.colorData.primaryColor).toEqual('#FFFF00');
  });
  it('should execute displayRecentColors', () => {
    component.colorData.top10RecentColors = [];
    const spy = spyOn(component['renderer'], 'setStyle').and.callThrough();
    component.colorData.top10RecentColors.push('#000000');
    component.displayRecentColors();
    expect(spy).toHaveBeenCalled();
  });

  it('#afterViewInit should call displayRecentColors, draw, addPrimarycolor and addSecondaryColor', () => {
    spyOn(component, 'displayRecentColors');
    spyOn(component, 'draw');
    spyOn(component, 'addPrimarycolor');
    spyOn(component, 'addSecondaryColor');
    component.ngAfterViewInit();
    expect(component.displayRecentColors).toHaveBeenCalled();
    expect(component.draw).toHaveBeenCalled();
    expect(component.addPrimarycolor).toHaveBeenCalled();
    expect(component.addSecondaryColor).toHaveBeenCalled();
    });

  it('#savingColor should go in condition if containsColor returns -1', () => {
    component.colorData.top10RecentColors = [
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black'];
    component.rgbaColor = 'white';
    spyOn(component, 'containsColor').and.returnValue(-1);
    component.savingColor();
    const expectedResult = [
      'white',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black'];
    expect(component.colorData.top10RecentColors).toEqual(expectedResult);
  });

  it('#savingColor should do nothing if containsColor returns > 0', () => {

    component.colorData.top10RecentColors = [
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black'];
    component.colorData.hexColor = 'white';
    spyOn(component, 'containsColor').and.returnValue(3);
    component.savingColor();
    const expectedResult: string[] = [
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black'];
    expect(component.colorData.top10RecentColors).toEqual(expectedResult);
  });
  it('#colorIsSaved should change primary color', () => {
    component.colorData.top10RecentColors = [];
    spyOn(component, 'savingColor');
    component.colorData.primaryColor = 'red';
    component.colorData.top10RecentColors[0] = 'black';
    component.colorIsSaved();
    const expectedResult = 'black';
    expect(component.colorData.primaryColor).toEqual(expectedResult);
    expect(component.savingColor).toHaveBeenCalled();
  });

  it('#backgroundIsSaved should change background color', () => {

    component.colorData.top10RecentColors = [];
    spyOn(component, 'savingColor');
    component.colorData.backgroundColor = 'red';
    component.colorData.top10RecentColors[0] = 'black';
    component.backgroundIsSaved();
    const expectedResult = 'black';
    expect(component.colorData.backgroundColor).toEqual(expectedResult);
    expect(component.savingColor).toHaveBeenCalled();
  });

  it('#containsColor should return -1 if color is not already in the table', () => {
    component.colorData.top10RecentColors = [
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black'];
    spyOn<any>(component['colorData'], 'top10RecentColors').and.callFake(() => {
      return -1;
    });
    component.containsColor();
    expect(component['colorData'].top10RecentColors).not.toHaveBeenCalled();
  });
  it('#containsColor should return index if color is in the table', () => {
    component.colorData.top10RecentColors = [];
    spyOn<any>(component['colorData'], 'top10RecentColors').and.callThrough();
    const index = 3;
    component.colorData.top10RecentColors = [
      'black',
      'black',
      'black',
      'red',
      'black',
      'black',
      'black',
      'black',
      'black',
      'black'];
    component.rgbaColor = 'red';
    const result = component.containsColor();
    expect(result).toEqual(index);
  });
  it('#swapColors should call swapingColors in color service', () => {
    spyOn<any>(component['colorData'], 'swapingColors');
    component.swapColors();
    expect(component['colorData'].swapingColors).toHaveBeenCalled();
  });
  it('#hexToRgb should return the string of the rbg color that has been converted', () => {
    const unHex = '#000000';
    component.color = component.hexToRgb(unHex);
    expect(component.color).toBe('rgb(0, 0, 0)');
  });
  it('#hexToRgb should return empty string if rbg color not converted', () => {
    const unHex = '';
    component.color = component.hexToRgb(unHex);
    expect(component.color).toEqual('');
  });
  it("#addAlpha should change my rgb's opacity", () => {
    component.newHex = '#000000';
    component.addAlpha(100);
    expect(component.colorData.primaryColor).toEqual('#000000FF');
  });

  it('#emitColor should emit color', () => {
    const spy2 = spyOn<any>(component, 'getMousePositionColorHEX').and.callThrough();
    const spy3 = spyOn<any>(component.colorPicked, 'emit').and.callThrough();
    component.newHex = '#000000';
    component.emitColor(10, 10);
    expect(spy2).toHaveBeenCalledWith(10, 10);
    expect(spy3).toHaveBeenCalled();
  });

  it('#draw should draw canvas', () => {
    component.canvasContext = null;
    component.draw();
    expect().nothing();
  });

  it('#onMouseUp should follow mouse action when not clicked', () => {
    component.onMouseUp();
    expect(component['mouseDown']).toEqual(false);
  });

  it('#onMouseDown should take the mouse position when clicked', () => {
    const event = new MouseEvent('mousemove', {
      clientX : 100,
      clientY : 100
    });
    const spy = spyOn<any>(component, 'draw').and.callThrough();
    const spy2 = spyOn<any>(component, 'emitColor').and.callThrough();
    component.onMouseDown(event);
    expect(component.mousePosition).toEqual({x: 100, y: 100});
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(100, 100);
    expect(component['mouseDown']).toEqual(true);
  });

  it('#onMouseMove should track the mouse position', () => {

    const event = new MouseEvent('mousemove', {
      clientX : 100,
      clientY : 100
    });
    component['mouseDown'] = true;
    const spy = spyOn<any>(component, 'draw').and.callThrough();
    const spy2 = spyOn<any>(component, 'emitColor').and.callThrough();
    component.onMouseMove(event);
    expect(component.mousePosition).toEqual({x: 100, y: 100});
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(100, 100);
  });

  it('#onMouseMove should not track the mouse position', () => {
    const event = new MouseEvent('mousemove', {
      clientX : 100,
      clientY : 100
    });
    component['mouseDown'] = false;
    component.onMouseMove(event);
    expect().nothing();
  });

  it('#getMousePositionColorHEX should return an empty string if null', () => {
    component.canvasContext = null;
    expect(component.getMousePositionColorHEX(0, 0)).toEqual('');
    });

  it('#getMousePositionColorHEX should return hex color of mouse position', () => {
    const spy = spyOn<any>(component.canvasContext, 'getImageData').and.callThrough();
    component.newHex = '#180010';
    component.getMousePositionColorHEX(10, 10);
    expect(spy).toHaveBeenCalledWith(10, 10, 1, 1);
  });

});
