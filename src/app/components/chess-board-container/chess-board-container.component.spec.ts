import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessBoardContainerComponent } from './chess-board-container.component';

describe('ChessBoardContainerComponent', () => {
  let component: ChessBoardContainerComponent;
  let fixture: ComponentFixture<ChessBoardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChessBoardContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessBoardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
