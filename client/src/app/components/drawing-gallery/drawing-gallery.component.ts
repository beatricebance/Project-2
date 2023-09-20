import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient} from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import { Drawingdata } from '../../../../../server/app/controllers/drawingdata';
import * as CONSTANTS from '../../constants/constants';
import {FilterDrawingService } from '../../services/filter/filter-drawing.service';
import {RedirectPageService} from '../../services/redirect/redirect-page.service';
import {TransformsourceService} from '../../services/transformsource/transformsource.service';
@Component({
  selector: 'app-drawing-gallery',
  templateUrl: './drawing-gallery.component.html',
  styleUrls: ['./drawing-gallery.component.scss']
})
export class DrawingGalleryComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;
  tabledrawingdata: Drawingdata[][] = [];
  drawingdata: Drawingdata[];
  allTags: string[] = [];
  object: ObjectConstructor;
  removable: boolean;
  visible: boolean;
  selectable: boolean;
  addOnBlur: boolean;
  tagCtrl: FormControl;
  needresponse: boolean;

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private httpClient: HttpClient,
              protected viewDrawingParameter: NewDrawingDataService,
              protected filterservice: FilterDrawingService ,
              protected safe: TransformsourceService,
              protected redirect: RedirectPageService,

  ) {
    this.tagCtrl = new FormControl();
    this.needresponse = false;
    this.removable = true;
    this.selectable = true;
    this.addOnBlur = true;
    this.visible = true;
    this.object = Object;
    this.drawingdata = [];
    this.initView();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0);

  }

  setTag(): void {
    // tslint:disable:prefer-for-of  car of ne peut etre utiliser comme number
    for (let i = 0; i < this.drawingdata.length; i++) {
      for (let tagindex = 0; tagindex < this.drawingdata[i].tag.length; tagindex++) {
        this.allTags.push(this.drawingdata[i].tag[tagindex]);
      }
    }
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map(( tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
    }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || CONSTANTS.EMPTY_STRING).trim()) {
        this.filterservice.selectedTag.push(value.trim());
      }
      if (input) {
        input.value = CONSTANTS.EMPTY_STRING;
      }

      this.tagCtrl.setValue(null);
    }
  }

  remove(tag: string): void {
    const index = this.filterservice.selectedTag.indexOf(tag);

    if (index >= 0) {
      this.filterservice.selectedTag.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filterservice.selectedTag.push(event.option.viewValue);
    this.tagInput.nativeElement.value = CONSTANTS.EMPTY_STRING;
    this.tagCtrl.setValue(null);
  }

  initView(): void {
    const url = 'http://localhost:3000/api/database/DRAWING';
    this.httpClient.get(url, {

    })
      .toPromise()
      .then((dbDrawing: Drawingdata[]) => {
        this.drawingdata = dbDrawing;
        this.tabledrawingdata.push(this.drawingdata);
        this.setTag();
      })
      .catch((e: Error) => { throw e; })
      ;
  }

 async delete(): Promise<void> {
    this.turnOnResponse();
    await this.filterservice.searchDrawing();
    for (const id of this.filterservice.selectedTagId) {
    this.filterservice.deleteDrawingById(id);
  }
    this.tabledrawingdata = [];
    this.allTags = [];
    this.initView();
  }

   search(): void {
    this.turnOnResponse();
    this.allTags = [];
    this.tabledrawingdata = [];
    if (this.filterservice.selectedTag.length > 0) {
       this.filterservice.searchDrawing();
       this.tabledrawingdata = this.filterservice.table;

    } else {
      this.tabledrawingdata = [];
      this.initView();
    }
    this.filterservice.selectedTag = [];
    this.setTag();
  }

  turnOnResponse(): void {
    this.filterservice.response = CONSTANTS.EMPTY_STRING;
    this.needresponse = true;
  }
}
