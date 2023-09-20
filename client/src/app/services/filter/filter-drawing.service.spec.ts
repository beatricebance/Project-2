import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FilterDrawingService } from './filter-drawing.service';

describe('FilterDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([]), HttpClientModule]
  }));

  const httpClient = 'httpClient';

  it('should be created', () => {
    const service: FilterDrawingService = TestBed.get(FilterDrawingService);
    expect(service).toBeTruthy();
  });
  it('should test searchDrawing : ok', () => {
    const service: FilterDrawingService = TestBed.get(FilterDrawingService);
    service.selectedTag = ['otre', 't'];
    const spy = spyOn(service[httpClient], 'get').and.returnValue(new Observable((subscriber) => {
      subscriber.complete();
    }));
    service.searchDrawing();
    expect(spy).toBeTruthy();
    expect(service.table.length).toEqual(0);
    expect(service.idToDelete.length).toEqual(1);
    expect(service.response).toEqual('');
   });
  it('should test searchDrawing  : catch error', () => {
    const service: FilterDrawingService = TestBed.get(FilterDrawingService);
    const spy = spyOn(service[httpClient], 'get').and.returnValue(new Observable((subscriber) => {
      subscriber.error();
    }));
    service.searchDrawing();
    expect(spy).toBeTruthy();
   });
});
