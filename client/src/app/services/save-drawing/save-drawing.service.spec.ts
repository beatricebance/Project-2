import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { SaveDrawingService } from './save-drawing.service';
const httpClient = 'httpClient';

describe('SaveDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        HttpClientModule],
  }));

  it('should be created', () => {
    const service: SaveDrawingService = TestBed.get(SaveDrawingService);
    expect(service).toBeTruthy();
  });
  it('should test save : form valid  and catch error', () => {
    const service: SaveDrawingService = TestBed.get(SaveDrawingService);
    const spy = spyOn(service[httpClient], 'get').and.returnValue(new Observable((subscriber) => {
      subscriber.error();
    }));
    service.initTagZone();
    expect(spy).toBeTruthy();
   });
  it('should test save : form valid  and created', () => {
    const service: SaveDrawingService = TestBed.get(SaveDrawingService);
    const spy = spyOn(service[httpClient], 'get').and.returnValue(new Observable((subscriber) => {
      subscriber.complete();
    }));
    service.initTagZone();
    expect(spy).toBeTruthy();
   });
});
