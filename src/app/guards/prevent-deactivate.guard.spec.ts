import { TestBed } from '@angular/core/testing';

import { PreventDeactivateGuard } from './prevent-deactivate.guard';

describe('PreventDeactivateGuard', () => {
  let guard: PreventDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
