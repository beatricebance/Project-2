import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ColorDataService } from 'src/app/services/color-data/color-data.service';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import * as CONSTANTS from '../../constants/constants';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'app-create-new-drawing',
  templateUrl: './create-new-drawing.component.html',
  styleUrls: ['./create-new-drawing.component.scss']
})
export class CreateNewDrawingComponent {

  drawingForm: FormGroup;
  height: number;
  width: number;
  colorHexa: string;
  shouldResize: boolean;

  constructor(protected viewDrawingParameter: NewDrawingDataService,
              private formBuilder: FormBuilder,
              public router: Router,
              public dialogRef: MatDialogRef<CreateNewDrawingComponent>,
              public dialog: MatDialog,
              public colorData: ColorDataService,
  ) {
    this.shouldResize = false;
    this.drawingForm = this.createForm();
  }
  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        height: [
          this.height = window.innerHeight,
          Validators.compose([
            Validators.max(CONSTANTS.DIALOG_VALIDATOR_MAX),
            Validators.min(CONSTANTS.DIALOG_VALIDATOR_MIN),
            Validators.required])
        ],
        width: [
          this.width = window.innerWidth,
          Validators.compose([
            Validators.max(CONSTANTS.DIALOG_VALIDATOR_MAX),
            Validators.min(CONSTANTS.DIALOG_VALIDATOR_MIN),
            Validators.required])
        ],
        colorHexa: [
          this.colorHexa = CONSTANTS.DIALOG_DEFAULT_COLORHEXA,
          Validators.compose([
            Validators.maxLength(CONSTANTS.DIALOG_VALIDATOR_MAXLENGHT),
            Validators.minLength(CONSTANTS.DIALOG_VALIDATOR_MINLENGHT),
            Validators.pattern('^#[a-fA-F0-9]+$'),
            Validators.required])
        ],
      },
    );
  }

  get f(): FormGroup['controls'] { return this.drawingForm.controls; }

  verifyDrawing(): void {
    if (!this.viewDrawingParameter.isSpaceCreated) {
      this.send();
    }

  }

  send(): void {
    if (!this.drawingForm.invalid) {
        this.dialogRef.close();
        this.validateForm();
        this.viewDrawingParameter.isAutoSave = false;
        this.viewDrawingParameter.svgColorHexa = this.f.colorHexa.value;
        this.viewDrawingParameter.svgWidth = this.f.width.value - CONSTANTS.SIDENAVBAR_SIZE;
        this.viewDrawingParameter.svgHeight = this.f.height.value - CONSTANTS.MARGIN;
    }
  }

  navigateHander: () => void = () => {
    this.router.navigate([CONSTANTS.DRAWING_VIEW_PAGE]);
  }

  validateForm(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(this.navigateHander);

  }

  @HostListener('window:resize', ['$event'])
  resize(): void {
    if (!this.shouldResize) {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    }
  }
  collectData(): void {
    this.shouldResize = true;
  }

  openColorDialog(): void {
    const dialogRef = this.dialog.open(ColorPickerComponent, {
      width: CONSTANTS.COLOR_DIALOG_WIDTH,
      height: CONSTANTS.COLOR_DIALOG_HEIGHT,
      position: { right: CONSTANTS.COLOR_DIALOG_RIGHT, top: CONSTANTS.COLOR_DIALOG_TOP },
    });
    dialogRef.afterClosed()
    .subscribe((result) => {
    this.drawingForm.controls[CONSTANTS.SVGNAMECOLORHEXA].setValue(this.colorData.hexColor);
    });

  }

}
