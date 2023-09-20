import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { NewDrawingDataService } from 'src/app/services/new-drawing-data/new-drawing-data.service';
import { WelcomePageComponent } from './welcome-page.component';

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
const openDialogService = 'openDialogService';
describe('WelcomePageComponent', () => {
  let component: WelcomePageComponent;
  let fixture: ComponentFixture<WelcomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomePageComponent ],
      providers: [NewDrawingDataService, { provide: MatDialogRef, useClass: MockRef }],
      imports: [MatDialogModule ,
          BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('event should be active', () => {
    const key1 = new KeyboardEvent('Keydown' , {key: 'o', ctrlKey: true });
    component.isOpen = false;
    const spy = spyOn(component[openDialogService], 'verifyDialogOpen');
    component.keyEvent(key1);
    expect(spy).toHaveBeenCalled();
  });

  it('event should return something if key pressed', () => {
    const key1 = new KeyboardEvent('Keydown' , {key: 'o', ctrlKey: false });
    const spy = spyOn(component[openDialogService], 'verifyDialogOpen');
    component.keyEvent(key1);
    expect(spy).not.toHaveBeenCalled();

  });

  it('dialog already open', () => {
    const key1 = new KeyboardEvent('Keydown' , {key: 'o', ctrlKey: true });
    component.isOpen = true;
    const spy = spyOn(component[openDialogService], 'verifyDialogOpen');
    component.keyEvent(key1);
    expect(spy).not.toHaveBeenCalled();
  });

});
