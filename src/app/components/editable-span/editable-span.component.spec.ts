import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableSpanComponent } from './editable-span.component';

describe('EditableSpanComponent', () => {
  let component: EditableSpanComponent;
  let fixture: ComponentFixture<EditableSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableSpanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
