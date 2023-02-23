import { Component } from '@angular/core';
import { BlinkDirective } from './directives/blink.directive';
import { BoldDirective } from './directives/bold.directive';
import { SimpleCardComponent } from './simple-card/simple-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    SimpleCardComponent,
    BlinkDirective,
    BoldDirective,
  ]
})
export class AppComponent {
  title = 'ng-india-dca';
}
