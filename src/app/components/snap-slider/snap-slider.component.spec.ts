import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapSliderComponent } from './snap-slider.component';

describe('SnapSliderComponent', () => {
  let component: SnapSliderComponent;
  let fixture: ComponentFixture<SnapSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnapSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
