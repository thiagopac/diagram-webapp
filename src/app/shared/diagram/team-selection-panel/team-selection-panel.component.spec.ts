import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSelectionPanelComponent } from './team-selection-panel.component';

describe('TeamSelectionPanelComponent', () => {
  let component: TeamSelectionPanelComponent;
  let fixture: ComponentFixture<TeamSelectionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamSelectionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSelectionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
