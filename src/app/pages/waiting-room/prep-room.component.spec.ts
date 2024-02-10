import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PrepRoomComponent } from './prep-room.component';

describe('LobbyComponent', () => {
  let component: PrepRoomComponent;
  let fixture: ComponentFixture<PrepRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepRoomComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
