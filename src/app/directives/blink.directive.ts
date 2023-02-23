import { Directive, ElementRef, HostBinding, inject } from '@angular/core';

@Directive({
  selector: '[appBlink]',
  standalone: true,
})
export class BlinkDirective {
  @HostBinding('style.animation')
  animation = 'blinker 1s step-start infinite';
}
