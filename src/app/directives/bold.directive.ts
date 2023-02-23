import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appBold]',
  standalone: true
})
export class BoldDirective {
  @HostBinding('style.font-weight') bold = 'bolder';
}
