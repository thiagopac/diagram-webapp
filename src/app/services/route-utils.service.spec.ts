import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RouteUtilsService } from './route-utils.service';

describe('RouteUtilsService', () => {
  let service: RouteUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(RouteUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
