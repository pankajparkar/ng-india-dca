import { Directive } from '@angular/core';
import { BlinkDirective } from './blink.directive';
import { BoldDirective } from './bold.directive';

class WithBold extends BoldDirective {
}

export class WithBoldAndBlink extends BlinkDirective {
}