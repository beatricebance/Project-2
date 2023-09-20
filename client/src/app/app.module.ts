import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
        MatAutocompleteModule,
        MatButtonModule,
        MatChipsModule,
        MatDialogModule,
        MatDialogRef,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
} from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule} from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './components/app/app.component';
import { ColorPickerModalComponent } from './components/color-picker-modal/color-picker-modal.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { CreateNewDrawingComponent } from './components/create-new-drawing/create-new-drawing.component';
import { DrawingGalleryComponent } from './components/drawing-gallery/drawing-gallery.component';
import { DrawingViewComponent } from './components/drawing-view/drawing-view.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';

class MockRef  {
        // tslint:disable:no-any
        test: BehaviorSubject<any> = new BehaviorSubject(1);
        close(): boolean {
          this.test.next(2);
          return true;
        }
        afterClosed(): BehaviorSubject<any> {
          return this.test;
        }
      }
// tslint:disable-next-line:max-classes-per-file
@NgModule({
    declarations: [AppComponent,
         WelcomePageComponent,
         CreateNewDrawingComponent,
         DrawingViewComponent,
         DrawingGalleryComponent,
         UserGuideComponent,
         SaveDrawingComponent,
         ExportDrawingComponent,
         ColorPickerComponent,
         ColorPickerModalComponent,
         DrawingComponent,
        ],
         imports: [
            BrowserModule,
            MatAutocompleteModule,
            MatChipsModule,
            HttpClientModule,
            MatSidenavModule,
            MatListModule,
            BrowserAnimationsModule,
            MatInputModule,
            FormsModule,
            ReactiveFormsModule,
            MatDialogModule,
            MatButtonModule,
            MatIconModule,
            MatCardModule,
            NgbModule,
            MatRadioModule,
            MatSliderModule,
            RouterModule.forRoot([
                    { path: '', component: WelcomePageComponent },
                    { path: 'drawingview', component: DrawingViewComponent },
                    { path: 'userguide', component: UserGuideComponent },
                    { path: 'gallery', component: DrawingGalleryComponent },
            ])],
    providers: [      { provide: MatDialogRef, useClass: MockRef },
    ],
    bootstrap: [AppComponent],
    entryComponents: [CreateNewDrawingComponent ,
                      ColorPickerComponent ,
                      ExportDrawingComponent,
                      SaveDrawingComponent,
                      DrawingGalleryComponent,
                ],
})
export class AppModule {}
