import { TestBed } from '@angular/core/testing';
import { ColorDataService } from './color-data.service';

describe('ColorService', () => {
    let service: ColorDataService;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.get(ColorDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#swapingColors should swap the primary color with the secondaryColor', () => {
        service.primaryColor = '#FFFF00';
        service.secondaryColor = '#000000';
        service.swapingColors();
        expect(service.primaryColor).toEqual('#000000');
        expect(service.secondaryColor).toEqual('#FFFF00');
    });
});
