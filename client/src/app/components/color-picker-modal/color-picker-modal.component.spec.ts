import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingCommunService } from 'src/app/services/drawing-commun/drawing-commun.service';
import { ColorPickerModalComponent } from './color-picker-modal.component';
const mockRef = {
  close(): void {
    return;
  }
};
describe('ColorpickerModalComponent', () => {
  let component: ColorPickerModalComponent;
  let fixture: ComponentFixture<ColorPickerModalComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerModalComponent ],
      providers: [DrawingCommunService, MatDialog, { provide: MatDialogRef, useValue: mockRef }],
      imports: [MatDialogModule ,
          BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should opendialogs', () => {
    const dialog = 'dialog';
    const openDialogSpy = spyOn(component[dialog], 'open');
    component.openDialogs();
    expect(openDialogSpy).toHaveBeenCalled();
  });
});
