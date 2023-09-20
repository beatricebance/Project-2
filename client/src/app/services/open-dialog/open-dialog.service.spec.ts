import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, EMPTY} from 'rxjs';
import { CreateNewDrawingComponent } from '../../components/create-new-drawing/create-new-drawing.component';
import { OpenDialogService } from './open-dialog.service';
// tslint:disable:no-any
class MockRef  {
  test: BehaviorSubject<any> = new BehaviorSubject(1);
  close(): boolean {
    this.test.next(2);
    return true;
  }
  afterClosed(): BehaviorSubject<any> {
    return this.test;
  }
}

const viewDrawingParameter = 'viewDrawingParameter';
const dialogRef = 'dialogRef';
describe('OpenDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [CreateNewDrawingComponent],
    providers: [
      { provide: MatDialogRef, useClass: MockRef },

    ],
    imports: [MatDialogModule, BrowserAnimationsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  }));

  it('should be created', () => {
    const service: OpenDialogService = TestBed.get(OpenDialogService);
    expect(service).toBeTruthy();
  });

  it('should opendialog', () => {
    const service: OpenDialogService = TestBed.get(OpenDialogService);
    const openDialogSpy = spyOn(service.dialog, 'open')
      .and
      .returnValue({ afterClosed: () => EMPTY } as any);
    service.openDialog();
    expect(service[viewDrawingParameter].isSpaceCreated).toBeFalsy();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(service.isOpen).toBeTruthy();

  });
  it('isspacecreate should be true ', () => {
    const service: OpenDialogService = TestBed.get(OpenDialogService);
    const openDialogSpy = spyOn(service.dialog, 'open')
      .and
      .returnValue({ afterClosed: () => EMPTY } as any);
    service[viewDrawingParameter].wantToCreateSpace = 1;
    service.openDialog();
    expect(service[viewDrawingParameter].isSpaceCreated).toBeTruthy();
    expect(openDialogSpy).toHaveBeenCalled();
  });

  it('should verifyDialogopen opendialog not called ', () => {
    const service: OpenDialogService = TestBed.get(OpenDialogService);
    service.isOpen = true;
    const spyopendialog = spyOn(service, 'openDialog');
    service.verifyDialogOpen();
    expect(spyopendialog).not.toHaveBeenCalled();
  });
  it('should verifyDialogopen opendialog call ', () => {
    const service: OpenDialogService = TestBed.get(OpenDialogService);
    const spy = spyOn(service, 'verifyDialogOpen').and.callThrough();
    const spyopendialog = spyOn(service, 'openDialog');
    service.isOpen = false;
    service.verifyDialogOpen();
    expect(spy).toHaveBeenCalled();
    expect(spyopendialog).toHaveBeenCalled();
  });

  it('should call tobefalse ', () => {
    const service: OpenDialogService = TestBed.get(OpenDialogService);
    const spy1 = spyOn(service, 'tobeFalse').and.callThrough();
    service.isOpen = false;
    service.isDialogOpen = false;
    service.tobeFalse();
    expect(spy1).toHaveBeenCalled();
    expect(service.isOpen).toBeFalsy();
    expect(service.isDialogOpen).toBeFalsy();
  });
  it('should test afterclose', () => {
    const service: OpenDialogService = TestBed.get(OpenDialogService);

    const spy1 = spyOn(service, 'tobeFalse').and.callThrough();
    const test: BehaviorSubject<any> = new BehaviorSubject(1);

    spyOn(service.dialog, 'open')
    .and
    .returnValue( {
      close(): boolean {
        test.next(2);
        return true;
      },
      afterClosed(): BehaviorSubject<any> {
        return test;
      }
    } as any);

    service.openDialog();
    service[dialogRef].close();
    expect(spy1).toHaveBeenCalled();
  });

});
