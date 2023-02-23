import { Directive } from '@angular/core';

@Directive({
  selector: '[appBlink]',
  standalone: true
})
export class BlinkDirective {

  constructor() { }

}
