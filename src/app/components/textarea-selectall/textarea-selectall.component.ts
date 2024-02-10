import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-textarea-selectall',
  templateUrl: './textarea-selectall.component.html',
  styleUrls: ['./textarea-selectall.component.scss']
})
export class TextareaSelectallComponent implements OnInit {
  @ViewChild('el', {read: ElementRef}) el!: ElementRef;

  @Input() text: string | undefined = '';

  constructor() { }

  ngOnInit(): void {
  }

  doClick() {
    this.el.nativeElement.focus();
    this.el.nativeElement.select();
  }
}
