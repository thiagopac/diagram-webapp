import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaSelectallComponent } from './textarea-selectall.component';

describe('TextareaSelectallComponent', () => {
  let component: TextareaSelectallComponent;
  let fixture: ComponentFixture<TextareaSelectallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextareaSelectallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaSelectallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
