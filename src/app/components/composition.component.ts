import { Component } from '@angular/core';
import { SimpleCardComponent } from 'src/app/simple-card/simple-card.component';

@Component({
  selector: 'app-composition',
  standalone: true,
  imports: [
    SimpleCardComponent
  ],
  template: `
    <app-simple-card></app-simple-card>
  `,
})
export class CompositionComponent {

}
