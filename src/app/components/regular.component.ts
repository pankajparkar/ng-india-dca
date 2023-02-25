import { Component } from '@angular/core';
import { SimpleCardComponent } from 'src/app/components/simple-card.component';

@Component({
  selector: 'app-regular',
  standalone: true,
  imports: [
    SimpleCardComponent,
  ],
  template: `
    <app-simple-card appBlink appBold></app-simple-card>
  `,
})
export class RegularComponent {

}
