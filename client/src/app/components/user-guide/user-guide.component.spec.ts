import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule, MatIconModule, MatIconRegistry, MatSidenavModule } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserGuideComponent } from './user-guide.component';

const mock = {
  bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl {
    return value as unknown as SafeResourceUrl;
  },
  sanitize(context: SecurityContext, value: string): SafeResourceUrl {
    return value;
  }
};

describe('UserGuideComponent', () => {
  let component: UserGuideComponent;
  let fixture: ComponentFixture<UserGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGuideComponent ],
      providers:  [MatIconRegistry, { provide: DomSanitizer, useValue: mock}],
      imports: [MatIconModule, MatDividerModule, MatSidenavModule, BrowserAnimationsModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute on init', () => {
    component.ngOnInit();
    expect(component.index).toEqual(0);
  });

  it('should execute updatePrevious', () => {
    const index = 10;
    const previousIndex = 9;
    component.index = index;
    component.updatePrevious();
    expect(component.isToolHidden).toEqual(true);
    expect(component.isShapeHidden).toEqual(true);
    expect(component.index).toEqual(previousIndex);
  });
  it('should execute  updateNext', () => {
    const index = 10;
    const nextIndex = 11;
    component.index = index;
    component.updateNext();
    expect(component.isToolHidden).toEqual(true);
    expect(component.isShapeHidden).toEqual(true);
    expect(component.index).toEqual(nextIndex);
  });
  it('should execute  updateNext(indice)', () => {
    const indicetest = 1 ;
    component.updateIndex(indicetest);
    expect(component.index).toEqual(indicetest);
  });
  it('should execute  previous()', () => {
    spyOn(component, 'previous').and.callThrough();
    component.previous();
    expect(component.previous).toHaveBeenCalled();
  });
});
