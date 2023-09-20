import { Component, HostListener} from '@angular/core';
import { OpenDialogService } from 'src/app/services/open-dialog/open-dialog.service';
import {keyBoardEvents} from '../../constants/enum';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {
  isOpen: boolean;
  event: KeyboardEvent;
  constructor(protected openDialogService: OpenDialogService ) {
   }

  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && (event.key === keyBoardEvents.EVENT_KEY_O)) {

      if (!this.isOpen) {
        this.openDialogService.verifyDialogOpen();
      }
    }
    if (event.key && !event.ctrlKey) {
      return;
    }
    event.preventDefault();
  }

}
