import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectId } from 'mongodb';
import { Drawingdata } from '../../../../../server/app/controllers/drawingdata';
import * as CONSTANTS from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class FilterDrawingService {
  table: Drawingdata[][] = [];
  selectedTag: string[] = [];
  selectedTagId: ObjectId [] = [];
  response: string;

constructor(private httpClient: HttpClient,
  ) {
  this.response = CONSTANTS.EMPTY_STRING;

}

  idToDelete(dbDrawing: Drawingdata[]): void {
    this.selectedTagId = [];
    for (const i of dbDrawing) {
      this.selectedTagId.push(i._id);
    }
  }

  async searchDrawing(): Promise<void> {
    this.table = [];
    for (const tag of this.selectedTag) {
      const url = 'http://localhost:3000/api/database/DRAWING/' + tag;
      await this.httpClient.get(url, {
         headers: new HttpHeaders()
           .set('Accept', 'application/json')
           .set('Access-Control-Allow-Origin', '*')
           .set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'),
         responseType: 'json'
       })
         .toPromise()
         .then((dbDrawing: Drawingdata[]) => {
           this.table.push(dbDrawing);
           this.idToDelete(dbDrawing);
           this.response = 'Recherche terminée';
         })
         .catch((e: Error) => {
         this.response = 'Recherche terminée aucune image ne correspond';
         })
         ;
     }
  }

  deleteDrawingById(selectedTagId: ObjectId): void {
    const url = 'http://localhost:3000/api/database/DRAWING?' + selectedTagId;
    this.httpClient.delete(url
    )
      .toPromise()
      .then(() => {
        this.response = ' Dessin supprimer';
      })
      .catch((e: Error) => { this.response = 'Impossible de supprimer le Dessin'; })
      ;
  }
}
