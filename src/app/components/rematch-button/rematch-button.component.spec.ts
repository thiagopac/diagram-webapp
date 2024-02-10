import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RematchButtonComponent } from './rematch-button.component';

describe('RematchButtonComponent', () => {
  let component: RematchButtonComponent;
  let fixture: ComponentFixture<RematchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RematchButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RematchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
