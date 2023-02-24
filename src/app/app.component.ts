import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlinkDirective } from './directives/blink.directive';
import { BoldDirective } from './directives/bold.directive';
import { SimpleCardComponent } from './simple-card/simple-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <router-outlet></router-outlet>
  `,
  imports: [
    SimpleCardComponent,
    RouterOutlet,
    BlinkDirective,
    BoldDirective,
  ]
})
export class AppComponent {
}
