import { Component } from '@angular/core';
import { TestingIdDirective } from '../directives/testing-id.directive';
import { SimpleCardComponent } from './simple-card.component';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [SimpleCardComponent],
  hostDirectives: [TestingIdDirective],
  template: `
    <app-simple-card></app-simple-card>
  `,
})
export class TestingComponent {

}
