import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChessStatusService } from 'src/app/services/chess-status.service';

import { AnalyseButtonComponent } from './analyse-button.component';

describe('AnalyseButtonComponent', () => {
  let component: AnalyseButtonComponent;
  let fixture: ComponentFixture<AnalyseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyseButtonComponent ],
      providers: [ChessStatusService],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
