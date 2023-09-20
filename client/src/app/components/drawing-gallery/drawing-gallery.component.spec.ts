import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { DrawingGalleryComponent } from './drawing-gallery.component';

 // tslint:disable: no-string-literal

describe('DrawingGalleryComponent', () => {
  let component: DrawingGalleryComponent;
  let fixture: ComponentFixture<DrawingGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingGalleryComponent ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpClientModule, MatAutocompleteModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const httpClient = 'httpClient';
  const filterservice = 'filterservice';

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should _filter', () => {
    const value = 'Maman';
    component.allTags = ['Maman', 'Halima'];
    component['_filter'](value);
    expect(component.allTags.length).not.toEqual(0);

  });
  it('should setTag', () => {
  component.allTags = ['beatrice', 'bance'];
  const spy1 = spyOn(component, 'setTag').and.callThrough();
  component.setTag();
  // expect().nothing();
  expect(spy1).toHaveBeenCalled();

  });
  it('should turnonResponse', () => {
  spyOn(component, 'turnOnResponse').and.callThrough();
  component.turnOnResponse();
  expect(component.turnOnResponse).toHaveBeenCalled();
  expect(component.needresponse).toBeTruthy();
  });
  it('should test initview : catch error', () => {
    const spy = spyOn(component[httpClient], 'get').and.returnValue(new Observable((subscriber) => {
      subscriber.error();
    }));
    component.initView();
    expect(spy).toBeTruthy();
   });
  it('should test delete', () => {
    const spy = spyOn(component, 'delete').and.callThrough();
    const spy1 = spyOn(component, 'turnOnResponse');
    const spy2 = spyOn(component[filterservice] , 'searchDrawing');
    component.delete();
    const TIME_OUT = 500;
    setTimeout(() => {
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    }, TIME_OUT);

   });
  it('should test search : lenght> 0', () => {
    const spy1 =  spyOn(component, 'search').and.callThrough();
    const spy2 =   spyOn(component, 'turnOnResponse');
    const spy3 =  spyOn(component['filterservice'], 'searchDrawing');
    const spy4 = spyOn(component, 'setTag');
    component['filterservice'].selectedTag = ['otre', 't'];
    component.search();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(component.tabledrawingdata).toEqual(component['filterservice'].table);
    expect(component['filterservice'].selectedTag).toEqual([]);
    });

  it('should test search : else path', () => {
      const spy1 =  spyOn(component, 'search').and.callThrough();
      const spy2 =   spyOn(component, 'turnOnResponse');
      const spy3 =  spyOn(component, 'initView');
      const spy4 = spyOn(component, 'setTag');
      component.search();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
      expect(component.tabledrawingdata).toEqual(component['filterservice'].table);
      });
});
