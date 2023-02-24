import { Directive, EventEmitter, HostBinding, HostListener, inject, Input, Output, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appBlink]',
  standalone: true,
})
export class BlinkDirective {
  @HostBinding('style.animation')
  animation = 'blinker 1s step-start infinite';
  test = (inject(ViewContainerRef) as any)['_lContainer'][0][0].localName;

  @Input() theme = 'red';
  @Output() elementClick = new EventEmitter<MouseEvent>();

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    this.elementClick.emit(event);
    console.log(this.test, 'TTTT');
  }
}
