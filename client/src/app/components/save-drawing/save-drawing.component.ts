import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import * as CONSTANTS from '../../constants/constants';

@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.scss']
})
export class SaveDrawingComponent {
  savingForm: FormGroup;
  drawingName: string;
  tag: string;
  tagTable: string[];
  isTryingToSave: boolean;
  oSerializer: XMLSerializer = new XMLSerializer();
  source: string;
  safeUrl: SafeUrl;
  svgxmlreturn: string;
  isTagAdded: boolean;
  url: string;
  databaseurl: string;
  urlToSave: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ElementRef,
              protected sanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              protected saveService: SaveDrawingService,
              protected drawingPile: UndoRedoService,
              protected viewDrawingParameter: NewDrawingDataService,

  ) {
    this.transformUrl();
    this.isTryingToSave = false;
    this.tagTable = [];
    this.savingForm = this.createForm();
    this.isTagAdded = false;
    this.url = CONSTANTS.EMPTY_STRING;
    this.databaseurl = CONSTANTS.EMPTY_STRING;

  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        name: [
          this.drawingName = CONSTANTS.EMPTY_STRING,
          Validators.compose([
            Validators.required])
        ],
        tag: [
          this.tag = CONSTANTS.EMPTY_STRING,
          Validators.compose([
            Validators.maxLength(CONSTANTS.DIALOGSAVE_VALIDATOR_MAX)
          ])
        ],
      },
    );
  }

  get f(): FormGroup['controls'] { return this.savingForm.controls; }

  addTag(): void {
    this.tag = this.f.tag.value;
    if (this.savingForm.valid) {
      if (this.tag !== CONSTANTS.EMPTY_STRING) {
        this.tagTable.push(this.tag);
        this.isTagAdded = true;
      } else { alert('TAG VIDE. Veuillez en créer ou choisir Pour en ajouter'); }
    } else { alert('Formulaire invalide veuillez corriger les zone rouge'); }

  }

  deleteTag(): void {
    this.tagTable = [];
  }

  transformUrl(): SafeUrl {
    this.source = this.oSerializer.serializeToString(this.data.nativeElement);
    this.source = CONSTANTS.EXPORT_SVG_SOURCE + this.source;
    this.url = CONSTANTS.EXPORT_SVG_URI + encodeURIComponent(this.source);
    this.urlToSave = this.url;
    return this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(this.url);
  }

  trySaving(): void {
    this.isTryingToSave = true;
  }
  save(): void {
    this.drawingName = this.f.name.value;
    if (this.savingForm.valid) {
      this.databaseurl = 'http://localhost:3000/api/database/DRAWING/';
      const body = {
        tag: this.tagTable,
        name: this.drawingName,
        svgxml: this.urlToSave,
        drawingPile: this.drawingPile.undoPile,
        svgHeight: this.viewDrawingParameter.svgHeight,
        svgWidth: this.viewDrawingParameter.svgWidth,
        svgColorHexa: this.viewDrawingParameter.svgColorHexa,
      };
      this.httpClient.post(this.databaseurl, body, {
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Access-Control-Allow-Origin', '*')
          .set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'),
        responseType: 'text'
      })
        .toPromise()
        .then((result) => { alert(result); })
        .catch((e: Error) => { throw e; })
        ;
    } else { alert('formulaire invalide'); }
  }
}
