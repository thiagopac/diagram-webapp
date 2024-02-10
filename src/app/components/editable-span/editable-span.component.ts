import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { getLogger } from 'src/app/services/logger';

const logger = getLogger('editable-span.component');

@Component({
  selector: 'app-editable-span',
  templateUrl: './editable-span.component.html',
  styleUrls: ['./editable-span.component.scss']
})
export class EditableSpanComponent implements OnInit {
  @ViewChild('span', {read: ElementRef}) span!: ElementRef;
  @Input() value = -1;
  @Input() min = 0;
  @Input() max = 1000;
  @Input() setNumber: (v: number) => void = () => {};

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
  }

  onKeyPress(e: KeyboardEvent) {
    logger.debug('spankeypress', e.key);
    if (!(e.key >= '0' && e.key <= '9')) e.preventDefault();
    if (e.key === 'Enter') {
      this.span.nativeElement.blur();
    }
  }

  onBlur(e: Event) {
    this.document.removeEventListener('keydown', this.enterKeyHandler);
    this.onSpanValueChange((e as any).target.innerHTML);
  }

  onClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  onFocus(e: Event) {
    this.document.addEventListener('keydown', this.enterKeyHandler);
  }

  private onSpanValueChange(v: any) {
    logger.debug('SPAN VALUE CHANGE', v);
    if (!isNaN(v)) {
      let n = parseInt(v, 10);
      n = Math.min(this.max, Math.max(this.min, n));
      this.setNumber(n);
      this.span.nativeElement.innerHTML = n;
    }
  }

  private enterKeyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.document.removeEventListener('keydown', this.enterKeyHandler);
      this.span.nativeElement.blur();
    }
  }
}
