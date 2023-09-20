import { TestBed } from '@angular/core/testing';

import { NewDrawingDataService } from './new-drawing-data.service';

describe('NewDrawingDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewDrawingDataService = TestBed.get(NewDrawingDataService);
    expect(service).toBeTruthy();
  });
});
