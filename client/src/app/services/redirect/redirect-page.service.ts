import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CONSTANTS from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class RedirectPageService {

  constructor(private router: Router) { }
  refresh(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(this.navigateHander);
  }
   navigateHander: () => void = () => {
    this.router.navigate([CONSTANTS.DRAWING_VIEW_PAGE]);
  }
}
