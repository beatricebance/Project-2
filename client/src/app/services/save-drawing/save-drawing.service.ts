import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService {
  usedTag: string[];

  constructor(private httpClient: HttpClient) {
    this.initTagZone();
  }
  initTagZone(): void {
    const url = 'http://localhost:3000/api/database/DRAWING/tag';
    this.httpClient.get(url, {
      headers: new HttpHeaders()
      .set('Content-Type' ,  'application/json')
       .set('Authorization',  'my-auth-token')
    })
      .toPromise()
      .then((tagFromDb: string[]) => { this.usedTag = tagFromDb; })
      .catch((e: Error) => { throw e; })
      ;
  }

}
