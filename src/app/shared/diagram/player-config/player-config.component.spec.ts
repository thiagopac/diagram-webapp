import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerConfigComponent } from './player-config.component';

describe('PlayerConfigComponent', () => {
  let component: PlayerConfigComponent;
  let fixture: ComponentFixture<PlayerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
