import { Directive, Host, Optional, Self } from '@angular/core';
import { MatExpansionPanelHeader } from '@angular/material/expansion';

@Directive({
  selector: '[appPanelHeaderDisableEvents]'
})
export class PanelHeaderDisableEventsDirective {
  constructor(@Host() @Self() @Optional() public hostPanelHeader: MatExpansionPanelHeader) {
    hostPanelHeader._keydown = (event: KeyboardEvent) => {
      if (hostPanelHeader.panel.accordion) {
        hostPanelHeader.panel.accordion._handleHeaderKeydown(event);
      }
    };
  }
}
