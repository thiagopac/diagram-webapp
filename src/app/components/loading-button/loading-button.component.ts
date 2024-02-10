import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss']
})


export class LoadingButtonComponent implements OnInit {

  @Input() text = 'text';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() buttonClass = 'mat-raised-button';

  constructor() { }

  ngOnInit(): void { }

}
