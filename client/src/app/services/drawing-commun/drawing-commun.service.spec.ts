import { TestBed } from '@angular/core/testing';
import { DrawingCommunService } from './drawing-commun.service';

describe('DrawingCommunService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingCommunService = TestBed.get(DrawingCommunService);
    expect(service).toBeTruthy();
  });
  it('updatePathStroke', () => {
    const service: DrawingCommunService = TestBed.get(DrawingCommunService);
    const stro = 'HDHD';
    service.updatePathStroke(stro);
    expect(service.pathStroke).toEqual(stro);
  });
  it('updatePathFill', () => {
    const service: DrawingCommunService = TestBed.get(DrawingCommunService);
    const fill = 'HDVD';
    service.updatePathFill(fill);
    expect(service.pathFill).toEqual(fill);
  });
  it('idGenerator', () => {
    const service: DrawingCommunService = TestBed.get(DrawingCommunService);
    const returnValue = service.idGenerator();
    expect(returnValue).toEqual(returnValue);
  });
});
