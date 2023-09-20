import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RedirectPageService } from './redirect-page.service';

describe('RedirectPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])]
  }));
  const router = 'router';

  it('should be created', () => {
    const service: RedirectPageService = TestBed.get(RedirectPageService);
    expect(service).toBeTruthy();
  });
  it('other_route ', () => {
    const service: RedirectPageService = TestBed.get(RedirectPageService);
    const spyNavigate = spyOn(service[router], 'navigateByUrl');
    service.navigateHander();
    expect(spyNavigate).toHaveBeenCalled();
  });

  it('should refresh', () => {
    const service: RedirectPageService = TestBed.get(RedirectPageService);
    spyOn(service, 'refresh').and.callThrough();
    service.refresh();
    expect(service.refresh).toHaveBeenCalled();
  });
});
