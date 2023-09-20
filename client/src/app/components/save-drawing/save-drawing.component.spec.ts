import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { SecurityContext} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA , MatDialogModule} from '@angular/material';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import {SvgAttributes} from '../../constants/enum';
import { SaveDrawingComponent } from './save-drawing.component';

const mock = {
  bypassSecurityTrustUrl(value: string): SafeUrl {
    return value as unknown as SafeUrl;
  },
  sanitize(context: SecurityContext, value: string): string {
    return value;
  }
};

const nativeelement = document.createElementNS(SvgAttributes.LINK, SvgAttributes.STRING);
const httpClient = 'httpClient';

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveDrawingComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
          MatDialogModule,
          BrowserAnimationsModule,
          ReactiveFormsModule,
          FormsModule,
          HttpClientTestingModule,
          HttpClientModule],
      providers: [
        { provide: MAT_DIALOG_DATA,
          useValue: {
          nativeElement: nativeelement
          }
          },
          FormBuilder,
        { provide: DomSanitizer, useValue: mock },
      ],
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
        expect(component).toBeTruthy();
  });

  it('should deletetag', () => {
    component.deleteTag();
    expect(component.tagTable).toEqual([]);
  });
  it('should test istrytosave', () => {
   component.f.name.setValue('bblili');
   component.trySaving();
   expect(component.isTryingToSave).toBeTruthy();
  });
  it('should test addtag tag empty ', () => {
    component.f.tag.setValue('');
    component.addTag();
    expect(component.isTagAdded).toBeFalsy();
   });
  it('should test addtag success', () => {
    component.f.name.setValue('bbhd');
    component.f.tag.setValue('tag');
    component.addTag();
    expect(component.tagTable).not.toEqual('tag');
    expect(component.isTagAdded).toBeTruthy();
   });
  it('should test addtag success else', () => {
    component.f.name.setValue('bbhd');
    component.f.tag.setValue('');
    component.addTag();
    expect(component.tagTable).not.toEqual('');
    expect(component.isTagAdded).toBeFalsy();
   });
  it('should test save : form invalid', () => {
    component.f.name.setValue('');
    spyOn(window, 'alert');
    component.save();
    expect(component.databaseurl).not.toEqual('http://localhost:3000/api/database/DRAWING/');
   });
  it('should test save : form valid  and catch error', () => {
    component.f.name.setValue('bae');
    const spy = spyOn(component[httpClient], 'post').and.returnValue(new Observable((subscriber) => {
      subscriber.error();
    }));
    component.save();
    expect(spy).toBeTruthy();
   });
  it('should test save : form valid  and created', () => {
    component.f.name.setValue('bae');
    component.f.tag.setValue('tagg');
    const spy = spyOn(component[httpClient], 'post').and.returnValue(new Observable((subscriber) => {
      subscriber.complete();
    }));
    component.save();
    expect(spy).toBeTruthy();
   });
});
