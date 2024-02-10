import { TestBed } from '@angular/core/testing';

import { LichessService } from './lichess.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LichessService', () => {
  let service: LichessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(LichessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
