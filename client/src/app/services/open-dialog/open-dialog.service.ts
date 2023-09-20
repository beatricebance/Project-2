import { Injectable} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ColorDataService } from 'src/app/services/color-data/color-data.service';
import { CreateNewDrawingComponent } from '../../components/create-new-drawing/create-new-drawing.component';
import * as CONSTANTS from '../../constants/constants';
import { NewDrawingDataService } from '../new-drawing-data/new-drawing-data.service';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {
  isOpen: boolean;
  isDialogOpen: boolean;
  result: boolean;
  constructor(private dialogRef: MatDialogRef<CreateNewDrawingComponent>,
              public dialog: MatDialog, public colorData: ColorDataService,
              protected viewDrawingParameter: NewDrawingDataService) {
    this.isOpen = false;
    this.isDialogOpen = false;
    this.result = false; }

  openDialog(): void {
    this.colorData.hexColor = CONSTANTS.DIALOG_DEFAULT_COLORHEXA;
    this.viewDrawingParameter.wantToCreateSpace ++;
    if ( this.viewDrawingParameter.wantToCreateSpace > 1) {
      this.viewDrawingParameter.isSpaceCreated = true;
    }
    this.isOpen = true;
    this.dialogRef = this.dialog.open(CreateNewDrawingComponent, {
      width: CONSTANTS.DIALOG_WIDTH,
      disableClose: true
    });
    this.dialogRef.afterClosed()
    .subscribe(() => {
        this.tobeFalse();
    });
  }
    verifyDialogOpen(): void {
    if (!this.isOpen) {
      this.openDialog();
    }
  }

 tobeFalse(): void {
  this.isOpen = false;
  this.isDialogOpen = false;
 }

}
