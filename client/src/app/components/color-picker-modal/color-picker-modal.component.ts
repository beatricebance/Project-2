import { Component} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ColorDataService } from 'src/app/services/color-data/color-data.service';
import * as CONSTANTS from '../../constants/constants';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'app-color-picker-modal',
  templateUrl: './color-picker-modal.component.html',
  styleUrls: ['./color-picker-modal.component.scss']
})
export class ColorPickerModalComponent  {

  constructor(public dialog: MatDialog,
              protected colorData: ColorDataService) {
      this.colorData.primaryColor = '#FFFF00';
      this.colorData.secondaryColor = '#000000';
      this.colorData.backgroundColor = '#FFFFFF';
     }

     openDialogs(): void {
      this.dialog.open(ColorPickerComponent, {
        width: CONSTANTS.COLOR_DIALOG_WIDTH,
        height: CONSTANTS.COLOR_DIALOG_HEIGHT,
        position: {right: CONSTANTS.COLOR_DIALOG_RIGHT, top: CONSTANTS.COLOR_DIALOG_TOP},
        panelClass: 'custom-dialog-container',
      });
    }

}
