import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';

describe('AudioServiceService', () => {
  let service: AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: '' }
      ]
    });
    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
