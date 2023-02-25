import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlinkDirective } from './directives/blink.directive';
import { BoldDirective } from './directives/bold.directive';
import { SimpleCardComponent } from './components/simple-card.component';
import { NavbarComponent } from "./components/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  imports: [
    SimpleCardComponent,
    RouterOutlet,
    BlinkDirective,
    BoldDirective,
    NavbarComponent
  ]
})
export class AppComponent {
}
